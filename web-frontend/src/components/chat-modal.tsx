"use client";

import type React from "react";
import { useState, useRef, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Send,
  Bot,
  User,
  Loader2,
  Copy,
  ThumbsUp,
  ThumbsDown,
  Sparkles,
} from "lucide-react";
import toast from "react-hot-toast";

interface Message {
  id: string;
  content: string;
  sender: "user" | "ai" | "instructor";
  timestamp: Date;
  isTyping?: boolean;
}

interface ChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  chatType: "ai" | "instructor";
  courseTitle: string;
  lessonTitle?: string;
  lessonContent?: string;
}

export function ChatModal({
  isOpen,
  onClose,
  chatType,
  courseTitle,
  lessonTitle,
  lessonContent,
}: ChatModalProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages]);

  // Initialize chat with welcome message
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      const welcomeMessage: Message = {
        id: Date.now().toString(),
        content:
          chatType === "ai"
            ? `Hi! I'm your AI learning assistant powered by Gemini. I'm here to help you understand "${courseTitle}" and answer any questions you have about the course content. ${
                lessonTitle
                  ? `We're currently focusing on: "${lessonTitle}".`
                  : ""
              } 

What would you like to learn about today?`
            : `Hello! I'm your instructor for "${courseTitle}". I'm here to help you with any questions about the course, assignments, or your learning journey. ${
                lessonTitle ? `I see you're working on: "${lessonTitle}".` : ""
              } 

How can I support your learning today?`,
        sender: chatType === "ai" ? "ai" : "instructor",
        timestamp: new Date(),
      };
      setMessages([welcomeMessage]);
    }
  }, [isOpen, chatType, courseTitle, lessonTitle]);

  const sendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputMessage.trim(),
      sender: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputMessage("");
    setIsLoading(true);

    // Add typing indicator
    const typingMessage: Message = {
      id: `typing-${Date.now()}`,
      content: "Thinking...",
      sender: chatType === "ai" ? "ai" : "instructor",
      timestamp: new Date(),
      isTyping: true,
    };
    setMessages((prev) => [...prev, typingMessage]);

    try {
      const response = await fetch("/api/chat/gemini", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          message: inputMessage.trim(),
          chatType,
          courseTitle,
          lessonTitle,
          lessonContent,
          conversationHistory: messages.filter((m) => !m.isTyping).slice(-10), // Last 10 messages for context
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to send message");
      }

      const data = await response.json();

      // Remove typing indicator and add actual response
      setMessages((prev) => {
        const withoutTyping = prev.filter((m) => !m.isTyping);
        const aiResponse: Message = {
          id: Date.now().toString(),
          content: data.response,
          sender: chatType === "ai" ? "ai" : "instructor",
          timestamp: new Date(),
        };
        return [...withoutTyping, aiResponse];
      });
    } catch (error) {
      console.error("Error sending message:", error);
      setMessages((prev) => prev.filter((m) => !m.isTyping));
      toast.error("Failed to send message. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const copyMessage = (content: string) => {
    navigator.clipboard.writeText(content);
    toast.success("Message copied to clipboard");
  };

  const formatTimestamp = (timestamp: Date) => {
    return timestamp.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] w-[90vw] flex flex-col p-0">
        <DialogHeader className="px-6 py-4 border-b bg-gradient-to-r from-blue-50 to-purple-50">
          <DialogTitle className="flex items-center gap-2">
            {chatType === "ai" ? (
              <>
                <div className="relative">
                  <Bot className="h-5 w-5 text-blue-600" />
                  <Sparkles className="h-3 w-3 text-purple-500 absolute -top-1 -right-1" />
                </div>
                <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  AI Learning Assistant
                </span>
            
              </>
            ) : (
              <>
                <User className="h-5 w-5 text-green-600" />
                <span className="text-green-700">Course Instructor</span>
              </>
            )}
            {/* <Badge variant="outline" className="ml-auto">
              {courseTitle}
            </Badge> */}
          </DialogTitle>
          {lessonTitle && (
            <p className="text-sm text-gray-600 mt-1 flex items-center gap-2">
              <span>Currently discussing:</span>
              <Badge variant="secondary" className="text-xs">
                {lessonTitle}
              </Badge>
            </p>
          )}
        </DialogHeader>

        {/* Messages Area */}
        <div className="flex-1 overflow-hidden">
          <ScrollArea className="h-[400px] px-6 py-4" ref={scrollAreaRef}>
            <div className="space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex gap-3 ${
                    message.sender === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  {message.sender !== "user" && (
                    <Avatar className="h-8 w-8 mt-1 flex-shrink-0">
                      <AvatarFallback
                        className={
                          message.sender === "ai"
                            ? "bg-gradient-to-r from-blue-100 to-purple-100 text-blue-600"
                            : "bg-green-100 text-green-600"
                        }
                      >
                        {message.sender === "ai" ? (
                          <Bot className="h-4 w-4" />
                        ) : (
                          <User className="h-4 w-4" />
                        )}
                      </AvatarFallback>
                    </Avatar>
                  )}

                  <div
                    className={`max-w-[70%] rounded-lg px-4 py-2 ${
                      message.sender === "user"
                        ? "bg-blue-600 text-white"
                        : message.sender === "ai"
                        ? "bg-gradient-to-r from-gray-50 to-blue-50 text-gray-900 border border-blue-100"
                        : "bg-green-50 text-green-900 border border-green-200"
                    }`}
                  >
                    {message.isTyping ? (
                      <div className="flex items-center gap-2">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <span className="text-sm">
                          {chatType === "ai"
                            ? "AI is thinking..."
                            : "Instructor is typing..."}
                        </span>
                      </div>
                    ) : (
                      <>
                        <p className="text-sm leading-relaxed whitespace-pre-wrap">
                          {message.content}
                        </p>
                        <div className="flex items-center justify-between mt-2">
                          <span className="text-xs opacity-70">
                            {formatTimestamp(message.timestamp)}
                          </span>
                          {message.sender !== "user" && (
                            <div className="flex items-center gap-1">
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-6 w-6 p-0 opacity-50 hover:opacity-100"
                                onClick={() => copyMessage(message.content)}
                              >
                                <Copy className="h-3 w-3" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-6 w-6 p-0 opacity-50 hover:opacity-100"
                              >
                                <ThumbsUp className="h-3 w-3" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-6 w-6 p-0 opacity-50 hover:opacity-100"
                              >
                                <ThumbsDown className="h-3 w-3" />
                              </Button>
                            </div>
                          )}
                        </div>
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
              placeholder={
                chatType === "ai"
                  ? `Ask me anything about ${lessonTitle || "this course"}...`
                  : "Ask your instructor a question..."
              }
              disabled={isLoading}
              className="flex-1 bg-white"
            />
            <Button
              onClick={sendMessage}
              disabled={!inputMessage.trim() || isLoading}
              size="sm"
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
            </Button>
          </div>
          {chatType === "ai" && (
            <p className="text-xs text-gray-500 mt-2 flex items-center gap-1">
              <Sparkles className="h-3 w-3" />
              Powered by Google Gemini AI
            </p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
