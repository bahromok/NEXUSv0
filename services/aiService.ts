
import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const SYSTEM_CORE_PROMPT = `
You are the NEXUS Neural Hub. You provide high-level synthesis of a Second Brain.
Always return valid JSON. Be professional, concise, and strategically minded.
Analyze the provided context (notes, tasks, habits) to offer actionable wisdom.
Focus on identifying patterns, potential pitfalls, and high-impact next steps.
`;

export async function generateBrainInsights(notes: any[], tasks: any[], habits: any[]) {
  const context = `
    NOTES: ${notes.map(n => n.title + ": " + n.content.substring(0, 300)).join(' | ')}
    TASKS: ${tasks.map(t => t.title + " (Status: " + t.status + ", Priority: " + t.priority + ")").join(', ')}
    HABITS: ${habits.map(h => h.name + " (Streak: " + h.streak + ")").join(', ')}
  `;

  const prompt = `Synthesize the current brain state from the following context: ${context}
  
  Provide a JSON object containing:
  1. focusSummary: A professional summary of current priorities.
  2. generalAdvice: Strategic advice for personal and professional growth.
  3. recommendedTasks: 3 new high-value tasks [title, description, priority].
  4. recommendedHabits: 2 new habits [name, frequency, impact].
  5. overallSummary: A 3-4 sentence high-level executive summary of everything currently in the vault.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: prompt,
      config: {
        systemInstruction: SYSTEM_CORE_PROMPT,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            focusSummary: { type: Type.STRING },
            generalAdvice: { type: Type.STRING },
            overallSummary: { type: Type.STRING },
            recommendedTasks: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  title: { type: Type.STRING },
                  description: { type: Type.STRING },
                  priority: { type: Type.STRING },
                },
                required: ["title", "description", "priority"]
              }
            },
            recommendedHabits: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  name: { type: Type.STRING },
                  frequency: { type: Type.STRING },
                  impact: { type: Type.STRING },
                },
                required: ["name", "frequency", "impact"]
              }
            }
          }
        }
      }
    });
    return JSON.parse(response.text || "{}");
  } catch (e) {
    console.error("Brain Synthesis Error:", e);
    return null;
  }
}

export async function summarizeNote(title: string, content: string) {
  const prompt = `Provide a professional, bullet-pointed executive summary of this note: ${title}. Content: ${content}`;
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        systemInstruction: "You are a world-class summarization engine. Be concise and professional.",
      }
    });
    return response.text;
  } catch (e) {
    return "Failed to synthesize summary.";
  }
}

export async function generateQuiz(noteTitle: string, noteContent: string) {
  const prompt = `Construct a 5-question multiple choice quiz for: ${noteTitle}. Content: ${noteContent}`;
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              question: { type: Type.STRING },
              options: { type: Type.ARRAY, items: { type: Type.STRING } },
              correctAnswer: { type: Type.STRING },
              explanation: { type: Type.STRING },
            },
            required: ["question", "options", "correctAnswer", "explanation"],
          }
        }
      }
    });
    return JSON.parse(response.text || "[]");
  } catch (e) {
    console.error("Quiz Generation Error:", e);
    return [];
  }
}

export async function generateMindMap(noteTitle: string, noteContent: string) {
  const prompt = `Create a hierarchical mind map JSON for: ${noteTitle}. Content: ${noteContent}`;
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            name: { type: Type.STRING },
            children: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  name: { type: Type.STRING },
                  children: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { name: { type: Type.STRING } } } }
                }
              }
            }
          }
        }
      }
    });
    return JSON.parse(response.text || "{}");
  } catch (e) {
    console.error("Mind Map Error:", e);
    return { name: noteTitle };
  }
}
