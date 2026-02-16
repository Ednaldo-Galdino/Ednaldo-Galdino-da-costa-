
import { GoogleGenAI, Type } from "@google/genai";

const getAI = () => new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateQuestions = async (subject: string, amount: number, difficulty: string): Promise<any[]> => {
  const ai = getAI();
  // Usando gemini-3-pro-preview para maior precisão em tarefas complexas de raciocínio (Direito/RLM)
  const response = await ai.models.generateContent({
    model: "gemini-3-pro-preview",
    contents: `Gere exatamente ${amount} questões inéditas de concurso nível ${difficulty} sobre: ${subject}. 
    As questões devem ser EM PORTUGUÊS. Estilo: FGV/CESPE. 
    Retorne APENAS o JSON rigoroso.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            text: { type: Type.STRING },
            options: { 
              type: Type.ARRAY, 
              items: { type: Type.STRING },
              minItems: 4,
              maxItems: 4
            },
            correctIndex: { type: Type.INTEGER },
            explanation: { type: Type.STRING }
          },
          required: ["text", "options", "correctIndex", "explanation"]
        }
      }
    }
  });
  
  if (!response.text) throw new Error("Resposta vazia da IA");
  return JSON.parse(response.text.trim());
};

export const breakDownGoal = async (title: string, description: string): Promise<any> => {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Plano de ação para: ${title}. Contexto: ${description}. Retorne JSON com 'steps' (passos práticos) e 'motivation' (frase curta).`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          steps: { type: Type.ARRAY, items: { type: Type.STRING } },
          motivation: { type: Type.STRING }
        },
        required: ["steps", "motivation"]
      }
    }
  });
  return JSON.parse(response.text?.trim() || "{}");
};
