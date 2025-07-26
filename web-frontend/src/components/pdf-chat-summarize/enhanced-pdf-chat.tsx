"use client";

import type React from "react";
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Upload,
  FileText,
  Send,
  Loader2,
  Bot,
  User,
  Trash2,
  Eye,
  MessageSquare,
  Sparkles,
  CheckCircle,
  AlertCircle,
  RefreshCw,
  Copy,
  ThumbsUp,
  ThumbsDown,
} from "lucide-react";
import toast from "react-hot-toast";
import Markdown from "./Markdown";

interface IDoc {
  pageContent?: string;
  metadata?: {
    loc?: {
      pageNumber?: number;
    };
    source?: string;
  };
}

interface IMessages {
  role: "assistant" | "user";
  content?: string;
  documents?: IDoc[];
  timestamp?: Date;
}

export default function EnhancedPDFChat() {
  const [message, setMessage] = useState<string>("");
  const [messages, setMessages] = useState<IMessages[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploadLoading, setUploadLoading] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<string | null>(null);
  const [uploadStatus, setUploadStatus] = useState<
    "idle" | "success" | "error"
  >("idle");
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    const scrollToBottom = () => {
      if (scrollAreaRef.current) {
        const scrollContainer = scrollAreaRef.current.querySelector(
          "[data-radix-scroll-area-viewport]"
        );
        if (scrollContainer) {
          scrollContainer.scrollTop = scrollContainer.scrollHeight;
        }
      }
    };

    // Small delay to ensure content is rendered
    const timeoutId = setTimeout(scrollToBottom, 100);
    return () => clearTimeout(timeoutId);
  }, [messages, loading]);

  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.type !== "application/pdf") {
      toast.error("Please upload a PDF file only.");
      return;
    }

    if (file.size > 50 * 1024 * 1024) {
      // 50MB limit
      toast.error("Please upload a PDF file smaller than 50MB.");
      return;
    }

    const formData = new FormData();
    formData.append("pdf", file);

    setUploadLoading(true);
    setUploadStatus("idle");

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_RAG_BASE_URL}/upload/pdf`,
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await res.json();

      if (res.ok) {
        setUploadedFile(file.name);
        setUploadStatus("success");
        setMessages([]); // Clear previous messages
        toast.success(`${file.name} has been processed and is ready for chat.`);
      } else {
        throw new Error(data.message || "Upload failed");
      }
    } catch (err) {
      console.error("Upload failed:", err);
      setUploadStatus("error");
      toast.error("There was an error processing your PDF. Please try again.");
    } finally {
      setUploadLoading(false);
    }
  };

  const handleSendMessage = async () => {
    if (!message.trim() || !uploadedFile) return;

    const userMessage: IMessages = {
      role: "user",
      content: message,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setMessage("");
    setLoading(true);

    try {
      const res = await fetch(
        `${
          process.env.NEXT_PUBLIC_RAG_BASE_URL
        }/chat?message=${encodeURIComponent(message)}`
      );

      const data = await res.json();

      const assistantMessage: IMessages = {
        role: "assistant",
        content: data?.message || "No response received",
        documents: data?.data?.documents,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (err) {
      console.error("Error sending message", err);
      const errorMessage: IMessages = {
        role: "assistant",
        content:
          "Sorry, I encountered an error while processing your request. Please try again.",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const handleResetChat = async () => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_RAG_BASE_URL}/chat/reset`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ sessionId: "default" }),
        }
      );

      if (res.ok) {
        setMessages([]);
        setUploadedFile(null);
        setUploadStatus("idle");
        toast.success("Chat history has been cleared successfully.");
      }
    } catch (err) {
      console.error("Reset failed:", err);
      toast.error("Failed to reset chat history. Please try again.");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Message copied to clipboard");
  };

  const formatTimestamp = (timestamp?: Date) => {
    if (!timestamp) return "";
    return timestamp.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const suggestedQuestions = [
    "Summarize the main points of this document",
    "What are the key findings or conclusions?",
    "Explain the methodology used in this document",
    "What are the important dates or numbers mentioned?",
    "List the main topics covered in this PDF",
  ];

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-primary bg-clip-text">
          AI PDF Chat & Summarization
        </h1>
        <p className="text-gray-600">
          Upload a PDF and have intelligent conversations with your document
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Upload Section */}
        <div className="lg:col-span-1 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Document Upload
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <input
                ref={fileInputRef}
                type="file"
                accept="application/pdf"
                onChange={handleFileUpload}
                className="hidden"
              />

              <div
                onClick={() => !uploadLoading && fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all duration-200 ${
                  uploadLoading
                    ? "border-gray-300 bg-gray-50 cursor-not-allowed"
                    : uploadStatus === "success"
                    ? "border-green-300 bg-green-50 hover:bg-green-100"
                    : uploadStatus === "error"
                    ? "border-red-300 bg-red-50"
                    : "border-blue-300 bg-blue-50 hover:bg-blue-100 hover:border-blue-400"
                }`}
              >
                {uploadLoading ? (
                  <div className="space-y-2">
                    <Loader2 className="h-8 w-8 animate-spin mx-auto text-blue-600" />
                    <p className="text-sm text-gray-600">Processing PDF...</p>
                  </div>
                ) : uploadStatus === "success" ? (
                  <div className="space-y-2">
                    <CheckCircle className="h-8 w-8 mx-auto text-green-600" />
                    <p className="text-sm font-medium text-green-700">
                      Upload Successful!
                    </p>
                    <p className="text-xs text-green-600">{uploadedFile}</p>
                  </div>
                ) : uploadStatus === "error" ? (
                  <div className="space-y-2">
                    <AlertCircle className="h-8 w-8 mx-auto text-red-600" />
                    <p className="text-sm font-medium text-red-700">
                      Upload Failed
                    </p>
                    <p className="text-xs text-red-600">Click to try again</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <Upload className="h-8 w-8 mx-auto text-blue-600" />
                    <p className="text-sm font-medium text-blue-700">
                      Click to Upload PDF
                    </p>
                    {/* <p className="text-xs text-gray-500">Max size: 50MB</p> */}
                  </div>
                )}
              </div>

              {uploadedFile && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-200">
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-green-600" />
                      <span className="text-sm font-medium text-green-700">
                        {uploadedFile}
                      </span>
                    </div>
                    <Badge
                      variant="secondary"
                      className="bg-green-100 text-green-800"
                    >
                      Ready
                    </Badge>
                  </div>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleResetChat}
                    className="w-full text-red-600 hover:text-red-700 hover:bg-red-50 bg-transparent"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Reset & Upload New PDF
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Suggested Questions */}
          {uploadedFile && messages.length === 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-sm">
                  <Sparkles className="h-4 w-4" />
                  Suggested Questions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {suggestedQuestions.map((question, index) => (
                  <Button
                    key={index}
                    variant="ghost"
                    size="sm"
                    className="w-full text-left justify-start h-auto p-3 text-xs"
                    onClick={() => setMessage(question)}
                  >
                    <MessageSquare className="h-3 w-3 mr-2 flex-shrink-0" />
                    <span className="text-wrap">{question}</span>
                  </Button>
                ))}
              </CardContent>
            </Card>
          )}
        </div>

        {/* Chat Section */}
        <div className="lg:col-span-2">
          <Card className="h-[600px] flex flex-col">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Bot className="h-5 w-5" />
                  AI Chat Assistant
                </div>
                {messages.length > 0 && (
                  <Button variant="ghost" size="sm" onClick={handleResetChat}>
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Clear Chat
                  </Button>
                )}
              </CardTitle>
            </CardHeader>

            <CardContent className="flex-1 flex flex-col p-0 overflow-y-auto">
              {/* Messages Area */}
              <div className="flex-1 overflow-hidden">
                <ScrollArea className="h-full px-6 py-4" ref={scrollAreaRef}>
                  {messages.length === 0 && uploadedFile ? (
                    <div className="flex flex-col items-center justify-center h-[400px] text-center space-y-4">
                      <div className="bg-blue-100 rounded-full p-6">
                        <MessageSquare className="h-12 w-12 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-2">
                          Ready to Chat!
                        </h3>
                        <p className="text-gray-600 text-sm">
                          Your PDF has been processed. Ask me anything about the
                          document.
                        </p>
                      </div>
                    </div>
                  ) : messages.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-[400px] text-center space-y-4">
                      <div className="bg-gray-100 rounded-full p-6">
                        <FileText className="h-12 w-12 text-gray-400" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-2">
                          Upload a PDF to Start
                        </h3>
                        <p className="text-gray-600 text-sm">
                          Upload a PDF document to begin chatting and get
                          summaries, answers, and insights.
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4 min-h-0">
                      {messages.map((msg, index) => (
                        <div
                          key={index}
                          className={`flex gap-3 ${
                            msg.role === "user"
                              ? "justify-end"
                              : "justify-start"
                          }`}
                        >
                          {msg.role === "assistant" && (
                            <Avatar className="h-8 w-8 mt-1 flex-shrink-0">
                              <AvatarFallback className="bg-blue-100 text-blue-600">
                                <Bot className="h-4 w-4" />
                              </AvatarFallback>
                            </Avatar>
                          )}

                          <div
                            className={`max-w-[75%] rounded-lg px-4 py-3 break-words ${
                              msg.role === "user"
                                ? "bg-blue-600 text-white"
                                : "bg-gray-50 text-gray-900 border border-gray-200"
                            }`}
                          >
                            <div className="text-sm leading-relaxed overflow-hidden">
                              <Markdown markdown={msg.content || ""} />
                            </div>

                            {msg.documents && msg.documents.length > 0 && (
                              <div className="mt-3 pt-3 border-t border-gray-200">
                                <p className="text-xs font-medium text-gray-600 mb-2 flex items-center gap-1">
                                  <Eye className="h-3 w-3" />
                                  Source References ({msg.documents.length})
                                </p>
                                <div className="space-y-2 max-h-32 overflow-y-auto">
                                  {msg.documents
                                    .slice(0, 2)
                                    .map((doc, docIndex) => (
                                      <div
                                        key={docIndex}
                                        className="bg-white p-2 rounded border text-xs"
                                      >
                                        <p className="text-gray-700 line-clamp-3 break-words">
                                          {doc.pageContent}
                                        </p>
                                        {doc.metadata?.loc?.pageNumber && (
                                          <p className="text-gray-500 mt-1">
                                            Page {doc.metadata.loc.pageNumber}
                                          </p>
                                        )}
                                      </div>
                                    ))}
                                  {msg.documents.length > 2 && (
                                    <p className="text-xs text-gray-500">
                                      +{msg.documents.length - 2} more
                                      references
                                    </p>
                                  )}
                                </div>
                              </div>
                            )}

                            <div className="flex items-center justify-between mt-2">
                              <span className="text-xs opacity-70">
                                {formatTimestamp(msg.timestamp)}
                              </span>
                              {msg.role === "assistant" && (
                                <div className="flex items-center gap-1">
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-6 w-6 p-0 opacity-50 hover:opacity-100"
                                    onClick={() =>
                                      copyToClipboard(msg.content || "")
                                    }
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
                          </div>

                          {msg.role === "user" && (
                            <Avatar className="h-8 w-8 mt-1 flex-shrink-0">
                              <AvatarFallback className="bg-blue-100 text-blue-600">
                                <User className="h-4 w-4" />
                              </AvatarFallback>
                            </Avatar>
                          )}
                        </div>
                      ))}

                      {loading && (
                        <div className="flex gap-3 justify-start">
                          <Avatar className="h-8 w-8 mt-1 flex-shrink-0">
                            <AvatarFallback className="bg-blue-100 text-blue-600">
                              <Bot className="h-4 w-4" />
                            </AvatarFallback>
                          </Avatar>
                          <div className="bg-gray-50 rounded-lg px-4 py-3 border border-gray-200">
                            <div className="flex items-center gap-2">
                              <Loader2 className="h-4 w-4 animate-spin" />
                              <span className="text-sm text-gray-600">
                                AI is analyzing your question...
                              </span>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </ScrollArea>
              </div>

              {/* Input Area */}
              <div className="p-6 border-t bg-gray-50">
                {!uploadedFile ? (
                  <Alert>
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                      Please upload a PDF document first to start chatting.
                    </AlertDescription>
                  </Alert>
                ) : (
                  <div className="flex gap-2">
                    <Textarea
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      onKeyDown={handleKeyPress}
                      placeholder="Ask me anything about your PDF document..."
                      disabled={loading}
                      className="flex-1 min-h-[60px] resize-none bg-white"
                      rows={2}
                    />
                    <Button
                      onClick={handleSendMessage}
                      disabled={!message.trim() || loading}
                      size="lg"
                      className="px-6"
                    >
                      {loading ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Send className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                )}
                <div className="flex items-center justify-between mt-2 text-xs text-gray-500">
                  <span>Press Enter to send, Shift+Enter for new line</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
