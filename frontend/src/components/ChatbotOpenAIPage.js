import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom"; // Add this import
import {
  Box,
  Button,
  Input,
  VStack,
  Text,
  Flex,
  Heading,
  useColorModeValue,
} from "@chakra-ui/react";
import axios from "axios";
import TypingText from "./TypingText";

function ChatbotOpenAIPage() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const location = useLocation();
  const selectedSchool = location.state?.school || "CUNY";

  // Color mode values
  const bgColor = useColorModeValue("gray.900", "gray.900");
  const textColor = useColorModeValue("gray.100", "gray.100");
  const primaryColor = useColorModeValue("blue.500", "blue.300");
  const secondaryColor = useColorModeValue("blue.600", "blue.400");
  const inputBgColor = useColorModeValue("gray.800", "gray.800");

  useEffect(() => {
    setMessages([
      {
        text: `Welcome to the ${selectedSchool} guide! How can I assist you today?`,
        sender: "bot",
      },
    ]);
  }, [selectedSchool]);

  const handleSend = async () => {
    if (input.trim()) {
      setIsLoading(true);
      const userMessage = { text: input, sender: "user" };
      setMessages((prevMessages) => [...prevMessages, userMessage]);
      setInput("");

      try {
        const response = await axios.post("/api/chat-openai", {
          messages: [...messages, userMessage].map((m) => ({
            role: m.sender === "user" ? "user" : "assistant",
            content: m.text,
          })),
          school: selectedSchool,
        });

        setMessages((prevMessages) => [
          ...prevMessages,
          { text: response.data || "No response", sender: "bot" },
        ]);
      } catch (error) {
        console.error("Error sending message:", error);
        setMessages((prevMessages) => [
          ...prevMessages,
          {
            text: "Sorry, I encountered an error. Please try again.",
            sender: "bot",
          },
        ]);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const startNewChat = () => {
    setMessages([
      {
        text: `Welcome to the ${selectedSchool} guide! How can I assist you today?`,
        sender: "bot",
      },
    ]);
  };

  return (
    <Flex height="calc(100vh - 68px)" bg={bgColor}>
      <VStack
        width="250px"
        p={4}
        spacing={4}
        alignItems="stretch"
        borderRight="1px solid"
        borderColor="gray.700"
      >
        <Heading as="h2" size="lg" color={textColor}>
          Hello Ahmad, 👋
        </Heading>
        <Button onClick={startNewChat} colorScheme="blue">
          Start new chat
        </Button>
      </VStack>
      <Box flex={1}>
        <Heading
          as="h2"
          size="lg"
          p={4}
          color={textColor}
          borderBottom="1px solid"
          borderColor="gray.700"
        >
          {selectedSchool
            ? `${selectedSchool.toUpperCase()} Guide`
            : "Select a School"}
        </Heading>
        <Box height="calc(100% - 140px)" overflowY="auto" p={4}>
          {messages.map((message, index) => (
            <Flex
              key={index}
              justifyContent={
                message.sender === "user" ? "flex-end" : "flex-start"
              }
              mb={4}
            >
              <Box
                bg={message.sender === "user" ? secondaryColor : primaryColor}
                p={3}
                borderRadius="lg"
                maxWidth="70%"
                boxShadow="md"
              >
                {message.sender === "bot" ? (
                  <TypingText text={message.text} color="black" />
                ) : (
                  <Text color="black" fontWeight="semibold" fontSize="md">
                    {message.text}
                  </Text>
                )}
              </Box>
            </Flex>
          ))}
        </Box>
        <Box p={4} borderTop="1px solid" borderColor="gray.700">
          <Flex>
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your message..."
              mr={2}
              bg={inputBgColor}
              color={textColor}
              _placeholder={{ color: "gray.500" }}
              borderColor="gray.600"
              isDisabled={isLoading}
            />
            <Button
              onClick={handleSend}
              colorScheme="blue"
              isLoading={isLoading}
              loadingText="Sending..."
              isDisabled={!input.trim()}
            >
              Send
            </Button>
          </Flex>
        </Box>
      </Box>
    </Flex>
  );
}

export default ChatbotOpenAIPage;
