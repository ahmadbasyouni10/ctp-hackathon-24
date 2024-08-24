import { useState, useCallback, useRef, useEffect } from 'react';
import { APIProvider, Map, AdvancedMarker, useAdvancedMarkerRef, InfoWindow, useMap, useMapsLibrary } from '@vis.gl/react-google-maps';
import { Icon } from '@iconify/react';
import { MarkerClusterer } from "@googlemaps/markerclusterer";
import {
    Box,
    Flex,
    useDisclosure,
    Button,
    Drawer,
    DrawerBody,
    DrawerHeader,
    DrawerOverlay,
    DrawerContent,
    DrawerCloseButton,
    VStack,
    Checkbox,
    Accordion,
    AccordionItem,
    AccordionButton,
    AccordionPanel,
    AccordionIcon,
    List,
    ListItem,
    useColorModeValue,
    Divider,
    Heading,
    Text
  } from '@chakra-ui/react';
import "./Map.css";
import data from '../data';
const key = process.env.REACT_APP_GOOGLE_MAP_API;
const mapID = process.env.REACT_APP_MAP_ID;

const serviceIcons = {
  food_insecurity: "ic:round-food-bank",
  mental_health: "ri:mental-health-fill",
  health: "fluent-mdl2:health-solid",
  financial: "healthicons:finance-dept",
  housing: "game-icons:house"
};

const Directions = ({ origin, destination, mode, onClearDirection }) => {
    const map = useMap();
    const routesLibrary = useMapsLibrary('routes');
    const [directionsRenderer, setDirectionsRenderer] = useState(null);
    const [directionsService, setDirectionsService] = useState(null);
    const [selectedRoute, setSelectedRoute] = useState(null);
  
    useEffect(() => {
      if (!map || !routesLibrary) return;
  
      // Initialize DirectionsRenderer and DirectionsService
      const renderer = new routesLibrary.DirectionsRenderer({ map });
      const service = new routesLibrary.DirectionsService();
  
      setDirectionsRenderer(renderer);
      setDirectionsService(service);
    }, [map, routesLibrary]);
  
    useEffect(() => {
      if (!directionsRenderer || !directionsService || !origin || !destination) return;
  
      // Request directions
      const request = {
        origin,
        destination,
        travelMode: mode,
      };
  
      directionsService.route(request, (response, status) => {
        if (status === 'OK') {
          directionsRenderer.setDirections(response);
          setSelectedRoute(response.routes[0]); // Use only the first route
        } else {
          console.error('Directions request failed due to ', status);
        }
      });
    }, [directionsRenderer, directionsService, origin, destination, mode]);
  
    if (!selectedRoute) return null;
  
    const leg = selectedRoute.legs[0];
  
    const handleClear = () => {
      directionsRenderer.setDirections({ routes: [] });
      onClearDirection();
    };
  
    return (
      <div className='directions'>
        <h2>{selectedRoute.summary}</h2>
        <p>
          From: {leg.start_address.split(",")[0]} to {leg.end_address.split(",")[0]}
        </p>
        <p>Distance: {leg.distance?.text}</p>
        <p>Duration: {leg.duration?.text}</p>
        <button onClick={handleClear}>Clear Directions</button>
      </div>
    );
  };

const DirectionPanel = ({ origin, destination, clearDirections }) => {
  const [travelMode, setTravelMode] = useState('DRIVING');

  const handleModeChange = (event) => {
    setTravelMode(event.target.value);
  };

  return (
    <div id="directions-panel">
      <h1>See Directions</h1>
      <select value={travelMode} onChange={handleModeChange}>
        <option value="DRIVING">Driving</option>
        <option value="WALKING">Walking</option>
        <option value="BICYCLING">Bicycling</option>
        <option value="TRANSIT">Transit</option>
      </select>
      <p>Selected Mode: {travelMode}</p>
      <Directions origin={origin} destination={destination} mode={travelMode} onClearDirection={clearDirections}/>
    </div>
  );
};

