import { GoogleGenerativeAI } from "@google/generative-ai";

const geminiAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function POST(request: Request) {
  try {
    const model = geminiAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const { prompt } = await request.json();

    // Instruct Gemini to return a JSON object matching the IStore schema
    const fullPrompt = `
You are an expert e-commerce brand builder AI. Given the following shop description, generate a JSON object that matches this TypeScript interface (do not include comments or types, just the JSON object):

interface IAIBrandConfig {
  colorPalette: { primary: string; secondary: string; accent: string; };
  typography: { heading: string; body: string; };
  layoutTemplate: 'minimalist' | 'professional' | 'vibrant';
}

interface IStore {
  heroHeading: string;
  heroDescription: string;
  aboutUs: string;
  whyChooseUs: string[];
  contact?: {
    email?: string;
    phone?: string;
    address?: string;
    social?: {
      instagram?: string;
      facebook?: string;
      twitter?: string;
      tiktok?: string;
      youtube?: string;
    };
  };
  subdomain: string;
  storeName: string;
  description: string;
  aiConfig: IAIBrandConfig;
  isPublished: boolean;
}

Respond ONLY with a valid JSON object matching the above interface. Here is the shop description:
"""
${prompt}
"""`;

    const result = await model.generateContent(fullPrompt);
    const response = await result.response;
    let text = response.text();
    // Remove markdown code block if present
    text = text.replace(/```json|```/g, '').trim();
    let json;
    try {
      json = JSON.parse(text);
    } catch (e) {
      return Response.json({ error: 'AI did not return valid JSON', raw: text });
    }
    return Response.json(json);
  } catch (error) {
    console.error("Error generating content:", error);
    return Response.json({ message: error });
  }
}
