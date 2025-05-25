import { apiRequest } from "./queryClient";

export interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
}

export async function sendMessageToGemini(message: string, history: Message[]): Promise<string> {
  try {
    const response = await apiRequest(
      "POST", 
      "/api/chat", 
      { 
        message,
        history: history.map(msg => ({
          role: msg.role,
          content: msg.content
        }))
      }
    );
    
    const data = await response.json();
    return data.response;
  } catch (error) {
    console.error("Error sending message to Gemini:", error);
    throw new Error("Failed to get response from AI. Please try again.");
  }
}
