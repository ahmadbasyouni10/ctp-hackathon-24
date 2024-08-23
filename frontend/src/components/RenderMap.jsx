import { useState, useCallback, useRef, useEffect } from 'react';
import { APIProvider, Map, AdvancedMarker, useAdvancedMarkerRef, InfoWindow, useMap, useMapsLibrary } from '@vis.gl/react-google-maps';
import { Icon } from '@iconify/react';
import { MarkerClusterer } from "@googlemaps/markerclusterer";
import "./RenderMap.css";
const key = process.env.REACT_APP_GOOGLE_MAP_API;
const mapID = process.env.REACT_APP_MAP_ID;

const CCNY_SERVICES = {
  'food_insecurity': {
    'NAC': { lat: 40.819713235007384, lng: -73.95014023322595 },
    'info': 'The food pantry is located in the NAC building on the 3rd floor. It is open to all students and staff.'
  },
  'mental_health': {
    'Marshak': { lat: 40.819441356346, lng: -73.94940740874056 },
    'info': 'Counseling provides students with a safe, confidential, and nonjudgmental space to voice their concerns and address these concerns with a counselor.'
  },
  'health': {
    'Marshak': { lat: 40.819441356346, lng: -73.94940740874056 },
    'info': 'Student Health Services (SHS) is committed to providing quality care and empowering students to make informed decisions about their health.'
  },
  'financial': {
    'NAC': { lat: 40.819713235007384, lng: -73.95014023322595 },
    'info': 'The City College Financial Aid Office administers federal and state funds, as well as those provided by special programs, the City University of New York and the College itself, to ensure that you have an opportunity to pursue higher education at CCNY.'
  },
};

const serviceIcons = {
  food_insecurity: "ic:round-food-bank",
  mental_health: "ri:mental-health-fill",
  health: "fluent-mdl2:health-solid",
  financial: "healthicons:finance-dept",
};

const useDirections = ({ origin, destination, mode }) => {
  const map = useMap();
  const routesLibrary = useMapsLibrary('routes');
  const [directionsRenderer, setDirectionsRenderer] = useState(null);
  const [directionsService, setDirectionsService] = useState(null);

  useEffect(() => {
    if (!map || !routesLibrary) return;

    const renderer = new routesLibrary.DirectionsRenderer({ map });
    setDirectionsRenderer(renderer);
    const service = new routesLibrary.DirectionsService();
    setDirectionsService(service);
  }, [map, routesLibrary]);

  useEffect(() => {
    if (!directionsRenderer || !directionsService) return;

    const request = {
      origin,
      destination,
      travelMode: mode,
    };

    directionsService.route(request, (response, status) => {
      if (status === 'OK') {
        directionsRenderer.setDirections(response);
      } else {
        console.error('Directions request failed due to ', status);
      }
    });
  }, [directionsRenderer, directionsService, origin, destination, mode]);

  return null;
};

const DirectionPanel = ({ origin, destination }) => {
  const [travelMode, setTravelMode] = useState('DRIVING');

  useDirections({ origin, destination, mode: travelMode });

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
    </div>
  );
};

const MarkerWithInfoWindow = ({ markerKey, service, position, info, setMarkerRef, onMarkerClick }) => {
  const [markerRef, marker] = useAdvancedMarkerRef();
  const [infoWindowShown, setInfoWindowShown] = useState(false);

  const handleMarkerClick = () => {
    setInfoWindowShown(isShown => !isShown);
    onMarkerClick(position);
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
        <div className='purple-block'>
          <Icon icon={serviceIcons[service]} />
        </div>
      </AdvancedMarker>

      {infoWindowShown && (
        <InfoWindow anchor={marker} onClose={handleClose}>
          <h2>{service}</h2>
          <p>{info}</p>
        </InfoWindow>
      )}
    </>
  );
};

const Markers = ({ data, visibility, onMarkerClick }) => {
  const map = useMap();
  const [markers, setMarkers] = useState({});
  const clusterer = useRef(null);

  useEffect(() => {
    if (!map) return;
    if (!clusterer.current) {
      clusterer.current = new MarkerClusterer({ map });
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
      {Object.entries(data).map(([serviceType, serviceData], index) => {
        if (visibility[serviceType]) {
          return (
            <MarkerWithInfoWindow
              key={index}
              service={serviceType}
              position={{ lat: serviceData[Object.keys(serviceData)[0]].lat, lng: serviceData[Object.keys(serviceData)[0]].lng }}
              info={serviceData.info}
              markerKey={serviceType}
              setMarkerRef={setMarkerRef}
              onMarkerClick={onMarkerClick}
            />
          );
        }
        return null;
      })}
    </>
  );
};

function RenderMap() {
    console.log(key);
    console.log(mapID);
  const [showFoodInsecurity, setShowFoodInsecurity] = useState(true);
  const [showMentalHealth, setShowMentalHealth] = useState(true);
  const [showHealth, setShowHealth] = useState(true);
  const [showFinancial, setShowFinancial] = useState(true);
  const [isPanelVisible, setIsPanelVisible] = useState(false);
  const [userLocation, setUserLocation] = useState(null);
  const [destination, setDestination] = useState(null);

  const handleMarkerClick = useCallback((markerLocation) => {
    const options = {
      enableHighAccuracy: true,
      timeout: 5000,
      maximumAge: 0,
    };
    if (userLocation) {
      setDestination(markerLocation);
      setIsPanelVisible(true);
    } else {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const latitude = position.coords.latitude;
          const longitude = position.coords.longitude;
          setUserLocation({ lat: latitude, lng: longitude });
          setDestination(markerLocation);
          setIsPanelVisible(true);
        },
        (error) => {
          console.error("Error getting user's location:", error);
        },
        options
      );
    }
  }, [userLocation]);

  const toggleLayer = (serviceType) => {
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
      default:
        break;
    }
  };

  const visibility = {
    food_insecurity: showFoodInsecurity,
    mental_health: showMentalHealth,
    health: showHealth,
    financial: showFinancial,
  };

  return (
    <APIProvider apiKey={key}>
      <Map
          style={{ width: '100vw', height: '100vh' }}
          defaultCenter={{ lat: 40.75590500303492, lng: -73.8848698749948 }}
          defaultZoom={11.6}
          gestureHandling={'greedy'}
          // disableDefaultUI={true}
          mapId={mapID}
        >
        <Markers data={CCNY_SERVICES} visibility={visibility} onMarkerClick={handleMarkerClick} />
        {isPanelVisible && <DirectionPanel origin={userLocation} destination={destination} />}
      </Map>
      <div className="layer-toggle">
        <label>
          <input
            type="checkbox"
            checked={showFoodInsecurity}
            onChange={() => toggleLayer('food_insecurity')}
          />
          Food Insecurity
        </label>
        <label>
          <input
            type="checkbox"
            checked={showMentalHealth}
            onChange={() => toggleLayer('mental_health')}
          />
          Mental Health
        </label>
        <label>
          <input
            type="checkbox"
            checked={showHealth}
            onChange={() => toggleLayer('health')}
          />
          Health
        </label>
        <label>
          <input
            type="checkbox"
            checked={showFinancial}
            onChange={() => toggleLayer('financial')}
          />
          Financial
        </label>
      </div>
    </APIProvider>
  );
}

export default RenderMap;
