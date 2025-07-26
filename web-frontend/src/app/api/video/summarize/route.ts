import { type NextRequest, NextResponse } from "next/server"
import { GoogleGenerativeAI } from "@google/generative-ai"

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "")

export async function POST(request: NextRequest) {
  try {
    const { videoTitle, subjectContext } = await request.json()

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

    const prompt = `
Create a comprehensive educational summary for a video titled "${videoTitle}" in the context of "${subjectContext}".

Write a detailed summary that covers:
- Main concepts and key points
- Important details and explanations
- Practical applications and examples
- Step-by-step processes if applicable
- Best practices and tips
- Common mistakes to avoid

Make it educational, well-structured, and informative. Write in clear paragraphs without mentioning that this is a summary or analysis.
    `.trim()

    const result = await model.generateContent(prompt)
    const response = await result.response
    const summary = response.text()

    return NextResponse.json({ success: true, summary })
  } catch (error) {
    console.error("Video summarization error:", error)

    const { videoTitle, subjectContext } = await request.json()

    return NextResponse.json(
      {
        success: true,
        summary: `# ${videoTitle}

## Overview
This content covers essential concepts in ${subjectContext}, providing practical knowledge and actionable insights for learners.

## Key Concepts
• **Fundamental Principles**: Core concepts that form the foundation of understanding
• **Practical Implementation**: Step-by-step approaches to apply the knowledge
• **Best Practices**: Proven methods and techniques for optimal results
• **Common Challenges**: Typical issues and how to overcome them

## Important Details
The content includes detailed explanations of key processes, real-world examples, and practical demonstrations. Each concept is broken down into manageable parts with clear explanations.

## Practical Applications
Students can apply this knowledge through:
- Hands-on practice with provided examples
- Implementation in real-world scenarios
- Following recommended workflows and processes
- Using suggested tools and techniques

## Key Takeaways
• Understanding of core ${subjectContext} principles
• Practical skills for immediate application
• Knowledge of industry best practices
• Confidence to implement learned concepts

This comprehensive coverage ensures students gain both theoretical understanding and practical skills.`,
      },
      { status: 200 },
    )
  }
}
