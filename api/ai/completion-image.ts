import { GoogleGenAI } from "@google/genai";

export const config = {
  runtime: "nodejs",
};

type RequestBody = {
  prompt?: string;
  image?: string;
  mimeType?: string;
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
    const body = req.body as RequestBody;

    if (!body.prompt || !body.image) {
      return res.status(400).json({
        error: "Image and prompt are required.",
      });
    }

    const ai = new GoogleGenAI({
      apiKey,
    });

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [
        {
          role: "user",
          parts: [
            {
              inlineData: {
                mimeType: body.mimeType || "image/jpeg",
                data: body.image,
              },
            },
            {
              text: body.prompt,
            },
          ],
        },
      ],
      config: {
        maxOutputTokens: 1200,
        temperature: 0.4,
      },
    });

    const text = response.text?.trim();

    if (!text) {
      return res.status(502).json({
        error: "Gemini returned an empty vision response.",
      });
    }

    return res.status(200).json({
      data: {
        text,
      },
    });
  } catch (error) {
    console.error("NEXUS Vision error:", error);

    return res.status(500).json({
      error:
        error instanceof Error
          ? error.message
          : "Vision request failed.",
    });
  }
}
