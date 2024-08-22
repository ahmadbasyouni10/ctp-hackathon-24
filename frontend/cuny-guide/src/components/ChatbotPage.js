import React, { useState, useEffect } from 'react';
import { Box, Button, Input, VStack, Text, Flex, Heading } from '@chakra-ui/react';
import { useLocation } from 'react-router-dom';
import TypingText from './TypingText';

function ChatbotPage() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const location = useLocation();
  const selectedSchool = location.state?.school || 'CUNY';

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
    <Flex height="calc(100vh - 68px)" bg="gray.800">
      <VStack width="250px" p={4} spacing={4} alignItems="stretch">
        <Heading as="h2" size="lg" color="white">Hello Ahmad, 👋</Heading>
        <Button onClick={startNewChat} colorScheme="purple">Start new chat</Button>
      </VStack>
      <Box flex={1} bg="gray.700" borderLeft="1px solid" borderColor="gray.600">
        <Heading as="h2" size="lg" p={4} color="white" borderBottom="1px solid" borderColor="gray.600">
          Advisor
        </Heading>
        <Box height="calc(100% - 140px)" overflowY="auto" p={4}>
          {messages.map((message, index) => (
            <Flex key={index} justifyContent={message.sender === 'user' ? 'flex-end' : 'flex-start'} mb={4}>
              <Box
                bg={message.sender === 'user' ? 'blue.500' : 'purple.500'}
                color="white"
                p={2}
                borderRadius="md"
                maxWidth="70%"
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
        <Box p={4} borderTop="1px solid" borderColor="gray.600">
          <Flex>
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your message..."
              mr={2}
              bg="gray.600"
              color="white"
              _placeholder={{ color: 'gray.300' }}
            />
            <Button onClick={handleSend} colorScheme="purple">Send</Button>
          </Flex>
        </Box>
      </Box>
    </Flex>
  );
}

export default ChatbotPage;