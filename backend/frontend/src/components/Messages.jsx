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
        <div className='h-full py-4 px-4'>
            <div className='space-y-4'>
                {messages && messages.length > 0 ? (
                    messages.map((message) => (
                        <Message key={message._id} message={message} />
                    ))
                ) : (
                    <div className='flex items-center justify-center h-full text-gray-400'>
                        No messages yet. Start the conversation!
                    </div>
                )}
                <div ref={messagesEndRef} className="h-4" />
            </div>
        </div>
    )
}

export default Messages