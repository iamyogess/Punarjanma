"use client"

import { useState, useRef, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  FileText,
  Languages,
  MessageSquare,
  Download,
  Loader2,
  Play,
  Pause,
  Volume2,
  RotateCcw,
  Settings,
  Headphones,
} from "lucide-react"
import { Slider } from "@/components/ui/slider"

interface VideoFeaturesProps {
  videoUrl: string
  videoTitle: string
  subjectContext: string
}

interface TTSSettings {
  voice: string
  rate: number
  pitch: number
  volume: number
}

export default function VideoFeatures({ videoUrl, videoTitle, subjectContext }: VideoFeaturesProps) {
  const [activeTab, setActiveTab] = useState("summary")
  const [summary, setSummary] = useState("")
  const [translation, setTranslation] = useState("")
  const [qna, setQna] = useState("")
  const [targetLanguage, setTargetLanguage] = useState("ne")
  const [loading, setLoading] = useState({ summary: false, translation: false, qna: false })

  // Text-to-Speech states
  const [isPlaying, setIsPlaying] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const [currentText, setCurrentText] = useState("")
  const [availableVoices, setAvailableVoices] = useState<SpeechSynthesisVoice[]>([])
  const [ttsSettings, setTtsSettings] = useState<TTSSettings>({
    voice: "",
    rate: 1,
    pitch: 1,
    volume: 0.8,
  })
  const [showTTSSettings, setShowTTSSettings] = useState(false)

  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null)

  // Load available voices
  useEffect(() => {
    const loadVoices = () => {
      const voices = speechSynthesis.getVoices()
      setAvailableVoices(voices)
      if (voices.length > 0 && !ttsSettings.voice) {
        const englishVoice = voices.find((voice) => voice.lang.startsWith("en"))
        setTtsSettings((prev) => ({
          ...prev,
          voice: englishVoice?.name || voices[0].name,
        }))
      }
    }

    loadVoices()
    speechSynthesis.addEventListener("voiceschanged", loadVoices)

    return () => {
      speechSynthesis.removeEventListener("voiceschanged", loadVoices)
      if (utteranceRef.current) {
        speechSynthesis.cancel()
      }
    }
  }, [])

  const playTextToSpeech = (text: string) => {
    if (!text.trim()) return

    speechSynthesis.cancel()

    const utterance = new SpeechSynthesisUtterance(text)
    const selectedVoice = availableVoices.find((voice) => voice.name === ttsSettings.voice)

    if (selectedVoice) {
      utterance.voice = selectedVoice
    }

    utterance.rate = ttsSettings.rate
    utterance.pitch = ttsSettings.pitch
    utterance.volume = ttsSettings.volume

    utterance.onstart = () => {
      setIsPlaying(true)
      setIsPaused(false)
      setCurrentText(text)
    }

    utterance.onend = () => {
      setIsPlaying(false)
      setIsPaused(false)
      setCurrentText("")
    }

    utterance.onerror = () => {
      setIsPlaying(false)
      setIsPaused(false)
      setCurrentText("")
    }

    utteranceRef.current = utterance
    speechSynthesis.speak(utterance)
  }

  const pauseTextToSpeech = () => {
    if (speechSynthesis.speaking && !speechSynthesis.paused) {
      speechSynthesis.pause()
      setIsPaused(true)
    }
  }

  const resumeTextToSpeech = () => {
    if (speechSynthesis.paused) {
      speechSynthesis.resume()
      setIsPaused(false)
    }
  }

  const stopTextToSpeech = () => {
    speechSynthesis.cancel()
    setIsPlaying(false)
    setIsPaused(false)
    setCurrentText("")
  }

  const TTSControls = ({ text, label }: { text: string; label: string }) => (
    <div className="flex items-center gap-2 p-3 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-200">
      <Headphones className="h-4 w-4 text-blue-600" />
      <span className="text-sm font-medium text-gray-700">{label}</span>
      <div className="flex items-center gap-1 ml-auto">
        {!isPlaying || currentText !== text ? (
          <Button
            size="sm"
            variant="outline"
            onClick={() => playTextToSpeech(text)}
            disabled={!text.trim()}
            className="h-8 px-3 bg-white hover:bg-blue-50"
          >
            <Play className="h-3 w-3 mr-1" />
            Play
          </Button>
        ) : (
          <div className="flex items-center gap-1">
            {isPaused ? (
              <Button size="sm" variant="outline" onClick={resumeTextToSpeech} className="h-8 px-3 bg-white">
                <Play className="h-3 w-3 mr-1" />
                Resume
              </Button>
            ) : (
              <Button size="sm" variant="outline" onClick={pauseTextToSpeech} className="h-8 px-3 bg-white">
                <Pause className="h-3 w-3 mr-1" />
                Pause
              </Button>
            )}
            <Button size="sm" variant="outline" onClick={stopTextToSpeech} className="h-8 px-2 bg-white">
              <RotateCcw className="h-3 w-3" />
            </Button>
          </div>
        )}
        <Button size="sm" variant="ghost" onClick={() => setShowTTSSettings(!showTTSSettings)} className="h-8 px-2">
          <Settings className="h-3 w-3" />
        </Button>
      </div>
    </div>
  )

  const TTSSettingsPanel = () => (
    <Card className="mt-4 border-blue-200">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm flex items-center gap-2">
          <Volume2 className="h-4 w-4 text-blue-600" />
          Voice Settings
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <label className="text-xs font-medium text-gray-700 mb-2 block">Voice</label>
          <Select
            value={ttsSettings.voice}
            onValueChange={(value) => setTtsSettings((prev) => ({ ...prev, voice: value }))}
          >
            <SelectTrigger className="h-8 text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {availableVoices.map((voice) => (
                <SelectItem key={voice.name} value={voice.name} className="text-xs">
                  {voice.name} ({voice.lang})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="text-xs font-medium text-gray-700 mb-2 block">Speed: {ttsSettings.rate.toFixed(1)}x</label>
          <Slider
            value={[ttsSettings.rate]}
            onValueChange={([value]) => setTtsSettings((prev) => ({ ...prev, rate: value }))}
            min={0.5}
            max={2}
            step={0.1}
            className="w-full"
          />
        </div>

        <div>
          <label className="text-xs font-medium text-gray-700 mb-2 block">Pitch: {ttsSettings.pitch.toFixed(1)}</label>
          <Slider
            value={[ttsSettings.pitch]}
            onValueChange={([value]) => setTtsSettings((prev) => ({ ...prev, pitch: value }))}
            min={0.5}
            max={2}
            step={0.1}
            className="w-full"
          />
        </div>

        <div>
          <label className="text-xs font-medium text-gray-700 mb-2 block">
            Volume: {Math.round(ttsSettings.volume * 100)}%
          </label>
          <Slider
            value={[ttsSettings.volume]}
            onValueChange={([value]) => setTtsSettings((prev) => ({ ...prev, volume: value }))}
            min={0}
            max={1}
            step={0.1}
            className="w-full"
          />
        </div>
      </CardContent>
    </Card>
  )

  const generateSummary = async () => {
    setLoading((prev) => ({ ...prev, summary: true }))
    try {
      const response = await fetch("/api/video/summarize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          videoTitle,
          subjectContext,
        }),
      })
      const data = await response.json()
      if (data.success) {
        setSummary(data.summary)
      } else {
        setSummary("Failed to generate summary. Please try again.")
      }
    } catch (error) {
      setSummary("Error generating summary. Please check your connection.")
    } finally {
      setLoading((prev) => ({ ...prev, summary: false }))
    }
  }

  const generateTranslation = async () => {
    if (!summary) {
      alert("Please generate a summary first!")
      return
    }
    setLoading((prev) => ({ ...prev, translation: true }))
    try {
      const response = await fetch("/api/video/translate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: summary,
          targetLanguage,
          context: `${subjectContext} - ${videoTitle}`,
        }),
      })
      const data = await response.json()
      if (data.success) {
        setTranslation(data.translation)
      } else {
        setTranslation("Failed to generate translation. Please try again.")
      }
    } catch (error) {
      setTranslation("Error generating translation. Please check your connection.")
    } finally {
      setLoading((prev) => ({ ...prev, translation: false }))
    }
  }

  const generateQnA = async () => {
    if (!summary) {
      alert("Please generate a summary first!")
      return
    }
    setLoading((prev) => ({ ...prev, qna: true }))
    try {
      const response = await fetch("/api/video/qna", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          summary,
          videoTitle,
          subjectContext,
        }),
      })
      const data = await response.json()
      if (data.success) {
        setQna(data.qna)
      } else {
        setQna("Failed to generate Q&A. Please try again.")
      }
    } catch (error) {
      setQna("Error generating Q&A. Please check your connection.")
    } finally {
      setLoading((prev) => ({ ...prev, qna: false }))
    }
  }

  const downloadContent = (content: string, filename: string) => {
    const blob = new Blob([content], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `${filename}.txt`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  return (
    <div className="space-y-4">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="summary" className="text-xs">
            <FileText className="h-3 w-3 mr-1" />
            Summary
          </TabsTrigger>
          <TabsTrigger value="translation" className="text-xs">
            <Languages className="h-3 w-3 mr-1" />
            Translation
          </TabsTrigger>
          <TabsTrigger value="qna" className="text-xs">
            <MessageSquare className="h-3 w-3 mr-1" />
            Q&A
          </TabsTrigger>
        </TabsList>

        <TabsContent value="summary" className="space-y-4">
          <div className="flex items-center gap-2">
            <Button onClick={generateSummary} disabled={loading.summary} size="sm" className="flex-1">
              {loading.summary ? (
                <Loader2 className="h-3 w-3 mr-1 animate-spin" />
              ) : (
                <FileText className="h-3 w-3 mr-1" />
              )}
              Generate Summary
            </Button>
            {summary && (
              <Button variant="outline" size="sm" onClick={() => downloadContent(summary, `${videoTitle}-summary`)}>
                <Download className="h-3 w-3" />
              </Button>
            )}
          </div>

          {summary && (
            <div className="space-y-3">
              <TTSControls text={summary} label="🎧 Listen to Summary" />
              {showTTSSettings && <TTSSettingsPanel />}
              <div className="bg-gray-50 p-4 rounded-lg text-sm leading-relaxed whitespace-pre-wrap max-h-60 overflow-y-auto border">
                {summary}
              </div>
            </div>
          )}
        </TabsContent>

        <TabsContent value="translation" className="space-y-4">
          <div className="flex items-center gap-2">
            <Select value={targetLanguage} onValueChange={setTargetLanguage}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ne">🇳🇵 नेपाली</SelectItem>
                <SelectItem value="hi">🇮🇳 हिंदी</SelectItem>
                <SelectItem value="es">🇪🇸 Español</SelectItem>
                <SelectItem value="fr">🇫🇷 Français</SelectItem>
                <SelectItem value="de">🇩🇪 Deutsch</SelectItem>
                <SelectItem value="ja">🇯🇵 日本語</SelectItem>
                <SelectItem value="ko">🇰🇷 한국어</SelectItem>
                <SelectItem value="zh">🇨🇳 中文</SelectItem>
              </SelectContent>
            </Select>
            <Button
              onClick={generateTranslation}
              disabled={loading.translation || !summary}
              size="sm"
              className="flex-1"
            >
              {loading.translation ? (
                <Loader2 className="h-3 w-3 mr-1 animate-spin" />
              ) : (
                <Languages className="h-3 w-3 mr-1" />
              )}
              Translate Summary
            </Button>
            {translation && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => downloadContent(translation, `${videoTitle}-translation-${targetLanguage}`)}
              >
                <Download className="h-3 w-3" />
              </Button>
            )}
          </div>

          {!summary && (
            <Alert>
              <AlertDescription>Generate a summary first to enable translation.</AlertDescription>
            </Alert>
          )}

          {translation && (
            <div className="space-y-3">
              <TTSControls text={translation} label="🎧 Listen to Translation" />
              {showTTSSettings && <TTSSettingsPanel />}
              <div className="bg-gray-50 p-4 rounded-lg text-sm leading-relaxed whitespace-pre-wrap max-h-60 overflow-y-auto border">
                {translation}
              </div>
            </div>
          )}
        </TabsContent>

        <TabsContent value="qna" className="space-y-4">
          <div className="flex items-center gap-2">
            <Button onClick={generateQnA} disabled={loading.qna || !summary} size="sm" className="flex-1">
              {loading.qna ? (
                <Loader2 className="h-3 w-3 mr-1 animate-spin" />
              ) : (
                <MessageSquare className="h-3 w-3 mr-1" />
              )}
              Generate Q&A
            </Button>
            {qna && (
              <Button variant="outline" size="sm" onClick={() => downloadContent(qna, `${videoTitle}-qna`)}>
                <Download className="h-3 w-3" />
              </Button>
            )}
          </div>

          {!summary && (
            <Alert>
              <AlertDescription>Generate a summary first to enable Q&A generation.</AlertDescription>
            </Alert>
          )}

          {qna && (
            <div className="space-y-3">
              <TTSControls text={qna} label="🎧 Listen to Q&A" />
              {showTTSSettings && <TTSSettingsPanel />}
              <div className="bg-gray-50 p-4 rounded-lg text-sm leading-relaxed whitespace-pre-wrap max-h-60 overflow-y-auto border">
                {qna}
              </div>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
