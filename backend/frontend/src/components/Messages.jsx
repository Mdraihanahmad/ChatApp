import React, { useEffect, useRef } from 'react'
import Message from './Message'
import useGetMessages from '../hooks/useGetMessages';
import { useSelector } from "react-redux";
import useGetRealTimeMessage from '../hooks/useGetRealTimeMessage';

const Messages = () => {
    const messagesEndRef = useRef(null);
    useGetMessages();
    useGetRealTimeMessage();
    const { messages } = useSelector(store => store.message);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    return (
        <div className='flex flex-col h-full'>
            <div className='flex-1 overflow-y-auto px-4 py-2 space-y-4'>
                {messages && messages.length > 0 ? (
                    messages.map((message) => (
                        <Message key={message._id} message={message} />
                    ))
                ) : (
                    <div className='flex items-center justify-center h-full text-gray-400'>
                        No messages yet. Start the conversation!
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>
        </div>
    )
}

export default Messages