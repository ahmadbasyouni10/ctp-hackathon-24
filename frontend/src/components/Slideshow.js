import React, { useState, useEffect, useMemo } from 'react';
import { Box } from '@chakra-ui/react';
import './Slideshow.css';

const Slideshow = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [nextIndex, setNextIndex] = useState(1);

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
      setNextIndex(prevIndex => (prevIndex + 1) % images.length);
    }, 5000);

    return () => clearInterval(interval);
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
      position="relative"
    >
      <div
        className="fade-image"
        style={{
          backgroundImage: `url(${images[currentIndex]})`,
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          opacity: 1,
          transition: 'opacity 1s ease-in-out',
        }}
      ></div>
      <div
        className="fade-image"
        style={{
          backgroundImage: `url(${images[nextIndex]})`,
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          opacity: 0,
          transition: 'opacity 1s ease-in-out',
        }}
      ></div>
    </Box>
  );
};

export default Slideshow;