"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { FileText, Languages, Loader2, Download, Copy, CheckCircle, AlertCircle, Info } from "lucide-react"

interface VideoFeaturesProps {
  videoUrl: string
  videoTitle: string
  subjectContext?: string // Add context about the course subject
}

interface TranscriptData {
  videoId: string
  transcript: string
  wordCount: number
  isGenerated?: boolean
  message?: string
}

interface SummaryData {
  summary: string
  language: string
  originalLength: number
  summaryLength: number
}

interface TranslationData {
  originalText: string
  translatedText: string
  fromLanguage: string
  toLanguage: string
}

export default function VideoFeatures({ videoUrl, videoTitle, subjectContext }: VideoFeaturesProps) {
  const [transcript, setTranscript] = useState<TranscriptData | null>(null)
  const [summary, setSummary] = useState<SummaryData | null>(null)
  const [translation, setTranslation] = useState<TranslationData | null>(null)

  const [loadingTranscript, setLoadingTranscript] = useState(false)
  const [loadingSummary, setLoadingSummary] = useState(false)
  const [loadingTranslation, setLoadingTranslation] = useState(false)

  const [error, setError] = useState<string | null>(null)
  const [copied, setCopied] = useState<string | null>(null)

  const fetchTranscript = async () => {
    setLoadingTranscript(true)
    setError(null)

    try {
      const response = await fetch("/api/video/transcript", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          videoUrl,
          videoTitle,
          subjectContext,
        }),
      })

      const data = await response.json()

      if (data.success) {
        setTranscript(data.data)
      } else {
        setError(data.error || "Failed to generate transcript")
      }
    } catch (err) {
      console.error("Network error:", err)
      setError("Network error occurred. Please check your connection and try again.")
    } finally {
      setLoadingTranscript(false)
    }
  }

  const generateSummary = async (language: "english" | "nepali" = "english") => {
    if (!transcript) {
      setError("Please fetch transcript first")
      return
    }

    setLoadingSummary(true)
    setError(null)

    try {
      const response = await fetch("/api/video/summarize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          transcript: transcript.transcript,
          language,
        }),
      })

      const data = await response.json()

      if (data.success) {
        setSummary(data.data)
      } else {
        setError(data.error || "Failed to generate summary. Please make sure you have set up your GROQ_API_KEY.")
      }
    } catch (err) {
      console.error("Summary error:", err)
      setError("Failed to generate summary. Please check your AI service configuration.")
    } finally {
      setLoadingSummary(false)
    }
  }

  const translateText = async (text: string, fromLang: string, toLang: string) => {
    setLoadingTranslation(true)
    setError(null)

    try {
      const response = await fetch("/api/video/translate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text,
          fromLanguage: fromLang,
          toLanguage: toLang,
        }),
      })

      const data = await response.json()

      if (data.success) {
        setTranslation(data.data)
      } else {
        setError(data.error || "Translation failed. The translation service may be temporarily unavailable.")
      }
    } catch (err) {
      console.error("Translation error:", err)
      setError("Translation service error. Please try again later.")
    } finally {
      setLoadingTranslation(false)
    }
  }

  const copyToClipboard = async (text: string, type: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(type)
      setTimeout(() => setCopied(null), 2000)
    } catch (err) {
      console.error("Failed to copy text:", err)
      setError("Failed to copy to clipboard")
    }
  }

  const downloadText = (text: string, filename: string) => {
    try {
      const blob = new Blob([text], { type: "text/plain" })
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = filename
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    } catch (err) {
      console.error("Failed to download:", err)
      setError("Failed to download file")
    }
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          Video Analysis & Translation
        </CardTitle>
      </CardHeader>
      <CardContent>
        {error && (
          <Alert className="mb-4" variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {transcript?.isGenerated && (
          <Alert className="mb-4">
            <Info className="h-4 w-4" />
            <AlertDescription>
              {transcript.message || "Generated contextual transcript based on video content"}
            </AlertDescription>
          </Alert>
        )}

        <Tabs defaultValue="transcript" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="transcript">Transcript</TabsTrigger>
            <TabsTrigger value="summary">Summary</TabsTrigger>
            {/* <TabsTrigger value="translation">Translation</TabsTrigger> */}
          </TabsList>

          <TabsContent value="transcript" className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Video Transcript</h3>
              <Button onClick={fetchTranscript} disabled={loadingTranscript} size="sm">
                {loadingTranscript ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Generating...
                  </>
                ) : (
                  "Generate Transcript"
                )}
              </Button>
            </div>

            {transcript && (
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Badge variant="outline">{transcript.wordCount} words</Badge>
                  {transcript.isGenerated && <Badge variant="secondary">AI Generated</Badge>}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => copyToClipboard(transcript.transcript, "transcript")}
                  >
                    {copied === "transcript" ? (
                      <CheckCircle className="h-4 w-4 mr-1" />
                    ) : (
                      <Copy className="h-4 w-4 mr-1" />
                    )}
                    Copy
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => downloadText(transcript.transcript, `${videoTitle}-transcript.txt`)}
                  >
                    <Download className="h-4 w-4 mr-1" />
                    Download
                  </Button>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg max-h-96 overflow-y-auto">
                  <p className="text-sm leading-relaxed whitespace-pre-wrap">{transcript.transcript}</p>
                </div>
              </div>
            )}
          </TabsContent>

          <TabsContent value="summary" className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Video Summary</h3>
              <div className="flex gap-2">
                <Button
                  onClick={() => generateSummary("english")}
                  disabled={loadingSummary || !transcript}
                  size="sm"
                  variant="outline"
                >
                  {loadingSummary ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : null}
                  English
                </Button>
                <Button
                  onClick={() => generateSummary("nepali")}
                  disabled={loadingSummary || !transcript}
                  size="sm"
                  variant="outline"
                >
                  {loadingSummary ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : null}
                  नेपाली
                </Button>
              </div>
            </div>

            {!transcript && (
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>Please generate the transcript first to create a summary.</AlertDescription>
              </Alert>
            )}

            {summary && (
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Badge variant="outline">{summary.language}</Badge>
                  <Badge variant="outline">{summary.summaryLength} characters</Badge>
                  <Button variant="outline" size="sm" onClick={() => copyToClipboard(summary.summary, "summary")}>
                    {copied === "summary" ? (
                      <CheckCircle className="h-4 w-4 mr-1" />
                    ) : (
                      <Copy className="h-4 w-4 mr-1" />
                    )}
                    Copy
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => downloadText(summary.summary, `${videoTitle}-summary-${summary.language}.txt`)}
                  >
                    <Download className="h-4 w-4 mr-1" />
                    Download
                  </Button>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm leading-relaxed whitespace-pre-wrap">{summary.summary}</p>
                </div>
              </div>
            )}
          </TabsContent>

          {/* <TabsContent value="translation" className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Translation</h3>
              <div className="flex gap-2">
                <Button
                  onClick={() => summary && translateText(summary.summary, "english", "nepali")}
                  disabled={loadingTranslation || !summary}
                  size="sm"
                  variant="outline"
                >
                  {loadingTranslation ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <Languages className="h-4 w-4 mr-2" />
                  )}
                  EN → NE
                </Button>
                <Button
                  onClick={() => summary && translateText(summary.summary, "nepali", "english")}
                  disabled={loadingTranslation || !summary}
                  size="sm"
                  variant="outline"
                >
                  {loadingTranslation ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <Languages className="h-4 w-4 mr-2" />
                  )}
                  NE → EN
                </Button>
              </div>
            </div>

            {!summary && (
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>Please generate a summary first to enable translation.</AlertDescription>
              </Alert>
            )}

            {translation && (
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Badge variant="outline">
                    {translation.fromLanguage} → {translation.toLanguage}
                  </Badge>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => copyToClipboard(translation.translatedText, "translation")}
                  >
                    {copied === "translation" ? (
                      <CheckCircle className="h-4 w-4 mr-1" />
                    ) : (
                      <Copy className="h-4 w-4 mr-1" />
                    )}
                    Copy
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      downloadText(
                        translation.translatedText,
                        `${videoTitle}-translation-${translation.toLanguage}.txt`,
                      )
                    }
                  >
                    <Download className="h-4 w-4 mr-1" />
                    Download
                  </Button>
                </div>

                <div className="grid gap-4">
                  <div>
                    <h4 className="font-medium mb-2">Original ({translation.fromLanguage})</h4>
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <p className="text-sm leading-relaxed whitespace-pre-wrap">{translation.originalText}</p>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium mb-2">Translation ({translation.toLanguage})</h4>
                    <div className="bg-blue-50 p-3 rounded-lg">
                      <p className="text-sm leading-relaxed whitespace-pre-wrap">{translation.translatedText}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </TabsContent> */}
        </Tabs>
      </CardContent>
    </Card>
  )
}
