
import { GoogleGenAI } from "@google/genai";
import { Ticket, KBArticle } from "../types";

// Always initialize GoogleGenAI with the apiKey directly from process.env.API_KEY
export const getGeminiAI = () => {
  return new GoogleGenAI({ apiKey: process.env.API_KEY });
};

export const summarizeTicket = async (ticket: Ticket): Promise<string> => {
  const ai = getGeminiAI();
  const conversation = ticket.messages.map(m => `${m.fromAgent ? 'Agent' : 'User'}: ${m.body}`).join('\n');
  
  // Use gemini-3-flash-preview for basic text summarization tasks
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Summarize the following support ticket conversation in 2-3 concise bullet points:\n\nSubject: ${ticket.subject}\n\n${conversation}`,
  });
  
  // Directly access the .text property from the GenerateContentResponse object
  return response.text || "Could not generate summary.";
};

export const suggestKBArticles = async (ticketBody: string, kbArticles: KBArticle[]): Promise<number[]> => {
  const ai = getGeminiAI();
  const kbSummary = kbArticles.map(a => `ID: ${a.id} - Title: ${a.title}`).join('\n');
  
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Given the customer issue, which of these Knowledge Base articles are most relevant? Return ONLY a JSON array of IDs.
    
    Issue: ${ticketBody}
    
    Articles:
    ${kbSummary}`,
    config: {
      responseMimeType: "application/json",
    }
  });

  try {
    // response.text is a property, not a method, containing the stringified JSON
    const ids = JSON.parse(response.text || "[]");
    return Array.isArray(ids) ? ids : [];
  } catch (e) {
    return [];
  }
};

export const draftReply = async (ticket: Ticket, kbContent?: string): Promise<string> => {
  const ai = getGeminiAI();
  const lastUserMessage = [...ticket.messages].reverse().find(m => !m.fromAgent)?.body || "";
  
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Draft a professional support reply to this message: "${lastUserMessage}". 
    ${kbContent ? `Use this information: ${kbContent}` : ""}
    Keep it friendly, helpful, and concise. Start with "Hi there,".`,
  });
  
  // Return the generated text content from the .text property
  return response.text || "";
};
