import React, { useState, useEffect } from 'react';
import { Text } from '@chakra-ui/react';

function TypingText({ text }) {
  const [displayedText, setDisplayedText] = useState('');

  useEffect(() => {
    console.log("TypingText received:", text);
    let i = 0;
    const typingInterval = setInterval(() => {
      if (i < text.length) {
        setDisplayedText((prev) => {
          const newText = text.substring(0, i + 1);
          console.log("Setting displayed text:", newText);
          return newText;
        });
        i++;
      } else {
        clearInterval(typingInterval);
      }
    }, 25);

    return () => clearInterval(typingInterval);
  }, [text]);

  return (
    <>
      <Text>{displayedText}</Text>
    </>
  );
}

export default TypingText;