import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { z } from "zod";

// Gemini API integration
import { GoogleGenerativeAI } from "@google/generative-ai";

// Define schema for chat request
const chatRequestSchema = z.object({
  message: z.string().min(1, "Message cannot be empty"),
  history: z.array(
    z.object({
      role: z.enum(["user", "assistant"]),
      content: z.string()
    })
  ).optional()
});

export async function registerRoutes(app: Express): Promise<Server> {
  const httpServer = createServer(app);

  // Initialize Gemini API
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");
  const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

  // Chat endpoint
  app.post("/api/chat", async (req, res) => {
    try {
      const { message, history } = chatRequestSchema.parse(req.body);
      
      // Convert history format
      let formattedContent = [];
      
      // Add history if available
      if (history && history.length > 0) {
        for (const msg of history) {
          formattedContent.push({
            role: msg.role === 'user' ? 'user' : 'model',
            parts: [{ text: msg.content }]
          });
        }
      }
      
      // Add current message
      formattedContent.push({
        role: 'user',
        parts: [{ text: message }]
      });
      
      // Generate response using direct API call
      const result = await model.generateContent({
        contents: formattedContent,
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 1000,
        }
      });
      
      const response = result.response.text();
      
      return res.json({ 
        success: true,
        response
      });
    } catch (error: any) {
      console.error("Error in chat endpoint:", error);
      
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          success: false,
          message: "Invalid request data",
          errors: error.errors
        });
      }
      
      // Handle Gemini API errors
      if (error.message?.includes("API key")) {
        return res.status(500).json({
          success: false,
          message: "Error with AI service configuration. Please check API key."
        });
      }
      
      return res.status(500).json({
        success: false,
        message: "Failed to generate response"
      });
    }
  });

  return httpServer;
}