const MarkerWithInfoWindow = ({ collegeName, markerKey, service, position, info, setMarkerRef, onMarkerClick }) => {
  const [markerRef, marker] = useAdvancedMarkerRef();
  const [infoWindowShown, setInfoWindowShown] = useState(false);

  // Define colors for different colleges
  const collegeColors = {
    'City College of New York': '#7d5cc6', // Example color for CCNY
    'Queens College': '#e71939', // Example color for Queens
    'Hunter College': '#60269e',
    'Baruch College': '#1f4a81',
    // Add more colleges and colors as needed
  };

  // Determine the color based on the collegeName
  const markerColor = collegeColors[collegeName] || '#0f9d58'; // Default color if collegeName is not found

  const handleDirection = () => {
    
  };
  const handleMarkerClick = () => {
    onMarkerClick(position);
    setInfoWindowShown(isShown => !isShown);
  };

  const handleClose = () => setInfoWindowShown(false);

  useEffect(() => {
    setMarkerRef(marker, markerKey);
    return () => setMarkerRef(null, markerKey);
  }, [marker, markerKey, setMarkerRef]);

  return (
    <>
      <AdvancedMarker
        ref={markerRef}
        position={position}
        onClick={handleMarkerClick}
      >
        <div className='purple-block' style={{ backgroundColor: markerColor }}>
          <Icon icon={serviceIcons[service]} />
        </div>
        {/* Alternatively, you can use <Pin> with custom styles if needed */}
      </AdvancedMarker>

      {infoWindowShown && (
        <InfoWindow anchor={marker} onClose={handleClose}>
          <Box p={4} bg="white" borderRadius="md" boxShadow="md" maxW="sm">
            <Heading as="h2" size="md" mb={2}>{collegeName}</Heading>
            <Text mb={2}>
              <a href={info.link} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', color: 'teal' }}>
                {info.text}
              </a>
            </Text>
            <Button colorScheme="teal" onClick={DirectionPanel}>See Directions</Button>
          </Box>
        </InfoWindow>
      )}
    </>
  );
};

const Markers = ({ collegeName, data, servicesVisibility, collegeVisibility, onMarkerClick }) => {
  const map = useMap();
  const [markers, setMarkers] = useState({});
  const clusterer = useRef(null);

  useEffect(() => {
    if (!map) return;
    if (!clusterer.current) {
      clusterer.current = new MarkerClusterer({ map});
    }
  }, [map]);

  useEffect(() => {
    clusterer.current?.clearMarkers();
    clusterer.current?.addMarkers(Object.values(markers));
  }, [markers]);

  const setMarkerRef = (marker, key) => {
    if (marker && markers[key]) return;
    if (!marker && !markers[key]) return;

    setMarkers((prev) => {
      if (marker) {
        return { ...prev, [key]: marker };
      } else {
        const newMarkers = { ...prev };
        delete newMarkers[key];
        return newMarkers;
      }
    });
  };

  return (
    <>
      {Object.entries(data).map(([serviceType, serviceData]) => {
        const serviceKeys = Object.keys(serviceData);
        const { lat, lng } = serviceData[serviceKeys[0]];
        const isVisible = servicesVisibility[serviceType] && collegeVisibility[collegeName];

        return isVisible ? (
          <MarkerWithInfoWindow
            key={`${collegeName}-${serviceType}`} // Ensure uniqueness of key
            collegeName={collegeName}
            service={serviceType}
            position={{ lat, lng }}
            info={serviceData.info}
            markerKey={serviceType}
            setMarkerRef={setMarkerRef}
            onMarkerClick={onMarkerClick}
          />
        ) : null;
      })}
    </>
  );
};

