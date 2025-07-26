"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import {
  Send,
  Bot,
  User,
  Loader2,
  Sparkles,
  BookOpen,
  DollarSign,
  FileText,
  Languages,
  MessageSquare,
  Video,
  GraduationCap,
  Clock,
  Users,
  Award,
} from "lucide-react"

interface Message {
  id: string
  content: string
  sender: "user" | "bot"
  timestamp: Date
  isTyping?: boolean
}

interface SuggestedQuestion {
  id: string
  question: string
  category: string
  icon: React.ReactNode
}

interface CustomerSupportChatbotProps {
  isOpen: boolean
  onClose: () => void
}

const suggestedQuestions: SuggestedQuestion[] = [
  {
    id: "1",
    question: "What courses do you offer?",
    category: "Courses",
    icon: <BookOpen className="h-4 w-4" />,
  },
  {
    id: "2",
    question: "How much do courses cost?",
    category: "Pricing",
    icon: <DollarSign className="h-4 w-4" />,
  },
  {
    id: "3",
    question: "What is video summarization?",
    category: "Features",
    icon: <Video className="h-4 w-4" />,
  },
  {
    id: "4",
    question: "Can I translate course content?",
    category: "Features",
    icon: <Languages className="h-4 w-4" />,
  },
  {
    id: "5",
    question: "How does PDF interaction work?",
    category: "Features",
    icon: <FileText className="h-4 w-4" />,
  },
  {
    id: "6",
    question: "Do you provide certificates?",
    category: "Certification",
    icon: <Award className="h-4 w-4" />,
  },
  {
    id: "7",
    question: "How do I enroll in a course?",
    category: "Getting Started",
    icon: <GraduationCap className="h-4 w-4" />,
  },
  {
    id: "8",
    question: "What payment methods do you accept?",
    category: "Payment",
    icon: <DollarSign className="h-4 w-4" />,
  },
]

