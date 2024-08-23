import React from 'react';
import { Box, Button, Heading, VStack, Text, Wrap, WrapItem } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';

const cunySchools = [
  'CSI', 'Hunter', 'CCNY', 'Baruch', 'Queens', 'John Jay', 'Brooklyn'
];

function LandingPage() {
  const navigate = useNavigate();

  return (
    <Box height="calc(100vh - 68px)" display="flex" alignItems="center" justifyContent="center">
      <VStack spacing={8}>
        <Heading as="h1" size="2xl">CUNY Guide for Students</Heading>
        <Text fontSize="xl">Hello Ahmad, learn more about your school🚀</Text>
        <Wrap justify="center" spacing={4}>
          {cunySchools.map(school => (
            <WrapItem key={school}>
              <Button colorScheme="blue" onClick={() => navigate('/chat', { state: { school } })}>
                {school}
              </Button>
            </WrapItem>
          ))}
        </Wrap>
        <Text fontSize="l">Get to know all the available resources locations!</Text>
        <Button colorScheme="blue" onClick={() => navigate('/map')}>
            Visit Map Page
        </Button>
      </VStack>
    </Box>
  );
}

export default LandingPage;