const RenderMap = () => {
    const [showCCNY, setShowCCNY] = useState(true);
    const [showQueens, setShowQueens] = useState(true);
    const [showHunter, setShowHunter] = useState(true);
    const [showBaruch, setShowBaruch] = useState(true);
    const [showFoodInsecurity, setShowFoodInsecurity] = useState(true);
    const [showMentalHealth, setShowMentalHealth] = useState(true);
    const [showHealth, setShowHealth] = useState(true);
    const [showFinancial, setShowFinancial] = useState(true);
    const [showHousing, setShowHousing] = useState(true);
    const [userLocation, setUserLocation] = useState(null);
    const [destination, setDestination] = useState(null);
    const bgColor = useColorModeValue("gray.900", "gray.900");
    const textColor = useColorModeValue("gray.100", "gray.100");
  
    const { isOpen, onOpen, onClose } = useDisclosure();
  
    const handleMarkerClick = useCallback((markerLocation) => {
      const options = {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0,
      };
      if (userLocation) {
        setDestination(markerLocation);
        onOpen();
      } else {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const latitude = position.coords.latitude;
            const longitude = position.coords.longitude;
            setUserLocation({ lat: latitude, lng: longitude });
            setDestination(markerLocation);
            onOpen();
          },
          (error) => {
            console.error("Error getting user's location:", error);
          },
          options
        );
      }
    }, [userLocation, onOpen]);
  
    const toggleServiceLayer = (serviceType) => {
      switch (serviceType) {
        case 'food_insecurity':
          setShowFoodInsecurity(!showFoodInsecurity);
          break;
        case 'mental_health':
          setShowMentalHealth(!showMentalHealth);
          break;
        case 'health':
          setShowHealth(!showHealth);
          break;
        case 'financial':
          setShowFinancial(!showFinancial);
          break;
        case 'housing':
          setShowHousing(!showHousing);
          break;
        default:
          break;
      }
    };
  
    const toggleCollegeLayer = (collegeName) => {
      switch (collegeName) {
        case 'City College of New York':
          setShowCCNY(!showCCNY);
          break;
        case 'Queens College':
          setShowQueens(!showQueens);
          break;
        case 'Hunter College':
          setShowHunter(!showHunter);
          break;
        case 'Baruch College':
          setShowBaruch(!showBaruch);
          break;
        default:
          break;
      }
    };
  
    const servicesVisibility = {
      food_insecurity: showFoodInsecurity,
      mental_health: showMentalHealth,
      health: showHealth,
      financial: showFinancial,
      housing: showHousing
    };
  
    const collegeVisibility = {
      'City College of New York': showCCNY,
      'Queens College': showQueens,
      'Hunter College': showHunter,
      'Baruch College': showBaruch
    };
  
    return (
        <APIProvider apiKey={key}>
        <Flex direction="row" h="100vh">
          <Drawer
            isOpen={isOpen}
            placement="right"
            onClose={onClose}
            size="md"
          >
            <DrawerOverlay />
            <DrawerContent color={textColor} bgColor={bgColor} >
              <DrawerCloseButton />
              <DrawerHeader>Filters & Directions</DrawerHeader>
              <DrawerBody>
              <VStack align="start" spacing={4}>
                <Accordion allowToggle>
                  <AccordionItem>
                    <h2>
                      <AccordionButton width="300px">
                        <Box flex="1" textAlign="left">
                          Services
                        </Box>
                        <AccordionIcon />
                      </AccordionButton>
                    </h2>
                    <AccordionPanel pb={4}>
                      <List spacing={3}>
                        <ListItem>
                          <Checkbox isChecked={showFoodInsecurity} onChange={() => toggleServiceLayer('food_insecurity')}>
                            Food Insecurity
                          </Checkbox>
                        </ListItem>
                        <ListItem>
                          <Checkbox isChecked={showMentalHealth} onChange={() => toggleServiceLayer('mental_health')}>
                            Mental Health
                          </Checkbox>
                        </ListItem>
                        <ListItem>
                          <Checkbox isChecked={showHealth} onChange={() => toggleServiceLayer('health')}>
                            Health
                          </Checkbox>
                        </ListItem>
                        <ListItem>
                          <Checkbox isChecked={showFinancial} onChange={() => toggleServiceLayer('financial')}>
                            Financial
                          </Checkbox>
                        </ListItem>
                        <ListItem>
                          <Checkbox isChecked={showHousing} onChange={() => toggleServiceLayer('housing')}>
                            Housing
                          </Checkbox>
                        </ListItem>
                      </List>
                    </AccordionPanel>
                  </AccordionItem>

                  <AccordionItem>
                    <h2>
                      <AccordionButton>
                        <Box flex="1" textAlign="left">
                          Colleges
                        </Box>
                        <AccordionIcon />
                      </AccordionButton>
                    </h2>
                    <AccordionPanel pb={4}>
                      <List spacing={3}>
                        <ListItem>
                          <Checkbox isChecked={showCCNY} onChange={() => toggleCollegeLayer('City College of New York')}>
                            City College of New York
                          </Checkbox>
                        </ListItem>
                        <ListItem>
                          <Checkbox isChecked={showQueens} onChange={() => toggleCollegeLayer('Queens College')}>
                            Queens College
                          </Checkbox>
                        </ListItem>
                        <ListItem>
                          <Checkbox isChecked={showHunter} onChange={() => toggleCollegeLayer('Hunter College')}>
                            Hunter College
                          </Checkbox>
                        </ListItem>
                        <ListItem>
                          <Checkbox isChecked={showBaruch} onChange={() => toggleCollegeLayer('Baruch College')}>
                            Baruch College
                          </Checkbox>
                        </ListItem>
                      </List>
                    </AccordionPanel>
                  </AccordionItem>
                </Accordion>

                <Divider/>

                {userLocation && destination && (
                  <Directions origin={userLocation} destination={destination} onClose={onClose} />
                )}
              </VStack>
              </DrawerBody>
            </DrawerContent>
          </Drawer>
          <Box flex="1" position="relative">
            <Map
              style={{ width: '100%', height: '100%' }}
              defaultCenter={{ lat: 40.75590500303492, lng: -73.8848698749948 }}
              defaultZoom={11.6}
              gestureHandling={'greedy'}
              mapId={mapID}
            >
              {data.map((college, collegeIndex) =>
                Object.entries(college).map(([collegeName, services]) => (
                  <Markers
                    key={`${collegeIndex}-${collegeName}`}
                    collegeName={collegeName}
                    data={services}
                    servicesVisibility={servicesVisibility}
                    collegeVisibility={collegeVisibility}
                    onMarkerClick={handleMarkerClick}
                  />
                ))
              )}
            </Map>
            <Button
              position="absolute"
              top="1rem"
              right="1rem"
              zIndex="overlay"
              colorScheme="teal"
              onClick={onOpen}
            >
              Open Sidebar
            </Button>
          </Box>
        </Flex>
      </APIProvider>
    );
  };
export default RenderMap;
