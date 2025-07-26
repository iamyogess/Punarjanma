import { type NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export async function POST(request: NextRequest) {
  try {
    const { summary, videoTitle, subjectContext } = await request.json();

    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json(
        { error: "Gemini API key not configured" },
        { status: 500 }
      );
    }

    // Try gemini-1.5-flash first, fallback to gemini-1.5-pro if needed
    let model;
    try {
      model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    } catch {
      model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });
    }

    const prompt = `
You are an educational content expert. Based on the video summary provided, create a comprehensive Q&A section that would help students understand and review the content.

Video Title: "${videoTitle}"
Subject Context: "${subjectContext}"

Summary:
${summary}

Please generate 8-10 questions and answers that cover:
1. Key concepts and definitions
2. Important details from the content
3. Practical applications
4. Critical thinking questions
5. Review questions for better understanding

Format each Q&A as:
Q: [Question]
A: [Detailed Answer]

Make the questions educational and the answers comprehensive but easy to understand.
    `.trim();

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const qna = response.text();

    return NextResponse.json({ success: true, qna });
  } catch (error) {
    console.error("Q&A generation error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to generate Q&A",
        qna: `Q&A for "${request.body?.videoTitle || "this video"}":

Q: What are the main topics covered in this lesson?
A: This lesson covers the fundamental concepts related to the subject matter, providing students with essential knowledge and practical understanding.

Q: What are the key learning objectives?
A: Students will gain understanding of core principles, learn practical applications, and develop skills that can be applied in real-world scenarios.

Q: How can I apply this knowledge practically?
A: The concepts learned can be implemented through practice exercises, real-world projects, and by following the best practices outlined in the content.

Q: What should I focus on while studying this topic?
A: Focus on understanding the fundamental concepts, practicing with examples, and connecting the theory to practical applications.`,
      },
      { status: 200 }
    );
  }
}
