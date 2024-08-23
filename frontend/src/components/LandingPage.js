import React from 'react';
import { Box, Button, Heading, VStack, Text, Wrap, WrapItem } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import Slideshow from './Slideshow';
const cunySchools = [
  ['CSI',false], ['Hunter',false], ['CCNY',true], ['Baruch',false], ['Queens',false], ['John Jay',false], ['Brooklyn',false]
];

function LandingPage() {
  const navigate = useNavigate();
  return (
    <>
      <Slideshow></Slideshow>
      <Box position="absolute" top="50%" left="50%" transform="translate(-50%, -50%)" backgroundColor="rgba(255, 255, 255, 0.1)" backdropFilter="blur(10px)" padding="60px" boxShadow="0 4px 6px rgba(0, 0, 0, 0.1)" borderRadius="20px">
        <VStack spacing={8}>
          <Heading as="h1" size="4xl" color="white">CUNYHub</Heading>
          <Text fontSize="4xl" color="white">Empowering You with Essential Resources 🚀</Text>
          <Wrap justify="center" spacing={4}>
            {cunySchools.map(school => (
              <WrapItem key={school}>
                <Button colorScheme="blue" onClick={() => school[1] && navigate('/chat', { state: school[0] })}>
                  {school}
                </Button>
              </WrapItem>
            ))}
          </Wrap>
        </VStack>
      </Box>
    </>
    
  );
}

export default LandingPage;