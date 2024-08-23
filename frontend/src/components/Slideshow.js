import React, { useState, useEffect, useMemo } from 'react';
import { Box } from '@chakra-ui/react';
import './Slideshow.css'; // Import the CSS file

const Slideshow = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const images = useMemo(() => [
    '/Brooklyn-College.jpg',
    '/City-College.jpg',
    '/City-Tech.jpg',
    '/Queensborough-Community-College.jpg',
    '/Kingsborough-Community-College.jpg'
  ], []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex(prevIndex => (prevIndex + 1) % images.length);
    }, 5000); // Change image every 5 seconds

    return () => clearInterval(interval); // Cleanup on component unmount
  }, [images]);

  return (
    <Box
      className="slideshow"
      height="calc(100vh - 68px)"
      width="100vw"
      display="flex"
      alignItems="center"
      justifyContent="center"
      overflow="hidden"
    >
      <div
        className="fade-image"
        style={{ backgroundImage: `url(${images[currentIndex]})` }}
      ></div>
    </Box>
  );
};

export default Slideshow;
