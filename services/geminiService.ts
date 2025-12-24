
import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { GroundingSource } from "../types.ts";

const getApiKey = () => {
  return (typeof process !== 'undefined' && process.env?.API_KEY) ? process.env.API_KEY : '';
};

export const getParkingInsights = async (location: string): Promise<{ text: string; sources: GroundingSource[] }> => {
  try {
    const ai = new GoogleGenAI({ apiKey: getApiKey() });
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `What are the average parking rates and best parking areas in ${location}? Provide a helpful summary for someone looking to rent a spot.`,
      config: {
        tools: [{ googleSearch: {} }],
      },
    });

    const sources: GroundingSource[] = [];
    const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
    
    if (chunks) {
      chunks.forEach((chunk: any) => {
        if (chunk.web) {
          sources.push({
            title: chunk.web.title || 'Source',
            uri: chunk.web.uri
          });
        }
      });
    }

    return {
      text: response.text || "No insights found.",
      sources
    };
  } catch (error) {
    console.error("Gemini API Error:", error);
    return { text: "Sorry, I couldn't fetch real-time data at the moment.", sources: [] };
  }
};

export const chatWithAssistant = async (message: string, context: string) => {
  try {
    const ai = new GoogleGenAI({ apiKey: getApiKey() });
    const chat = ai.chats.create({
      model: 'gemini-3-flash-preview',
      config: {
        systemInstruction: `You are ParkShare AI, a helpful assistant for a car park rental platform. 
        You help users find the best parking spots based on their needs. 
        Context of available spots: ${context}.
        Be concise, friendly, and professional.`
      }
    });

    const response = await chat.sendMessage({ message });
    return response.text;
  } catch (error) {
    console.error("Chat Assistant Error:", error);
    return "I'm having a bit of trouble connecting to my assistant brain right now. Please try again in a moment!";
  }
};
