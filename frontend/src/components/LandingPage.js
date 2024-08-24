import React, { useState } from 'react';
import { Box, Button, Heading, VStack, Text, Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton, useDisclosure, FormControl, FormLabel, Input, Textarea } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import Slideshow from './Slideshow';

function LandingPage() {
  const navigate = useNavigate();

  return (
    <>
      <Slideshow />
      <Box
        position="absolute"
        top="50%"
        left="50%"
        transform="translate(-50%, -50%)"
        backgroundColor="rgba(255, 255, 255, 0.1)"
        backdropFilter="blur(10px)"
        padding="60px"
        boxShadow="0 4px 6px rgba(0, 0, 0, 0.1)"
        borderRadius="20px"
      >
        <VStack spacing={8}>
          <Heading as="h1" size="4xl" color="white">
            CUNYHub
          </Heading>
          <Text fontSize="4xl" color="white">
            Empowering You with Essential Resources 🚀
          </Text>
          <Button
            colorScheme="blue"
            size="lg"
            onClick={() => navigate('/chat/openai', { state: { school: 'CCNY' } })}
          >
            Start CCNY Guide
          </Button>
        </VStack>
      </Box>
    </>
  );
}

export default LandingPage;