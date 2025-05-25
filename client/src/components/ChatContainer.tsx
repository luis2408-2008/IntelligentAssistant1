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

  // Scroll to bottom when messages change or typing status changes
  useEffect(() => {
    if (chatContainerRef.current) {
      const container = chatContainerRef.current;
      // Use smooth scrolling behavior
      setTimeout(() => {
        container.scrollTo({
          top: container.scrollHeight,
          behavior: 'smooth'
        });
      }, 100);
    }
  }, [messages, isTyping]);

  const showEmptyState = messages.length === 0 && !isTyping;

  return (
    <main className="flex-1 overflow-hidden flex flex-col bg-background transition-colors duration-200">
      <div className="relative flex-1 flex flex-col overflow-hidden">
        <div 
          ref={chatContainerRef}
          className="chat-container absolute inset-0 overflow-y-auto px-4 py-6 sm:px-6 md:px-8" 
        >
          {/* Empty state when no messages */}
          {showEmptyState && (
            <div className="flex flex-col items-center justify-center h-full text-center px-4 space-y-6">
              <div className="rounded-full animated-gradient p-5 shadow-xl">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-14 w-14 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-100 font-outfit tracking-tight">¡Bienvenido a Nova AI!</h2>
              <p className="text-gray-600 dark:text-gray-400 max-w-lg text-lg leading-relaxed">Estoy aquí para ayudarte con información precisa y detallada. ¿En qué puedo asistirte hoy?</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-xl mt-4">
                {suggestions.map((suggestion, index) => (
                  <button 
                    key={index}
                    onClick={() => onSuggestionClick(suggestion)}
                    className="button-hover-effect p-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 text-left text-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-200 shadow-md"
                  >
                    <p className="font-medium text-gray-900 dark:text-white">{suggestion}</p>
                  </button>
                ))}
              </div>
            </div>
          )}
          
          {/* Chat messages */}
          {messages.length > 0 && (
            <div className="space-y-6 max-w-4xl mx-auto">
              {messages.map((message) => (
                <div 
                  key={message.id}
                  className={`message ${message.role === 'user' ? 'user-message flex justify-end' : 'ai-message flex'} mb-6 message-appear`}
                >
                  {message.role === 'user' ? (
                    <>
                      <div className="max-w-xl mx-3">
                        <div 
                          className="bg-[hsl(var(--user-message-bg))] text-[hsl(var(--user-message-text))] p-4 rounded-2xl rounded-tr-sm shadow-[var(--user-bubble-shadow)]"
                          style={{ boxShadow: 'var(--user-bubble-shadow)' }}
                        >
                          <p className="whitespace-pre-wrap text-[15px] leading-relaxed">{escapeHTML(message.content)}</p>
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400 mt-2 text-right pr-2">
                          {formatDate(message.timestamp)}
                        </div>
                      </div>
                      <div className="w-10 h-10 rounded-full bg-gradient-to-r from-primary-500 to-primary-600 flex items-center justify-center text-white shadow-md self-start">
                        <span className="text-sm font-medium">TÚ</span>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="w-10 h-10 rounded-full animated-gradient flex items-center justify-center text-white shadow-md self-start">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                        </svg>
                      </div>
                      <div className="max-w-3xl mx-3">
                        <div 
                          className="bg-[hsl(var(--ai-message-bg))] text-[hsl(var(--ai-message-text))] p-5 rounded-2xl rounded-tl-sm border border-[hsl(var(--ai-message-border))] shadow-[var(--ai-bubble-shadow)]"
                          style={{ boxShadow: 'var(--ai-bubble-shadow)' }}
                        >
                          <div className="ai-message-content" dangerouslySetInnerHTML={{ __html: formatMessageText(message.content) }} />
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400 mt-2 pl-2 flex items-center">
                          <span className="mr-2">Nova AI</span> • {formatDate(message.timestamp)}
                        </div>
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          )}
          
          {/* Typing indicator */}
          <div 
            className={`flex items-start max-w-4xl mx-auto my-4 transition-opacity duration-300 ease-in-out ${isTyping ? 'opacity-100' : 'opacity-0'}`} 
            aria-hidden={!isTyping}
          >
            <div className="w-10 h-10 rounded-full animated-gradient flex items-center justify-center text-white shadow-md">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
            <div className="ml-3 p-4 bg-[hsl(var(--ai-message-bg))] rounded-2xl rounded-tl-sm shadow-md border border-[hsl(var(--ai-message-border))]">
              <div className="typing-indicator">
                <span className="bg-accent-500 dark:bg-accent-400"></span>
                <span className="bg-accent-500 dark:bg-accent-400"></span>
                <span className="bg-accent-500 dark:bg-accent-400"></span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
