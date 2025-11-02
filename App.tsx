
import React, { useState, useRef, useEffect } from 'react';
import { analyzeFinancialData } from './services/geminiService';
import { ChatMessage as ChatMessageType, GroundingSource } from './types';
import Header from './components/Header';
import ChatInput from './components/ChatInput';
import ChatMessage from './components/ChatMessage';
import LoadingSpinner from './components/LoadingSpinner';

const App: React.FC = () => {
  const [chatHistory, setChatHistory] = useState<ChatMessageType[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory]);

  const handleSubmit = async (prompt: string) => {
    if (!prompt.trim()) return;

    const userMessage: ChatMessageType = { role: 'user', content: prompt };
    setChatHistory(prev => [...prev, userMessage]);
    setIsLoading(true);
    setError(null);

    try {
      const { text, sources } = await analyzeFinancialData(prompt);
      const modelMessage: ChatMessageType = {
        role: 'model',
        content: text,
        sources: sources,
      };
      setChatHistory(prev => [...prev, modelMessage]);
    } catch (e) {
      const errorMessage = e instanceof Error ? e.message : 'An unknown error occurred.';
      setError(`Error: ${errorMessage}`);
      const errorMessageObj: ChatMessageType = {
        role: 'model',
        content: `Sorry, I encountered an error. ${errorMessage}`
      }
      setChatHistory(prev => [...prev, errorMessageObj]);
    } finally {
      setIsLoading(false);
    }
  };
  
  useEffect(() => {
    setChatHistory([{
        role: 'model',
        content: "Welcome. I am the Financial Analyst CEO bot. How can I assist you with your financial queries today? For example, you can ask 'What were the key takeaways from NVIDIA's latest earnings call?'"
    }]);
  }, []);

  return (
    <div className="flex flex-col h-screen bg-gray-900 text-gray-100 font-sans">
      <Header />
      <main className="flex-1 overflow-y-auto p-4 md:p-6">
        <div className="max-w-4xl mx-auto space-y-8">
          {chatHistory.map((msg, index) => (
            <ChatMessage key={index} message={msg} />
          ))}
          {isLoading && (
            <div className="flex justify-center items-center gap-4">
              <LoadingSpinner />
              <p className="text-gray-400">Analyzing...</p>
            </div>
          )}
          {error && <p className="text-red-400 text-center">{error}</p>}
          <div ref={chatEndRef} />
        </div>
      </main>
      <div className="sticky bottom-0 left-0 right-0 bg-gray-900/80 backdrop-blur-sm p-4 md:p-6 border-t border-gray-700">
         <div className="max-w-4xl mx-auto">
            <ChatInput onSubmit={handleSubmit} isLoading={isLoading} />
         </div>
      </div>
    </div>
  );
};

export default App;
