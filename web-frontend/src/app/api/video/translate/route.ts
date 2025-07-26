import { type NextRequest, NextResponse } from "next/server"
import { GoogleGenerativeAI } from "@google/generative-ai"

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "")

export async function POST(request: NextRequest) {
  try {
    const { text, targetLanguage, context } = await request.json()

    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json({ error: "Gemini API key not configured" }, { status: 500 })
    }

    // Try gemini-1.5-flash first, fallback to gemini-1.5-pro if needed
    let model
    try {
      model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" })
    } catch {
      model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" })
    }

    const languageNames: { [key: string]: string } = {
      ne: "Nepali (नेपाली)",
      hi: "Hindi (हिंदी)",
      es: "Spanish (Español)",
      fr: "French (Français)",
      de: "German (Deutsch)",
      ja: "Japanese (日本語)",
      ko: "Korean (한국어)",
      zh: "Chinese (中文)",
    }

    const targetLanguageName = languageNames[targetLanguage] || targetLanguage

    const prompt = `
You are an expert translator specializing in educational content. Please translate the following text to ${targetLanguageName}.

Context: ${context}

Text to translate:
${text}

Requirements:
1. Maintain the educational tone and structure
2. Keep technical terms accurate
3. Ensure the translation is natural and easy to understand
4. Preserve the formatting and paragraph structure
5. Make sure educational concepts are clearly conveyed

Please provide only the translation without any additional comments.
    `.trim()

    const result = await model.generateContent(prompt)
    const response = await result.response
    const translation = response.text()

    return NextResponse.json({ success: true, translation })
  } catch (error) {
    console.error("Translation error:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to translate content",
        translation: "Translation is currently unavailable. Please try again later.",
      },
      { status: 200 },
    )
  }
}
