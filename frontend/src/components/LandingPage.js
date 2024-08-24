import React, { useState } from "react";
import {
  Box,
  Button,
  Heading,
  VStack,
  Text,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  FormControl,
  FormLabel,
  Input,
  Textarea,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import Slideshow from "./Slideshow";

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
            CUNY Guide
          </Heading>
          <Text fontSize="4xl" color="white">
            Empowering You with Essential Resources 🚀
          </Text>

          <div style={{ display: "flex", gap: "10px" }}>
            <Button
              colorScheme="blue"
              size="lg"
              onClick={() => navigate("/chat", { state: { school: "CCNY" } })}
            >
              Start CCNY Chatbot
            </Button>
            <Button
              colorScheme="blue"
              size="lg"
              onClick={() => navigate("/map")}
            >
              Go to Map
            </Button>
          </div>
        </VStack>
      </Box>
    </>
  );
}

export default LandingPage;
