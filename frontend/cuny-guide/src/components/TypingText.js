import React, { useState, useEffect } from 'react';
import { Text } from '@chakra-ui/react';

function TypingText({ text = '', color = "black" }) {
  const [displayedText, setDisplayedText] = useState('');

  useEffect(() => {
    if (!text) return; // Add this check

    let i = 0;
    const typingInterval = setInterval(() => {
      if (i < text.length) {
        setDisplayedText(text.substring(0, i + 1));
        i++;
      } else {
        clearInterval(typingInterval);
      }
    }, 30);

    return () => clearInterval(typingInterval);
  }, [text]);

  return (
    <Text
      color={color}
      fontWeight="semibold"
      fontSize="md"
    >
      {displayedText}
    </Text>
  );
}

export default TypingText;