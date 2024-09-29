import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { AnimatePresence } from 'framer-motion';
import { GoDotFill } from 'react-icons/go';
import { RxCrossCircled } from 'react-icons/rx';
import { AiOutlineSend } from 'react-icons/ai';
import axios from 'axios';
import './ChatBot.css';

const ChatBot = () => {
  const [menu, setMenu] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const API_URL = "https://fashion-chatbot-production.up.railway.app/classify/";

  const popUP = () => {
    setMenu(!menu);
  };

  const handleInputChange = (e) => {
    setInputText(e.target.value);
  };

  const closePopup = () => {
    setMenu(false);
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      handleMessageSubmit();
      setInputText('');
    }
  };

  const handleMessageSubmit = async () => {
    if (!inputText.trim()) return;

    const newMessage = {
      text: inputText,
      sender: 'user',
    };

    setMessages((prevMessages) => [...prevMessages, newMessage]);

    try {
      setLoading(true);

      // Prepare the data in JSON format
      const data = { text: inputText };
      console.log(data)
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    });
    const result = await response.json();
    console.log(result.data)

    // console.log(response.data.classified_category)
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }


      // API call to classify the user's message
    //   const response = await axios.post(API_URL, data);
    //   console.log(response.data)
      const classifiedCategory = result.data.classified_category;

      // Prepare the bot's response
      const botResponse = {
        text: `Suggested category: ${classifiedCategory}`,
        sender: 'bot',
      };

      setMessages((prevMessages) => [...prevMessages, botResponse]);

    } catch (error) {
      console.error('Error:', error);
      const errorMessage = {
        text: "Error communicating with the AI.",
        sender: 'bot',
      };
      setMessages((prevMessages) => [...prevMessages, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  // Scroll to the bottom whenever messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div>
      <img
        className="chatbot-icon"
        onClick={popUP}
        src="https://static.vecteezy.com/system/resources/previews/004/996/790/non_2x/robot-chatbot-icon-sign-free-vector.jpg"
        alt="ChatBot Icon"
        title="Talk to ChatBot"
      />
      <AnimatePresence>
        {menu && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 10 }}
            exit={{ opacity: 0, y: 20 }}
            onMouseLeave={() => setMenu(false)}
            className="chatbot-popup"
          >
            <div className="chatbot-header">
              <div className="chatbot-header-info">
                <img className="chatbot-avatar" src="/assets/ai_plant/pila.avif" alt="Bot Avatar" />
                <div>
                  <span>Chat Bot</span>
                  <div className="chatbot-status">
                    <GoDotFill />
                    <span> Online</span>
                  </div>
                </div>
              </div>
              <span className="close-icon" onClick={closePopup}>
                <RxCrossCircled />
              </span>
            </div>
            <div className="chatbot-messages">
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`message ${message.sender === 'user' ? 'user-message' : 'bot-message'}`}
                >
                  <span>{message.text}</span>
                  {message.sender === 'user' ? (
                    <img className="user-avatar" src="http://clipart-library.com/images/6Tp66Bp7c.png" alt="User Avatar" />
                  ) : (
                    <img className="bot-avatar" src="https://static.vecteezy.com/system/resources/previews/004/996/790/non_2x/robot-chatbot-icon-sign-free-vector.jpg" alt="Bot Avatar" />
                  )}
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
            <div className="chatbot-input-container">
              <input
                className="chatbot-input"
                onChange={handleInputChange}
                onKeyDown={handleKeyPress}
                type="text"
                placeholder="Type your question here"
                value={inputText}
              />
              <span className="send-icon" onClick={handleMessageSubmit}>
                <AiOutlineSend />
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ChatBot;