export function CustomerSupportChatbot({ isOpen, onClose }: CustomerSupportChatbotProps) {
  const [messages, setMessages] = useState<Message[]>([])
  const [inputMessage, setInputMessage] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [showSuggestions, setShowSuggestions] = useState(true)
  const scrollAreaRef = useRef<HTMLDivElement>(null)

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight
    }
  }, [messages])

  // Initialize chat with welcome message
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      const welcomeMessage: Message = {
        id: Date.now().toString(),
        content: `👋 **Welcome to Punarjanma Support!**

I'm your AI assistant, here to help you learn about our e-learning platform and answer any questions you have.

**🚀 Our Platform Features:**
• **Structured Courses** - Well-organized learning paths
• **Affordable Pricing** - Quality education for everyone  
• **AI Video Summarization** - Get key points instantly
• **Multi-language Translation** - Learn in your language
• **Q&A Generation** - Test your knowledge
• **PDF Summarization** - Extract key information
• **Interactive PDF Chat** - Ask questions about documents

**💡 How can I help you today?**
Choose from the suggested questions below or ask me anything!`,
        sender: "bot",
        timestamp: new Date(),
      }
      setMessages([welcomeMessage])
    }
  }, [isOpen])

  const generateBotResponse = async (userMessage: string): Promise<string> => {
    const lowerMessage = userMessage.toLowerCase()

    // Course-related questions
    if (lowerMessage.includes("course") || lowerMessage.includes("what do you offer")) {
      return `📚 **Our Course Offerings:**

**🎯 Course Categories:**
• **Programming & Development** - Web development, mobile apps, AI/ML
• **Digital Marketing** - SEO, social media, content marketing
• **Business & Entrepreneurship** - Startup basics, business strategy
• **Design & Creative** - UI/UX, graphic design, video editing
• **Data Science & Analytics** - Python, R, data visualization
• **Language Learning** - English, Spanish, French, and more

**✨ What Makes Our Courses Special:**
• **Structured Learning Paths** - Step-by-step progression
• **Hands-on Projects** - Real-world applications
• **Expert Instructors** - Industry professionals
• **Lifetime Access** - Learn at your own pace
• **Mobile-Friendly** - Study anywhere, anytime

**🎓 Course Formats:**
• Video lectures with AI summarization
• Interactive assignments
• Downloadable resources
• Community discussions
• Progress tracking

Would you like to know about any specific course category?`
    }

    // Pricing questions
    if (
      lowerMessage.includes("price") ||
      lowerMessage.includes("cost") ||
      lowerMessage.includes("fee") ||
      lowerMessage.includes("affordable")
    ) {
      return `💰 **Affordable Pricing Structure:**

**🆓 Free Tier:**
• Access to basic lessons
• Limited course content
• Community support
• Basic progress tracking

**⭐ Premium Courses:**
• **Individual Courses:** NPR 2,000 - 8,000
• **Course Bundles:** NPR 15,000 - 25,000
• **Annual Subscription:** NPR 30,000 (unlimited access)

**💎 Premium Features Include:**
• Full course access
• AI video summarization
• Multi-language translation
• PDF interaction tools
• Q&A generation
• Certificates of completion
• Priority support
• Downloadable resources

**💳 Payment Methods:**
• eSewa (most popular)
• Khalti
• Bank transfer
• Credit/Debit cards

**🎁 Special Offers:**
• Student discounts (20% off)
• Bundle deals (save up to 40%)
• Early bird pricing
• Referral bonuses

All prices are one-time payments with lifetime access!`
    }

    // Video summarization
    if (lowerMessage.includes("video") || lowerMessage.includes("summarization") || lowerMessage.includes("summary")) {
      return `🎥 **AI Video Summarization Feature:**

**🤖 How It Works:**
Our advanced AI analyzes video content and creates comprehensive summaries, making learning more efficient!

**✨ Key Benefits:**
• **Save Time** - Get key points in minutes, not hours
• **Better Retention** - Focus on important concepts
• **Quick Review** - Perfect for exam preparation
• **Accessibility** - Great for different learning styles

**🔧 Features:**
• **Automatic Summarization** - AI extracts main points
• **Key Timestamps** - Jump to important sections
• **Downloadable Summaries** - Save for offline reading
• **Multiple Formats** - Text, bullet points, structured notes

**🎯 Perfect For:**
• Busy professionals
• Students preparing for exams
• Quick concept reviews
• Note-taking assistance

**🎧 Audio Support:**
• Text-to-speech functionality
• Multiple voice options
• Speed control
• Offline listening

This feature is available for all premium course videos!`
    }

    // Translation questions
    if (
      lowerMessage.includes("translation") ||
      lowerMessage.includes("translate") ||
      lowerMessage.includes("language")
    ) {
      return `🌍 **Multi-Language Translation:**

**🗣️ Supported Languages:**
• **नेपाली (Nepali)** - Most popular
• **हिंदी (Hindi)** - Widely requested
• **English** - Default language
• **Español (Spanish)**
• **Français (French)**
• **Deutsch (German)**
• **日本語 (Japanese)**
• **한국어 (Korean)**
• **中文 (Chinese)**

**🔄 What Can Be Translated:**
• Video summaries
• Course descriptions
• Q&A content
• PDF summaries
• Learning materials
• Interface text

**⚡ Translation Features:**
• **Instant Translation** - Real-time processing
• **Context-Aware** - Maintains educational meaning
• **Technical Accuracy** - Preserves technical terms
• **Cultural Adaptation** - Localized content

**🎯 Use Cases:**
• Non-English speakers
• Multilingual learners
• International students
• Language practice
• Accessibility support

**💡 Pro Tip:**
Combine translation with text-to-speech for immersive language learning!`
    }

    // PDF interaction
    if (lowerMessage.includes("pdf") || lowerMessage.includes("document") || lowerMessage.includes("interact")) {
      return `📄 **Interactive PDF Features:**

**🤖 PDF Chat Functionality:**
Upload any PDF and have intelligent conversations with your documents!

**✨ Key Features:**
• **Ask Questions** - Query specific content
• **Get Summaries** - Extract key information
• **Find Information** - Locate specific topics
• **Explain Concepts** - Get detailed explanations
• **Generate Notes** - Create study materials

**📚 Supported Document Types:**
• Course materials
• Research papers
• Textbooks
• Manuals & guides
• Reports & articles
• Study notes

**🔍 Smart Capabilities:**
• **Content Search** - Find relevant sections
• **Context Understanding** - Maintains document context
• **Multi-page Analysis** - Processes entire documents
• **Citation Support** - References specific pages

**💼 Perfect For:**
• Students studying from textbooks
• Professionals reviewing reports
• Researchers analyzing papers
• Anyone working with documents

**🎯 How to Use:**
1. Upload your PDF
2. Ask questions in natural language
3. Get instant, accurate answers
4. Download summaries and notes

This feature works with PDFs up to 50MB in size!`
    }

    // Q&A Generation
    if (
      lowerMessage.includes("q&a") ||
      lowerMessage.includes("question") ||
      lowerMessage.includes("quiz") ||
      lowerMessage.includes("test")
    ) {
      return `❓ **AI Q&A Generation:**

**🧠 Smart Question Creation:**
Our AI automatically generates relevant questions and answers from any content to help you learn better!

**📝 Question Types:**
• **Multiple Choice** - Test basic understanding
• **True/False** - Quick concept checks
• **Short Answer** - Explain key concepts
• **Essay Questions** - Deep understanding
• **Practical Applications** - Real-world scenarios

**🎯 Generated From:**
• Video content
• PDF documents
• Course materials
• Lecture notes
• Study guides

**✨ Features:**
• **Difficulty Levels** - Beginner to advanced
• **Topic-Specific** - Focused on key concepts
• **Instant Feedback** - Immediate answers
• **Progress Tracking** - Monitor your learning
• **Downloadable** - Save for offline study

**📊 Learning Benefits:**
• **Active Learning** - Engage with content
• **Self-Assessment** - Test your knowledge
• **Exam Preparation** - Practice before tests
• **Knowledge Gaps** - Identify weak areas
• **Retention** - Improve memory through testing

**🎓 Perfect For:**
• Students preparing for exams
• Professionals learning new skills
• Anyone wanting to test their knowledge
• Creating study materials

The AI ensures questions are relevant, challenging, and educational!`
    }

    // Enrollment process
    if (
      lowerMessage.includes("enroll") ||
      lowerMessage.includes("sign up") ||
      lowerMessage.includes("register") ||
      lowerMessage.includes("start")
    ) {
      return `🚀 **How to Get Started:**

**📝 Easy Enrollment Process:**

**Step 1: Create Account**
• Visit our website
• Click "Sign Up"
• Enter email and password
• Verify your email

**Step 2: Browse Courses**
• Explore course catalog
• Read course descriptions
• Check instructor profiles
• View course previews

**Step 3: Choose Your Plan**
• **Free Access** - Basic content
• **Individual Course** - Single course purchase
• **Premium Bundle** - Multiple courses
• **Annual Subscription** - Unlimited access

**Step 4: Make Payment**
• Select payment method
• Complete secure checkout
• Get instant access
• Receive confirmation email

**Step 5: Start Learning**
• Access your dashboard
• Begin with course introduction
• Track your progress
• Use AI features

**🎁 New User Benefits:**
• **7-day free trial** for premium features
• **Welcome bonus** - Extra resources
• **Onboarding support** - Personal guidance
• **Community access** - Connect with learners

**📱 Access Options:**
• Web browser (desktop/mobile)
• Mobile app (coming soon)
• Offline downloads
• Cross-device sync

Ready to start your learning journey?`
    }

    // Certificates
    if (
      lowerMessage.includes("certificate") ||
      lowerMessage.includes("certification") ||
      lowerMessage.includes("diploma")
    ) {
      return `🏆 **Certificates & Recognition:**

**📜 Certificate Types:**
• **Course Completion** - Individual course certificates
• **Specialization** - Complete learning path certificates
• **Professional** - Industry-recognized credentials
• **Master Class** - Advanced skill certificates

**✅ Certificate Requirements:**
• Complete all course modules
• Pass final assessments (70% minimum)
• Submit required projects
• Participate in discussions

**🎨 Certificate Features:**
• **Professional Design** - Beautiful, printable format
• **Verification Code** - Authentic and verifiable
• **Digital Badge** - Share on LinkedIn/social media
• **PDF Download** - High-quality format
• **Blockchain Verified** - Tamper-proof credentials

**💼 Industry Recognition:**
• Accepted by employers
• LinkedIn profile integration
• Portfolio enhancement
• Career advancement
• Skill validation

**🌟 Additional Benefits:**
• **Alumni Network** - Connect with graduates
• **Job Board Access** - Exclusive opportunities
• **Continuing Education** - Advanced courses
• **Mentor Support** - Career guidance

**📊 Certificate Statistics:**
• 95% of students complete courses
• 87% report career advancement
• 92% employer satisfaction rate
• 1000+ certificates issued monthly

Your certificate is a testament to your dedication and new skills!`
    }

    // Payment methods
    if (
      lowerMessage.includes("payment") ||
      lowerMessage.includes("pay") ||
      lowerMessage.includes("esewa") ||
      lowerMessage.includes("khalti")
    ) {
      return `💳 **Payment Methods & Security:**

**🇳🇵 Local Payment Options:**
• **eSewa** - Most popular (instant processing)
• **Khalti** - Digital wallet (quick & secure)
• **IME Pay** - Bank integration
• **Bank Transfer** - Direct bank payment

**🌍 International Options:**
• **Visa/Mastercard** - Credit/debit cards
• **PayPal** - Global payment system
• **Stripe** - Secure card processing
• **Bank Wire** - International transfers

**🔒 Security Features:**
• **SSL Encryption** - 256-bit security
• **PCI Compliance** - Industry standards
• **Fraud Protection** - Advanced monitoring
• **Secure Checkout** - Protected transactions

**💰 Pricing Transparency:**
• **No Hidden Fees** - What you see is what you pay
• **Instant Access** - Immediate course availability
• **Refund Policy** - 30-day money-back guarantee
• **Payment Plans** - Installment options available

**🎁 Payment Benefits:**
• **Early Bird Discounts** - Save up to 30%
• **Bundle Deals** - Multiple course savings
• **Student Discounts** - 20% off with valid ID
• **Referral Rewards** - Earn credits

**📱 Mobile Payments:**
• QR code payments
• Mobile banking
• Digital wallet integration
• One-click checkout

**🔄 Refund Process:**
• 30-day guarantee
• Hassle-free returns
• Quick processing
• Full refund policy

All payments are processed securely with instant confirmation!`
    }

    // General help or default response
    return `🤖 **I'm here to help!**

I can provide information about:

**📚 Platform Features:**
• Course offerings and structure
• AI-powered learning tools
• Video summarization
• Multi-language translation
• PDF interaction and summarization
• Q&A generation

**💰 Pricing & Payments:**
• Course pricing and packages
• Payment methods (eSewa, Khalti, etc.)
• Discounts and special offers
• Refund policies

**🎓 Getting Started:**
• Enrollment process
• Account creation
• Course selection
• Learning paths

**🏆 Certification:**
• Certificate requirements
• Verification process
• Industry recognition

**🔧 Technical Support:**
• Platform navigation
• Feature tutorials
• Troubleshooting

**💬 Ask me anything like:**
• "How much do courses cost?"
• "What is video summarization?"
• "How do I enroll?"
• "What certificates do you offer?"

What would you like to know more about?`
  }

  const sendMessage = async (messageText?: string) => {
    const textToSend = messageText || inputMessage.trim()
    if (!textToSend || isLoading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      content: textToSend,
      sender: "user",
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInputMessage("")
    setIsLoading(true)
    setShowSuggestions(false)

    // Add typing indicator
    const typingMessage: Message = {
      id: `typing-${Date.now()}`,
      content: "Thinking...",
      sender: "bot",
      timestamp: new Date(),
      isTyping: true,
    }
    setMessages((prev) => [...prev, typingMessage])

    try {
      // Simulate thinking time
      await new Promise((resolve) => setTimeout(resolve, 1000 + Math.random() * 2000))

      const response = await generateBotResponse(textToSend)

      // Remove typing indicator and add actual response
      setMessages((prev) => {
        const withoutTyping = prev.filter((m) => !m.isTyping)
        const botResponse: Message = {
          id: Date.now().toString(),
          content: response,
          sender: "bot",
          timestamp: new Date(),
        }
        return [...withoutTyping, botResponse]
      })
    } catch (error) {
      console.error("Error generating response:", error)
      setMessages((prev) => prev.filter((m) => !m.isTyping))
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  const handleSuggestedQuestion = (question: string) => {
    sendMessage(question)
  }

  const formatTimestamp = (timestamp: Date) => {
    return timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[85vh] w-[90vw] flex flex-col p-0">
        <DialogHeader className="px-6 py-4 border-b bg-gradient-to-r from-blue-50 to-purple-50">
          <DialogTitle className="flex items-center gap-3">
            <div className="relative">
              <Bot className="h-6 w-6 text-blue-600" />
              <Sparkles className="h-3 w-3 text-purple-500 absolute -top-1 -right-1" />
            </div>
            <div>
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent text-lg font-bold">
                Punarjanma Support Assistant
              </span>
              <p className="text-sm text-gray-600 font-normal">Get instant help with our e-learning platform</p>
            </div>
            <Badge variant="secondary" className="ml-auto bg-green-100 text-green-800">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
              Online
            </Badge>
          </DialogTitle>
        </DialogHeader>

        {/* Messages Area */}
        <div className="flex-1 overflow-hidden">
          <ScrollArea className="h-[450px] px-6 py-4" ref={scrollAreaRef}>
            <div className="space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex gap-3 ${message.sender === "user" ? "justify-end" : "justify-start"}`}
                >
                  {message.sender === "bot" && (
                    <Avatar className="h-8 w-8 mt-1 flex-shrink-0">
                      <AvatarFallback className="bg-gradient-to-r from-blue-100 to-purple-100 text-blue-600">
                        <Bot className="h-4 w-4" />
                      </AvatarFallback>
                    </Avatar>
                  )}

                  <div
                    className={`max-w-[75%] rounded-lg px-4 py-3 ${
                      message.sender === "user"
                        ? "bg-blue-600 text-white"
                        : "bg-gradient-to-r from-gray-50 to-blue-50 text-gray-900 border border-blue-100"
                    }`}
                  >
                    {message.isTyping ? (
                      <div className="flex items-center gap-2">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <span className="text-sm">AI is thinking...</span>
                      </div>
                    ) : (
                      <>
                        <div className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</div>
                        <div className="text-xs opacity-70 mt-2">{formatTimestamp(message.timestamp)}</div>
                      </>
                    )}
                  </div>

                  {message.sender === "user" && (
                    <Avatar className="h-8 w-8 mt-1 flex-shrink-0">
                      <AvatarFallback className="bg-blue-100 text-blue-600">
                        <User className="h-4 w-4" />
                      </AvatarFallback>
                    </Avatar>
                  )}
                </div>
              ))}

              {/* Suggested Questions */}
              {showSuggestions && (
                <div className="space-y-3 mt-6">
                  <h4 className="text-sm font-medium text-gray-700 flex items-center gap-2">
                    <MessageSquare className="h-4 w-4" />
                    Popular Questions:
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {suggestedQuestions.map((suggestion) => (
                      <Card
                        key={suggestion.id}
                        className="cursor-pointer hover:bg-blue-50 hover:border-blue-200 transition-colors"
                        onClick={() => handleSuggestedQuestion(suggestion.question)}
                      >
                        <CardContent className="p-3">
                          <div className="flex items-center gap-2">
                            <div className="text-blue-600">{suggestion.icon}</div>
                            <div className="flex-1">
                              <p className="text-sm font-medium text-gray-900">{suggestion.question}</p>
                              <p className="text-xs text-gray-500">{suggestion.category}</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>
        </div>

        {/* Input Area */}
        <div className="px-6 py-4 border-t bg-gray-50">
          <div className="flex gap-2">
            <Input
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask me anything about our platform..."
              disabled={isLoading}
              className="flex-1 bg-white"
            />
            <Button onClick={() => sendMessage()} disabled={!inputMessage.trim() || isLoading} size="sm">
              {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
            </Button>
          </div>
          <div className="flex items-center justify-between mt-2">
            <div className="flex items-center gap-4 text-xs text-gray-500">
              <span className="flex items-center gap-1">
                <Users className="h-3 w-3" />
                24/7 Support
              </span>
              <span className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                Avg response: 2s
              </span>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
