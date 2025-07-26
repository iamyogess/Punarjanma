import { type NextRequest, NextResponse } from "next/server"
import { GoogleGenerativeAI } from "@google/generative-ai"

// Initialize Gemini AI with your API key
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "")

const generateAIResponse = async (
  message: string,
  courseTitle: string,
  lessonTitle?: string,
  lessonContent?: string,
  conversationHistory?: any[],
): Promise<string> => {
  try {
    // Try gemini-1.5-flash first, fallback to gemini-1.5-pro if needed
    let model
    try {
      model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" })
    } catch {
      model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" })
    }

    // Build context for the AI
    const context = `
You are an AI learning assistant for an online course platform. You help students understand course content and answer their questions.

Course: ${courseTitle}
${lessonTitle ? `Current Lesson: ${lessonTitle}` : ""}
${lessonContent ? `Lesson Description: ${lessonContent}` : ""}

Your role:
- Help students understand the lesson content
- Answer questions related to the current lesson and course
- Provide explanations, examples, and clarifications
- Be encouraging and supportive
- If asked about topics outside the current lesson, try to relate them back to the course content
- Keep responses focused on learning and education

Student's question: ${message}
    `.trim()

    // Add conversation history for context
    let conversationContext = ""
    if (conversationHistory && conversationHistory.length > 0) {
      conversationContext = "\n\nPrevious conversation:\n"
      conversationHistory.slice(-6).forEach((msg: any) => {
        conversationContext += `${msg.sender === "user" ? "Student" : "AI"}: ${msg.content}\n`
      })
    }

    const fullPrompt = context + conversationContext + "\n\nPlease provide a helpful response:"

    const result = await model.generateContent(fullPrompt)
    const response = await result.response
    return response.text()
  } catch (error) {
    console.error("Gemini AI error:", error)

    // Provide a more specific fallback based on the lesson content
    if (lessonTitle && lessonContent) {
      return `I'd be happy to help you with "${lessonTitle}"! 

Based on the lesson content: ${lessonContent.substring(0, 200)}...

Your question: "${message}"

While I'm experiencing some technical difficulties with my AI processing, I can still provide some guidance:

${
  lessonTitle.toLowerCase().includes("marketing")
    ? "This lesson covers important digital marketing concepts. Key areas to focus on include understanding your target audience, creating compelling content, and measuring your results."
    : lessonTitle.toLowerCase().includes("programming") || lessonTitle.toLowerCase().includes("code")
      ? "This programming lesson focuses on practical skills. Make sure to practice the examples and try implementing the concepts yourself."
      : "This lesson contains valuable information for your learning journey. I recommend taking notes on the key concepts and practicing any examples provided."
}

Could you be more specific about what aspect you'd like me to explain further?`
    }

    return `I apologize, but I'm having trouble processing your question right now. However, I can still help you with "${lessonTitle || courseTitle}". 

Could you please rephrase your question? I'm here to help you understand the lesson content and answer any questions you might have about the course material.`
  }
}

const generateInstructorResponse = async (
  message: string,
  courseTitle: string,
  lessonTitle?: string,
  conversationHistory?: any[],
): Promise<string> => {
  try {
    // Try gemini-1.5-flash first, fallback to gemini-1.5-pro if needed
    let model
    try {
      model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" })
    } catch {
      model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" })
    }

    const context = `
You are an experienced online course instructor. You are teaching "${courseTitle}" and currently discussing "${lessonTitle || "the course content"}".

Your role as an instructor:
- Provide guidance and mentorship to students
- Answer questions about assignments, grading, and course structure
- Give feedback on student progress
- Be supportive and encouraging
- Help students with study strategies and learning approaches
- Address concerns about course difficulty or pacing

Student's message: ${message}

Respond as a caring, knowledgeable instructor who wants to help the student succeed.
    `.trim()

    let conversationContext = ""
    if (conversationHistory && conversationHistory.length > 0) {
      conversationContext = "\n\nPrevious conversation:\n"
      conversationHistory.slice(-6).forEach((msg: any) => {
        conversationContext += `${msg.sender === "user" ? "Student" : "Instructor"}: ${msg.content}\n`
      })
    }

    const fullPrompt = context + conversationContext + "\n\nPlease respond as the instructor:"

    const result = await model.generateContent(fullPrompt)
    const response = await result.response
    return response.text()
  } catch (error) {
    console.error("Gemini AI error:", error)
    return `Thank you for reaching out! I'm here to help you succeed in "${courseTitle}". 

${lessonTitle ? `Regarding "${lessonTitle}", ` : ""}I want to make sure you're getting the most out of this course. 

Your message: "${message}"

As your instructor, I'm always available to help with:
- Understanding difficult concepts
- Clarifying assignment requirements  
- Providing study strategies
- Discussing your progress
- Answering any course-related questions

What specific aspect would you like me to help you with today?`
  }
}

export async function POST(request: NextRequest) {
  try {
    const { message, chatType, courseTitle, lessonTitle, lessonContent, conversationHistory } = await request.json()

    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json({ error: "Gemini API key not configured" }, { status: 500 })
    }

    let response: string

    if (chatType === "ai") {
      response = await generateAIResponse(message, courseTitle, lessonTitle, lessonContent, conversationHistory)
    } else {
      response = await generateInstructorResponse(message, courseTitle, lessonTitle, conversationHistory)
    }

    // Add a small delay to simulate real conversation
    await new Promise((resolve) => setTimeout(resolve, 1000 + Math.random() * 2000))

    return NextResponse.json({ response })
  } catch (error) {
    console.error("Chat API error:", error)
    return NextResponse.json({ error: "Failed to process chat message" }, { status: 500 })
  }
}
