import './ChatSection.css';

import React, { useEffect, useRef, useState } from "react";

import OpenAI from "openai";

const ChatSection = ({ onGoback,OnNewsTab,chats, setchats, activeChat, setActiveChat, onNewChat }) => {
    const [inputValue, setInputValue] = useState("");
    const [messages, setMessages] = useState([chats[0]?.messages || []]);
    const [isLoading, setIsLoading] = useState(false);
    const chatEndRef = useRef(null);

    useEffect(() => {
        const activeChatObject = chats.find((chat) => chat.id === activeChat);
        setMessages(activeChatObject ? activeChatObject.messages : []);
    }, [activeChat, chats]);

    const LoaderSVG = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="loader-svg">
        <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeDasharray="31.416" strokeDashoffset="31.416">
            <animate attributeName="stroke-dasharray" dur="2s" values="0 31.416;15.708 15.708;0 31.416" repeatCount="indefinite"/>
            <animate attributeName="stroke-dashoffset" dur="2s" values="0;-15.708;-31.416" repeatCount="indefinite"/>
        </circle>
    </svg>
);

    const handleInputChange = (e) => {

        setInputValue(e.target.value);
    };


    const handleSelectChat = (id) => {
        console.log(activeChat);
        console.log(chats);
        setActiveChat(id);
    }

    const sendMessage =  async() => {
        setIsLoading(true); // Start loading
        if (inputValue.trim() === "") return;
        const newMessage = {
            text: inputValue,
            timestamp: new Date().toLocaleTimeString(),
            type: 'prompt'
        };
        const updatedMessages = [...messages, newMessage];
        setMessages(updatedMessages);
        setInputValue("");

        const updateChat = chats.map((chat) => {
            if (chat.id === activeChat) {
                return {
                    ...chat,
                    messages: updatedMessages
                };
            }
            return chat;
        });
        setchats(updateChat);
        console.log("Updated chats:", updateChat);
        try {
            const response = await fetch("https://api.openai.com/v1/chat/completions", {
                method: "POST",
                headers: {
                "Content-Type": "application/json",
                authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
                },
                body: JSON.stringify({
                model: "gpt-3.5-turbo",
                messages: [
                    { role: "user", content: inputValue }
                ],
                max_tokens: 150,
                temperature: 0.7
                })
            });
            const data = await response.json();
            const cheddarResponse = data.choices[0].message.content.trim();
            console.log("WAWAWAW");

            const newResponseMessage = {
                type: 'response',
                text: cheddarResponse,
                timestamp: new Date().toLocaleTimeString()
            };
            const finalMessages = [...updatedMessages, newResponseMessage];
            setMessages(finalMessages);
            localStorage.setItem(activeChat, JSON.stringify(finalMessages))

            const updatedChatswithResponse = chats.map((chat) => {
                if (chat.id === activeChat) {
                    return {
                        ...chat,
                        messages: finalMessages
                    };
                }
                return chat;
            });
            setchats(updatedChatswithResponse);
            localStorage.setItem('chats', JSON.stringify(updatedChatswithResponse))
        } catch (error) {
            console.error("Error sending message:", error);
        } finally {
            setIsLoading(false); // Stop loading
        }
    }

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault()
            sendMessage()
        }
    }

    const handleDeleteChat = (id) => {
        if (chats.length != 1) {
            const updatedChats = chats.filter((chat) => chat.id !== id);
            setchats(updatedChats);
            localStorage.setItem("chats", JSON.stringify(updatedChats));
            localStorage.removeItem(id);

            if (id === activeChat) {
                const newActiveChat =
                    updatedChats.length > 0 ? updatedChats[0].id : null;
                setActiveChat(newActiveChat);
            }
        }
    };

      useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

    return (
        <div className="chat-section">
            <div className="chat-list">
                <div className="chat-list-header">
                    <h2>Chat History with Cheddar</h2>
                    <i className="bx bx-edit-alt new-chat" onClick={onNewChat}></i>
                </div>
                {chats.map((chat) => (
                    <div key={chat.id} className={`chat-list-item ${chat.id === activeChat ? 'active' : ''}`} onClick={() => handleSelectChat(chat.id)}>
                        <h4>{chat.title}</h4>
                        <i className='bx bx-x circle' onClick={(e) => {
                            e.stopPropagation()
                            handleDeleteChat(chat.id)
                        }}></i>
                    </div>
                ))}

            </div>
            <div className="chat-window">
                <div className="chat-title">
                    <h2>Chat with Cheddar</h2>
                    <button className="news-btn" onClick={OnNewsTab}>
                    <i className='bx bx-left-arrow-alt'></i> LIVE NEWS
                    </button>
                    <button className="back-btn" onClick={onGoback}>
                    <i className='bx bx-left-arrow-alt'></i> BACK HOME 
                    </button>
                </div>
                <div className="chat-messages">
                    {messages.map((message, index) => (
                        <div key={index} className={`message ${message.type}`}>
                            {message.text}
                            <span className="message-timestamp">{message.timestamp}</span>
                        </div>
                    ))}
                        {isLoading && (
                        <div className="message response loader-message">
                            <LoaderSVG />
                            <span className="loading-text">Cheddar is thinking...</span>
                        </div>
                    )}
                    <div ref={chatEndRef}></div>
                </div>
                <div className="chat-input">
                    <input
                        type="text"
                        className="msg-input"
                        placeholder="Type a message..."
                        value={inputValue}
                        onChange={handleInputChange}
                        onKeyDown={handleKeyDown}/>
                    <button className="send-btn" onClick={sendMessage}>
                        <i className="bx bx-send" ></i>
                    </button>
                </div>
            </div>
        </div>
    );
}


export default ChatSection;