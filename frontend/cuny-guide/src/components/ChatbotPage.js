import React, { useState, useEffect } from 'react';
import { Box, Button, Input, VStack, Text, Flex, Heading, useColorModeValue } from '@chakra-ui/react';
import { useLocation } from 'react-router-dom';
import TypingText from './TypingText';

function ChatbotPage() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const location = useLocation();
  const selectedSchool = location.state?.school || 'CUNY';

  // Color mode values
  const bgColor = useColorModeValue('gray.900', 'gray.900');
  const textColor = useColorModeValue('gray.100', 'gray.100');
  const primaryColor = useColorModeValue('blue.500', 'blue.300');
  const secondaryColor = useColorModeValue('blue.600', 'blue.400');
  const inputBgColor = useColorModeValue('gray.800', 'gray.800');

  useEffect(() => {
    setMessages([{ text: `Welcome to the ${selectedSchool} guide! How can I assist you today?`, sender: 'bot' }]);
  }, [selectedSchool]);

  const handleSend = () => {
    if (input.trim()) {
      setMessages([...messages, { text: input, sender: 'user' }]);
      setTimeout(() => {
        setMessages(msgs => [...msgs, { text: `You asked about ${input} for ${selectedSchool}. Here's some information...`, sender: 'bot' }]);
      }, 1000);
      setInput('');
    }
  };

  const startNewChat = () => {
    setMessages([{ text: `Welcome to the ${selectedSchool} guide! How can I assist you today?`, sender: 'bot' }]);
  };

  return (
    <Flex height="calc(100vh - 68px)" bg={bgColor}>
      <VStack width="250px" p={4} spacing={4} alignItems="stretch" borderRight="1px solid" borderColor="gray.700">
        <Heading as="h2" size="lg" color={textColor}>Hello Ahmad, 👋</Heading>
        <Text color="gray.400">You've completed all career related milestones! 🎉</Text>
        <Button onClick={startNewChat} colorScheme="blue">
          Start new chat
        </Button>
      </VStack>
      <Box flex={1}>
        <Heading as="h2" size="lg" p={4} color={textColor} borderBottom="1px solid" borderColor="gray.700">
          Advisor
        </Heading>
        <Box height="calc(100% - 140px)" overflowY="auto" p={4}>
          {messages.map((message, index) => (
            <Flex key={index} justifyContent={message.sender === 'user' ? 'flex-end' : 'flex-start'} mb={4}>
              <Box
                bg={message.sender === 'user' ? secondaryColor : primaryColor}
                color={textColor}
                p={3}
                borderRadius="lg"
                maxWidth="70%"
                boxShadow="md"
              >
                {message.sender === 'bot' ? (
                  <TypingText text={message.text} />
                ) : (
                  <Text>{message.text}</Text>
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
              _placeholder={{ color: 'gray.500' }}
              borderColor="gray.600"
            />
            <Button onClick={handleSend} colorScheme="blue">
              Send
            </Button>
          </Flex>
        </Box>
      </Box>
    </Flex>
  );
}

export default ChatbotPage;