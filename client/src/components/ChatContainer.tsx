import { useRef, useEffect } from "react";
import { Message } from "@/lib/gemini";
import { formatDate, escapeHTML, formatMessageText } from "@/lib/utils";

interface ChatContainerProps {
  messages: Message[];
  isTyping: boolean;
  onSuggestionClick: (suggestion: string) => void;
}

const suggestions = [
  "¿Cómo funciona la inteligencia artificial?",
  "Dame un resumen de la historia de España",
  "Explícame la teoría de la relatividad",
  "¿Cuáles son los mejores lugares para visitar en México?"
];

export function ChatContainer({ messages, isTyping, onSuggestionClick }: ChatContainerProps) {
  const chatContainerRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom when messages change
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const showEmptyState = messages.length === 0 && !isTyping;

  return (
    <main className="flex-1 overflow-hidden flex flex-col bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
      <div className="relative flex-1 flex flex-col">
        <div 
          ref={chatContainerRef}
          className="chat-container flex-1 overflow-y-auto p-4 sm:p-6" 
        >
          {/* Empty state when no messages */}
          {showEmptyState && (
            <div className="flex flex-col items-center justify-center h-full text-center px-4 space-y-6">
              <div className="rounded-full bg-gradient-to-r from-primary-500 to-secondary-600 p-4 shadow-lg">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">¡Bienvenido al Chatbot IA!</h2>
              <p className="text-gray-600 dark:text-gray-400 max-w-md">Estoy aquí para ayudarte. Puedes hacerme cualquier pregunta y te responderé con información precisa y detallada.</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full max-w-md mt-2">
                {suggestions.map((suggestion, index) => (
                  <button 
                    key={index}
                    onClick={() => onSuggestionClick(suggestion)}
                    className="p-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 text-left text-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition shadow-sm"
                  >
                    <p className="font-medium text-gray-900 dark:text-white">{suggestion}</p>
                  </button>
                ))}
              </div>
            </div>
          )}
          
          {/* Chat messages */}
          {messages.length > 0 && (
            <div className="space-y-4 pt-4 pb-2">
              {messages.map((message) => (
                <div 
                  key={message.id}
                  className={`message ${message.role === 'user' ? 'user-message flex justify-end' : 'ai-message flex'} mb-4 message-appear`}
                >
                  {message.role === 'user' ? (
                    <>
                      <div className="max-w-md mx-2">
                        <div className="bg-primary-100 dark:bg-primary-900 p-3 rounded-tl-lg rounded-tr-lg rounded-bl-lg text-gray-800 dark:text-gray-100">
                          <p>{escapeHTML(message.content)}</p>
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400 mt-1 text-right">
                          Hoy, {formatDate(message.timestamp)}
                        </div>
                      </div>
                      <div className="w-8 h-8 rounded-full bg-primary-500 flex items-center justify-center text-white">
                        <span className="text-sm font-medium">TÚ</span>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="w-8 h-8 rounded-full bg-gradient-to-r from-primary-500 to-secondary-600 flex items-center justify-center text-white">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                        </svg>
                      </div>
                      <div className="max-w-3xl mx-2">
                        <div className="bg-white dark:bg-gray-800 p-4 rounded-tr-lg rounded-br-lg rounded-bl-lg shadow-sm">
                          <div dangerouslySetInnerHTML={{ __html: formatMessageText(message.content) }} />
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                          Hoy, {formatDate(message.timestamp)}
                        </div>
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          )}
          
          {/* Typing indicator */}
          <div className={`flex items-center my-4 transition-opacity duration-300 ease-in-out ${isTyping ? 'opacity-100' : 'opacity-0'}`} aria-hidden={!isTyping}>
            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-primary-500 to-secondary-600 flex items-center justify-center text-white">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
            <div className="ml-2 p-3 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
              <div className="typing-indicator">
                <span className="bg-gray-400 dark:bg-gray-500"></span>
                <span className="bg-gray-400 dark:bg-gray-500"></span>
                <span className="bg-gray-400 dark:bg-gray-500"></span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
