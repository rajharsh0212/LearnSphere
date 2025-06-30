import React, { useState, useRef, useEffect, useContext } from 'react';
import { FiSend } from 'react-icons/fi';
import Footer from '../../components/student/Footer';
import { assets } from '../../assets/assets';
import { AppContext } from '../../context/AppContext';
import { AuthContext } from '../../context/AuthContext';
import axios from 'axios';
import { toast } from 'react-toastify';

const AiDoubtSolver = () => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Hello! I'm your AI assistant. Ask me anything about your courses, and I'll do my best to help you.",
      sender: 'ai',
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const chatEndRef = useRef(null);
  const { backendUrl } = useContext(AppContext);
  const { auth } = useContext(AuthContext);

  const fetchChatHistory = async () => {
    if (!auth.token) return;
    try {
      const { data } = await axios.get(`${backendUrl}/api/user/chat-history`, {
        headers: {
          Authorization: `Bearer ${auth.token}`,
        },
      });
      if (data.success && data.chatHistory.length > 0) {
        setMessages(data.chatHistory);
      }
    } catch (error) {
      toast.error("Could not load previous chat history.");
    }
  };

  useEffect(() => {
    if (auth.token) {
      fetchChatHistory();
    } else {
      // If auth token is removed (logout), reset the chat
      setMessages([
        {
          id: 1,
          text: "Hello! I'm your AI assistant. Ask me anything about your courses, and I'll do my best to help you.",
          sender: 'ai',
        },
      ]);
    }
  }, [auth.token]);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (input.trim() === '' || !auth.token) return;

    const userMessage = {
      id: Date.now(),
      text: input,
      sender: 'user',
    };
    setMessages((prev) => [...prev, userMessage]);
    const prompt = input;
    setInput('');
    setIsLoading(true);

    try {
      const { data } = await axios.post(
        `${backendUrl}/api/ai/ask`,
        { prompt },
        {
          headers: {
            Authorization: `Bearer ${auth.token}`,
          },
        }
      );

      if (data.success) {
        const aiResponse = {
          id: Date.now() + 1,
          text: data.answer,
          sender: 'ai',
        };
        setMessages((prev) => [...prev, aiResponse]);
      } else {
        toast.error(data.message || 'Failed to get a response from the AI.');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'An error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 pt-24">
      <div className="flex-grow container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-lg border border-gray-200">
          {/* Header */}
          <div className="p-4 border-b border-gray-200 flex items-center gap-4 bg-blue-50 rounded-t-2xl">
            <img src={assets.logo_image} alt="AI" className="w-12 h-12 rounded-full border-2 border-blue-200 p-1" />
            <div>
              <h1 className="text-xl font-bold text-gray-800">AI Doubt Solver</h1>
              <p className="text-sm text-gray-600">Your personal learning assistant</p>
            </div>
          </div>

          {/* Chat Messages */}
          <div className="p-6 h-[60vh] overflow-y-auto">
            <div className="space-y-6">
              {messages.map((msg) => (
                <div key={msg._id || msg.id} className={`flex items-end gap-3 ${msg.sender === 'user' ? 'justify-end' : ''}`}>
                  {msg.sender === 'ai' && (
                    <img src={assets.logo_image} alt="AI" className="w-8 h-8 rounded-full" />
                  )}
                  <div
                    className={`max-w-md px-4 py-3 rounded-2xl ${
                      msg.sender === 'user'
                        ? 'bg-blue-600 text-white rounded-br-none'
                        : 'bg-gray-100 text-gray-800 rounded-bl-none'
                    }`}
                  >
                    <p>{msg.text}</p>
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex items-end gap-3">
                  <img src={assets.logo_image} alt="AI" className="w-8 h-8 rounded-full" />
                  <div className="bg-gray-100 text-gray-800 rounded-2xl rounded-bl-none p-3">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
                      <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse delay-75"></div>
                      <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse delay-150"></div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>
          </div>

          {/* Message Input */}
          <div className="p-4 border-t border-gray-200">
            <div className="relative">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && !isLoading && handleSend()}
                placeholder="Type your doubt here..."
                className="w-full pl-4 pr-12 py-3 border border-gray-300 rounded-full focus:ring-2 focus:ring-blue-400 focus:outline-none transition"
                disabled={isLoading}
              />
              <button
                onClick={handleSend}
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-blue-600 text-white p-2.5 rounded-full hover:bg-blue-700 transition-transform duration-200 active:scale-90 disabled:bg-gray-400"
                disabled={isLoading}
              >
                <FiSend size={20} />
              </button>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default AiDoubtSolver;