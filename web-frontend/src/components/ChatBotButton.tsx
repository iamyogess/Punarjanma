import { BotMessageSquare } from "lucide-react";
import Link from "next/link";
import React from "react";

const ChatBotButton = () => {
  return (
    <Link
      href="/ai-chatbot"
      className="fixed right-18 bottom-20 h-16 w-16 flex justify-center items-center bg-primary rounded-full"
    >
      <BotMessageSquare className="text-white h-8 w-8" />
    </Link>
  );
};

export default ChatBotButton;
