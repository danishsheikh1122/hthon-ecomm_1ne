// NavBarMic.jsx
import React, { useState } from 'react';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import { Mic } from 'lucide-react'; // Ensure you've installed 'lucide-react'

const NavBarMic = () => {
  const [inputValue, setInputValue] = useState('');
  const { transcript, listening, resetTranscript } = useSpeechRecognition();

  // Handle speech recognition results
  const startListening = () => {
    SpeechRecognition.startListening({ continuous: true });
  };

  const stopListening = () => {
    SpeechRecognition.stopListening();
    setInputValue(transcript); // Update input with recognized speech
  };

  return (
    <div className="navbar flex items-center gap-2 p-4 border-b">
      <input 
        type="text" 
        value={inputValue} 
        placeholder="Speak to search..." 
        readOnly 
        className="input border rounded p-2 flex-1"
      />
      <button 
        onClick={listening ? stopListening : startListening} 
        className="mic-button flex items-center justify-center p-2 border rounded bg-gray-200 hover:bg-gray-300"
      >
        <Mic color={listening ? 'red' : 'black'} />
      </button>
    </div>
  );
};

export default NavBarMic;
