import React from "react";
import {
  ChakraProvider,
  CSSReset,
  Box,
  Flex,
  Image,
  Text,
} from "@chakra-ui/react";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import LandingPage from "./components/LandingPage";
import ChatbotOpenAIPage from "./components/ChatbotOpenAIPage";
import MapPage from "./components/MapPage";

function App() {
  return (
    <ChakraProvider>
      <CSSReset />
      <Router>
        <Box>
          <Flex justify="space-between" align="center" p={4} bg="gray.100">
            <Link to="/">
              <Text
                bgGradient="linear(to-r, blue.400, purple.500)"
                bgClip="text"
                fontSize="3xl"
                fontWeight="extrabold"
              >
                CUNY Guide
              </Text>
            </Link>
            <Image src="/CUNYYY.png" alt="CUNY Logo" boxSize="40px" />
            <Text fontSize="25px" fontWeight="bold" color="blue.500">
            StealthAI
            </Text>
          </Flex>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/chat" element={<ChatbotOpenAIPage />} />
            <Route path="/map" element={<MapPage />} />

          </Routes>
        </Box>
      </Router>
    </ChakraProvider>
  );
}

export default App;
