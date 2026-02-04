
import { GoogleGenAI } from "@google/genai";

export async function generateChatResponse(prompt: string, context: any) {
  // Check for API Key in environment
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    return "The Neural Link (API Key) is not configured. Please check your NEXUS setup.";
  }

  const ai = new GoogleGenAI({ apiKey });
  const modelName = 'gemini-3-flash-preview';

  // Summarize context for the model
  const notesSummary = context.notes.map((n: any) => `- ${n.title}`).join('\n');
  const tasksSummary = context.tasks.map((t: any) => `- [${t.status}] ${t.title}`).join('\n');

  const systemInstruction = `
    You are the NEXUS Second Brain Neural Core.
    You have access to the user's localized "Second Brain" data.
    Notes in index:
    ${notesSummary}

    Tasks in backlog:
    ${tasksSummary}

    Your goal is to help the user connect disparate thoughts, summarize findings, and manage their productivity.
    Be concise, professional, and insight-driven. Use a slightly futuristic, "calm dominance" tone.
    Always prioritize privacy and local reasoning.
  `;

  try {
    const response = await ai.models.generateContent({
      model: modelName,
      contents: prompt,
      config: {
        systemInstruction,
        temperature: 0.7,
        topP: 0.9,
      },
    });

    return response.text || "I processed your request but found no conclusive insights.";
  } catch (error) {
    console.error("Gemini Error:", error);
    throw error;
  }
}
