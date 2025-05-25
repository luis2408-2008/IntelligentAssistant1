import { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { Header } from "@/components/Header";
import { ChatContainer } from "@/components/ChatContainer";
import { InputArea } from "@/components/InputArea";
import { ErrorToast } from "@/components/ErrorToast";
import { Message, sendMessageToGemini } from "@/lib/gemini";

export default function Chat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSendMessage = async (content: string) => {
    // Create new user message
    const userMessage: Message = {
      id: uuidv4(),
      content,
      role: 'user',
      timestamp: new Date()
    };
    
    // Add user message to chat
    setMessages(prev => [...prev, userMessage]);
    
    // Show typing indicator
    setIsTyping(true);
    
    try {
      // Send message to backend
      const response = await sendMessageToGemini(content, messages);
      
      // Create AI response message
      const aiMessage: Message = {
        id: uuidv4(),
        content: response,
        role: 'assistant',
        timestamp: new Date()
      };
      
      // Add AI message to chat
      setMessages(prev => [...prev, aiMessage]);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unexpected error occurred");
    } finally {
      setIsTyping(false);
    }
  };

  const handleClearChat = () => {
    setMessages([]);
    setIsTyping(false);
    setError(null);
  };

  const handleSuggestionClick = (suggestion: string) => {
    handleSendMessage(suggestion);
  };

  return (
    <div className="flex flex-col h-screen max-h-screen overflow-hidden">
      <Header onClearChat={handleClearChat} />
      <ChatContainer 
        messages={messages} 
        isTyping={isTyping} 
        onSuggestionClick={handleSuggestionClick} 
      />
      <InputArea 
        onSendMessage={handleSendMessage} 
        disabled={isTyping} 
      />
      <ErrorToast message={error} />
    </div>
  );
}
