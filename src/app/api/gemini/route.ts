import { GoogleGenerativeAI } from "@google/generative-ai";

const geminiAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function POST(request: Request) {
  try {
    const model = geminiAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const { prompt } = await request.json();

    const fullPrompt = `
      You are an expert e-commerce brand builder AI. Given the following shop description, generate a JSON object that matches this TypeScript interface (do not include comments or types, just the JSON object):

      interface IStore {
        owner: string; // ObjectId as string
        storeName: string;
        subdomain: string;
        heroHeading: string;
        heroDescription: string;
        aboutUs: string;
        whyChooseUs: string[];
        description: string;
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
        storeLandingImage: string;
        theme: string; // ObjectId as string
        template?: string;
        isPublished?: boolean;
        integrations?: {
          telebirr?: {
            number: string;
            name: string;
          };
          cbe?: {
            account: string;
            name: string;
          };
        };
      }

      For the theme field, ALWAYS use one of these ObjectId strings as the value:
        '6871c55b34513073bdfadb67', '6871c66634513073bdfadb6a', '6871c6cc34513073bdfadb6c', '6871c75634513073bdfadb70', '6871c79a34513073bdfadb72', '6871c7e734513073bdfadb76', '6871c83e34513073bdfadb79', '6871c87334513073bdfadb7b', '6871c8b934513073bdfadb7d', '6871c92734513073bdfadb81', '6871c99134513073bdfadb83', '6871ca2334513073bdfadb85', '6871ca6f34513073bdfadb87', '6871cb1134513073bdfadb89', '6871cb7134513073bdfadb8b', '6871cbbc34513073bdfadb8d', '6871cbfe34513073bdfadb8f', '6871cc3a34513073bdfadb91', '6871cca334513073bdfadb93', '6871cd5a34513073bdfadb95'.
      Pick any one of these for the theme field.
      For the template field, ALWAYS set the value to "minimalist" (do not use any other value).
      For integrations, if not provided in the description, leave telebirr and cbe fields empty or omit them.
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
