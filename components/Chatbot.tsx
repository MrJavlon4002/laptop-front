
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { GoogleGenAI, Chat } from '@google/genai';
import { ChatMessage } from '../types';
import Spinner from './Spinner'; // Assuming you have a Spinner component

// Ensure process.env.API_KEY is handled correctly.
// In a real build process, this would be replaced. For local dev, you might need to set it up.
// For this environment, we assume `process.env.API_KEY` is available.
const API_KEY = "AIzaSyD6GOSfkcH0bnNK4xF0VZTwBK1abdTN9cg";

const Chatbot: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [chatSession, setChatSession] = useState<Chat | null>(null);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  useEffect(() => {
    if (!API_KEY) {
      console.error("API_KEY is not defined. Chatbot will not function.");
      setError("Chatbot configuration error. API key missing.");
      return;
    }
    try {
      const ai = new GoogleGenAI({ apiKey: API_KEY });
      const newChatSession = ai.chats.create({
        model: 'gemini-2.5-flash-preview-04-17', // Or 'gemini-1.5-pro' for more powerful model
        config: {
          systemInstruction: "You are a friendly and knowledgeable assistant for Laptop Store Deluxe. Help users find laptops, answer questions about specifications, and provide information about our store. Be concise and helpful. If you are asked about topics completely unrelated to laptops, technology, or customer service for an electronics store, politely state that you are specialized in assisting with laptop purchases and related queries.",
        },
      });
      setChatSession(newChatSession);
      // Add an initial greeting message from the bot
      setMessages([{
        id: Date.now().toString(),
        role: 'model',
        text: "Hello! I'm your Laptop Assistant. How can I help you today?",
        timestamp: new Date()
      }]);
    } catch (e) {
      console.error("Failed to initialize Gemini API:", e);
      setError("Could not connect to the chat assistant. Please try again later.");
    }
  }, []);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const sendMessage = async () => {
    if (!input.trim() || isLoading || !chatSession) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      text: input,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    setError(null);

    try {
      const stream = await chatSession.sendMessageStream({ message: userMessage.text });
      let currentBotMessageId = Date.now().toString() + "-model";
      let fullBotResponse = "";

      // Initialize bot message display
      setMessages(prev => [...prev, { id: currentBotMessageId, role: 'model', text: "▍", timestamp: new Date() }]);

      for await (const chunk of stream) {
        const chunkText = chunk.text;
        fullBotResponse += chunkText;
        setMessages(prev => prev.map(msg =>
          msg.id === currentBotMessageId ? { ...msg, text: fullBotResponse + "▍" } : msg
        ));
      }
      // Finalize bot message (remove typing indicator)
       setMessages(prev => prev.map(msg =>
        msg.id === currentBotMessageId ? { ...msg, text: fullBotResponse.trim() } : msg
      ));

    } catch (e) {
      console.error("Error sending message to Gemini:", e);
      const errorMessage = "Sorry, I encountered an issue. Please try again.";
      setError(errorMessage);
      setMessages(prev => [...prev, { id: Date.now().toString(), role: 'model', text: errorMessage, timestamp: new Date() }]);
    } finally {
      setIsLoading(false);
      inputRef.current?.focus();
    }
  };

  return (
    <div className="fixed bottom-20 right-6 w-full max-w-md h-[70vh] max-h-[600px] bg-white rounded-lg shadow-xl flex flex-col border border-gray-300 z-40">
      <header className="bg-primary text-white p-4 flex justify-between items-center rounded-t-lg">
        <h3 className="text-lg font-semibold">Laptop Assistant</h3>
        <button onClick={onClose} className="text-white hover:text-primary-light" aria-label="Close chat">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
          </svg>
        </button>
      </header>

      <div className="flex-grow p-4 overflow-y-auto space-y-3 bg-neutral-light">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div
              className={`max-w-[80%] p-3 rounded-lg shadow ${
                msg.role === 'user'
                  ? 'bg-primary-light text-dark'
                  : 'bg-gray-200 text-neutral-dark'
              }`}
            >
              <p className="text-sm whitespace-pre-wrap">{msg.text}</p>
              <p className={`text-xs mt-1 ${msg.role === 'user' ? 'text-blue-100' : 'text-gray-500'}`}>{msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
            </div>
          </div>
        ))}
        {isLoading && messages[messages.length -1]?.role === 'user' && (
           <div className="flex justify-start">
            <div className="max-w-[80%] p-3 rounded-lg shadow bg-gray-200 text-neutral-dark">
                <Spinner size="sm" color="text-primary"/>
            </div>
           </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {error && <p className="p-2 text-center text-sm text-red-600 bg-red-100">{error}</p>}

      <div className="p-4 border-t border-gray-200 bg-white rounded-b-lg">
        <div className="flex items-center space-x-2">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && !isLoading && sendMessage()}
            placeholder="Ask about laptops..."
            className="flex-grow p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
            disabled={isLoading || !chatSession || !!error} // Disable if API key error and no chat session
          />
          <button
            onClick={sendMessage}
            disabled={isLoading || !input.trim() || !chatSession || !!error}
            className="bg-primary text-white p-2 rounded-md hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-primary-light disabled:bg-gray-400 disabled:cursor-not-allowed"
            aria-label="Send message"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Chatbot;
