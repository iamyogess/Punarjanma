"use client"

import { useState } from "react"
import { BotMessageSquare } from "lucide-react"
import { CustomerSupportChatbot } from "./customer-support-chatbot"

const ChatBotButton = () => {
  const [isChatOpen, setIsChatOpen] = useState(false)

  return (
    <>
      <button
        onClick={() => setIsChatOpen(true)}
        className="fixed right-6 bottom-6 h-16 w-16 flex justify-center items-center bg-primary rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 z-50"
        aria-label="Open customer support chat"
      >
        <BotMessageSquare className="text-white h-8 w-8" />

        {/* Pulse animation */}
        <div className="absolute inset-0 rounded-full bg-primary animate-ping opacity-20"></div>

        {/* Notification badge */}
        <div className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 rounded-full flex items-center justify-center">
          <span className="text-xs text-white font-bold">!</span>
        </div>
      </button>

      <CustomerSupportChatbot isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />
    </>
  )
}

export default ChatBotButton
