import { type NextRequest, NextResponse } from "next/server"

// Free translation using LibreTranslate API
async function translateText(text: string, sourceLang: string, targetLang: string): Promise<string> {
  try {
    // Using LibreTranslate free API
    const response = await fetch("https://libretranslate.de/translate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        q: text,
        source: sourceLang,
        target: targetLang,
        format: "text",
      }),
    })

    if (!response.ok) {
      throw new Error("Translation service unavailable")
    }

    const data = await response.json()
    return data.translatedText
  } catch (error) {
    console.error("Translation error:", error)
    throw new Error("Translation failed")
  }
}

export async function POST(request: NextRequest) {
  try {
    const { text, fromLanguage, toLanguage } = await request.json()

    if (!text || !fromLanguage || !toLanguage) {
      return NextResponse.json({ success: false, error: "Text and language parameters are required" }, { status: 400 })
    }

    // Map language codes
    const langMap: { [key: string]: string } = {
      english: "en",
      nepali: "ne",
      en: "en",
      ne: "ne",
    }

    const sourceLang = langMap[fromLanguage.toLowerCase()] || "en"
    const targetLang = langMap[toLanguage.toLowerCase()] || "ne"

    if (sourceLang === targetLang) {
      return NextResponse.json({
        success: true,
        data: {
          originalText: text,
          translatedText: text,
          fromLanguage: sourceLang,
          toLanguage: targetLang,
          message: "No translation needed - same language",
        },
      })
    }

    const translatedText = await translateText(text, sourceLang, targetLang)

    return NextResponse.json({
      success: true,
      data: {
        originalText: text,
        translatedText,
        fromLanguage: sourceLang,
        toLanguage: targetLang,
      },
    })
  } catch (error) {
    console.error("Translation API error:", error)
    return NextResponse.json({ success: false, error: "Translation failed" }, { status: 500 })
  }
}
