import { GoogleGenerativeAI } from "@google/generative-ai";

const geminiAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function POST(request: Request) {
  try {
    const model = geminiAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const { prompt } = await request.json();

    const fullPrompt = `
       You are an expert e-commerce brand builder AI. Given the following shop description, generate a JSON object that matches this TypeScript interface (do not include comments or types, just the JSON object):

       interface IAIBrandConfig {
         colorPalette: { primary: string; secondary: string; accent: string; };
         typography: {
           heading: 'Inter, sans-serif' | 'Playfair Display, serif' | 'Montserrat, sans-serif';
           body: 'Roboto, sans-serif' | 'Open Sans, sans-serif' | 'Lora, serif';
         };
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
         isPublished: boolean;
       }

       For the typography.heading field, only use one of these values: 'Inter, sans-serif', 'Playfair Display, serif', 'Montserrat, sans-serif'.
       For the typography.body field, only use one of these values: 'Roboto, sans-serif', 'Open Sans, sans-serif', 'Lora, serif'.
       Respond ONLY with a valid JSON object matching the above interface. Here is the shop description:
       """
       ${prompt}
       """`;

    const result = await model.generateContent(fullPrompt);
    const response = await result.response;
    let text = response.text();
    text = text.replace(/```json|```/g, "").trim();
    let json;
    try {
      json = JSON.parse(text);
    } catch (error) {
      console.error("Error parsing JSON:", error);
      return Response.json({
        error: "AI did not return valid JSON",
        raw: text,
      });
    }
    return Response.json(json);
  } catch (error) {
    console.error("Error generating content:", error);
    return Response.json({ message: error });
  }
}
