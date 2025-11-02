
import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { GroundingSource } from '../types';

if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable not set");
}
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

interface AnalysisResult {
    text: string;
    sources: GroundingSource[];
}

export const analyzeFinancialData = async (prompt: string): Promise<AnalysisResult> => {
    try {
        const response: GenerateContentResponse = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                tools: [{ googleSearch: {} }],
            },
        });
        
        const text = response.text;
        
        const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
        
        const sources: GroundingSource[] = groundingChunks
            .filter(chunk => chunk.web && chunk.web.uri && chunk.web.title)
            .map(chunk => ({
                uri: chunk.web.uri,
                title: chunk.web.title,
            }));

        return { text, sources };

    } catch (error) {
        console.error("Error analyzing financial data:", error);
        throw new Error("Failed to get a response from the Gemini API.");
    }
};
