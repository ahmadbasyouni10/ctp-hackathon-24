import React, { useState, useEffect } from 'react';
import { Text } from '@chakra-ui/react';

function TypingText({ text }) {
  const [displayedText, setDisplayedText] = useState('');

  useEffect(() => {
    let i = 0;
    const typingInterval = setInterval(() => {
      if (i < text.length) {
        setDisplayedText((prev) => prev + text.charAt(i));
        i++;
      } else {
        clearInterval(typingInterval);
      }
    }, 50);

    return () => clearInterval(typingInterval);
  }, [text]);

  return <Text>{displayedText}</Text>;
}

export default TypingText;