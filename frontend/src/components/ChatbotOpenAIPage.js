import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import {
  Box,
  Button,
  Input,
  VStack,
  Text,
  Flex,
  Heading,
  useColorModeValue,
  useBreakpointValue,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  FormControl,
  FormLabel,
  Textarea,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import axios from "axios";
import TypingText from "./TypingText";

function ChatbotOpenAIPage() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [feedbackQuestion, setFeedbackQuestion] = useState("");
  const location = useLocation();
  const selectedSchool = location.state?.school || "CUNY";
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

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
        const response = await axios.post("/api/chat", {
          messages: [...messages, userMessage].map((m) => ({
            role: m.sender === "user" ? "user" : "assistant",
            content: m.text,
          })),
          school: selectedSchool,
        });

        const botResponse = response.data || "No response";
        setMessages((prevMessages) => [
          ...prevMessages,
          { 
            text: botResponse, 
            sender: "bot",
            showFeedbackButton: botResponse.includes("I'm sorry, I don't have that specific information.")
          },
        ]);

        if (botResponse.includes("I'm sorry, I don't have that specific information.")) {
          setFeedbackQuestion(input);
        }
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

  const handleFeedbackSubmit = async (details) => {
    try {
      await axios.post("/api/feedback/submit-feedback", {
        question: feedbackQuestion,
        details,
        school: selectedSchool,
      });
      onClose();
      toast({
        title: "Question submitted successfully ✅",
        status: "success",
        duration: 3000,
        isClosable: true,
        position: "top",
      });
    } catch (error) {
      console.error("Error submitting feedback:", error);
      toast({
        title: "Failed to submit question",
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "top",
      });
    }
  };

  const displayValue = useBreakpointValue({ base: "none", md: "flex" });

  return (
    <Flex height="calc(100vh - 68px)" bg={bgColor}>
      <VStack
        width="250px"
        p={4}
        spacing={4}
        alignItems="stretch"
        borderRight="1px solid"
        borderColor="gray.700"
        display={displayValue}
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
              direction="column"
              alignItems={message.sender === "user" ? "flex-end" : "flex-start"}
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
              {message.showFeedbackButton && (
                <Button
                  size="sm"
                  colorScheme="blue"
                  mt={2}
                  onClick={() => {
                    setFeedbackQuestion(messages[messages.length - 2].text);
                    onOpen();
                  }}
                >
                  Let us know
                </Button>
              )}
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
      <FeedbackModal
        isOpen={isOpen}
        onClose={onClose}
        onSubmit={handleFeedbackSubmit}
      />
    </Flex>
  );
}

function FeedbackModal({ isOpen, onClose, onSubmit }) {
  const [details, setDetails] = useState("");

  const handleSubmit = () => {
    onSubmit(details);
    setDetails("");
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Let Us Know</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <FormControl>
            <FormLabel>Submit New Questions</FormLabel>
            <Textarea
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              placeholder="Please provide any additional information or context for your question..."
            />
          </FormControl>
        </ModalBody>
        <ModalFooter>
          <Button colorScheme="blue" mr={3} onClick={handleSubmit}>
            Submit
          </Button>
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

export default ChatbotOpenAIPage;