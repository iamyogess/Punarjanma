import { type NextRequest, NextResponse } from "next/server"
import { generateText } from 'ai';
import { groq } from '@ai-sdk/groq';


export async function POST(request: NextRequest) {
  try {
    const { transcript, language = "english" } = await request.json()

    if (!transcript) {
      return NextResponse.json({ success: false, error: "Transcript is required" }, { status: 400 })
    }

    const prompt =
      language === "nepali"
        ? `Please summarize the following video transcript in Nepali language. Provide a clear, concise summary that captures the main points and key information. Make it educational and easy to understand:

${transcript}

Please provide the summary in Nepali.`
        : `Please summarize the following video transcript in English. Provide a clear, concise summary that captures the main points and key information. Make it educational and easy to understand:

${transcript}

Please provide:
1. A brief overview (2-3 sentences)
2. Key points covered (bullet points)
3. Main takeaways`

    const { text } = await generateText({
      model: groq("llama-3.1-8b-instant"),
      prompt,
      maxTokens: 500,
    })

    return NextResponse.json({
      success: true,
      data: {
        summary: text,
        language,
        originalLength: transcript.length,
        summaryLength: text.length,
      },
    })
  } catch (error) {
    console.error("Summarization error:", error)
    return NextResponse.json({ success: false, error: "Failed to generate summary" }, { status: 500 })
  }
}
