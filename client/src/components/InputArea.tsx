import { useState, useRef, FormEvent, ChangeEvent } from "react";

interface InputAreaProps {
  onSendMessage: (message: string) => void;
  disabled: boolean;
}

export function InputArea({ onSendMessage, disabled }: InputAreaProps) {
  const [message, setMessage] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!message.trim() || disabled) return;

    onSendMessage(message);
    setMessage("");
    
    // Reset textarea height
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
  };

  const handleInput = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value);
    
    // Adjust textarea height
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  };

  return (
    <div className="border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 transition-colors duration-200">
      <div className="max-w-4xl mx-auto px-4 py-3 sm:px-6 lg:px-8">
        <form onSubmit={handleSubmit} className="relative">
          <div className="overflow-hidden rounded-lg shadow-sm border border-gray-300 dark:border-gray-600 focus-within:border-primary-500 dark:focus-within:border-primary-500 focus-within:ring-1 focus-within:ring-primary-500 dark:bg-gray-700">
            <textarea
              ref={textareaRef}
              value={message}
              onChange={handleInput}
              rows={1}
              className="block w-full resize-none border-0 bg-transparent py-3 px-4 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-0 sm:text-sm"
              placeholder="Escribe tu mensaje aquí..."
              disabled={disabled}
            />
            
            <div className="flex items-center justify-between py-2 pl-3 pr-2 border-t border-gray-200 dark:border-gray-600">
              <div className="flex items-center space-x-1">
                <button 
                  type="button" 
                  className="p-1 rounded-full text-gray-500 dark:text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600 transition"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </button>
                <button 
                  type="button" 
                  className="p-1 rounded-full text-gray-500 dark:text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600 transition"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                  </svg>
                </button>
              </div>
              
              <div className="flex-shrink-0">
                <button
                  type="submit"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-gradient-to-r from-primary-600 to-secondary-600 hover:from-primary-700 hover:to-secondary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 transition"
                  disabled={!message.trim() || disabled}
                >
                  <span>Enviar</span>
                  <svg xmlns="http://www.w3.org/2000/svg" className="ml-1.5 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </form>
        <p className="mt-2 text-xs text-gray-500 dark:text-gray-400 text-center">Powered by Gemini API • Tu información está segura y no se almacena</p>
      </div>
    </div>
  );
}
