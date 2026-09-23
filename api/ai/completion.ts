import { GoogleGenAI } from "@google/genai";

export const config = {
  runtime: "nodejs",
};

type RequestBody = {
  prompt?: string;
  maxTokens?: number;
};

export default async function handler(req: any, res: any) {
  if (req.method !== "POST") {
    return res.status(405).json({
      error: "Method not allowed",
    });
  }

  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    return res.status(500).json({
      error: "GEMINI_API_KEY is not configured on Vercel.",
    });
  }

  try {
    const { prompt, maxTokens } = req.body as RequestBody;

    if (!prompt || typeof prompt !== "string") {
      return res.status(400).json({
        error: "A prompt is required.",
      });
    }

    const ai = new GoogleGenAI({
      apiKey,
    });

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        maxOutputTokens: maxTokens || 700,
        temperature: 0.7,
      },
    });

    const text = response.text?.trim();

    if (!text) {
      return res.status(502).json({
        error: "Gemini returned an empty response.",
      });
    }

    return res.status(200).json({
      data: {
        text,
      },
    });
  } catch (error) {
    console.error("NEXUS Gemini error:", error);

    return res.status(500).json({
      error:
        error instanceof Error
          ? error.message
          : "Gemini request failed.",
    });
  }
}
