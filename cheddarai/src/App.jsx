import './App.css'

import { useEffect, useState } from 'react'

import ChatSection from './components/ChatSection/Chatsection'
import HomePage from './components/HomePage/HomePage'
import News from './components/NewsSection/News'
import React from 'react'
import {v4 as uuidv4} from 'uuid';

function App() {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chats, setChats] = useState([]);
  const [activeChat, setActiveChat] = useState(null);
  const [OnNewsTab, setIsNewsOpen] = useState(false);

  useEffect(() => {
    const storedChats = JSON.parse(localStorage.getItem("chats")) || [];
    setChats(storedChats);

    if (storedChats.length > 0) {
      setActiveChat(storedChats[0].id);
    }
  }, []);

  const handleStartChat = () => {
    setIsChatOpen(true);

    if (chats.length === 0) {
      handleNewChat();
    }
  };

  const handleNewsTab = () => {
    setIsNewsOpen(!OnNewsTab);
    if(isChatOpen) {
      setIsChatOpen(false);
    }
    console.log("News tab toggled:", OnNewsTab);
  };

  const handleCloseChat = () => {
    setIsChatOpen(false);
  };

  const handleNewChat = () => {
    const newchat = {
      id: uuidv4(),
      title: `Chat on ${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}`,
      messages: [],
    };
    const UpdateChat = [newchat, ...chats];
    setChats(UpdateChat);
    localStorage.setItem("chats", JSON.stringify(UpdateChat));
    localStorage.setItem(newchat.id, JSON.stringify(newchat.messages));
    setActiveChat(newchat.id);
    console.log("New chat created:", newchat);
    console.log("Updated chats:", activeChat);
  };

  return (
    <div className="container">
      {isChatOpen ? (
        <ChatSection
          onGoback={handleCloseChat}
          OnNewsTab={handleNewsTab}
          chats={chats}
          setchats={setChats}
          activeChat={activeChat}
          setActiveChat={setActiveChat}
          onNewChat={handleNewChat}
        />
      ) : OnNewsTab ? (
        <News
          onStartChat={handleStartChat}
          OnNewsTab={handleNewsTab}
        />
      )
    : (
        <HomePage
          onStartChat={handleStartChat}
          OnNewsTab={handleNewsTab}
        />
      )}
    </div>
  );
}

export default App
