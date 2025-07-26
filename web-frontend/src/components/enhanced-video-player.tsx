"use client"
import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Video, Clock, CheckCircle, Circle, Crown, FileText, Sparkles } from "lucide-react"
import VideoFeatures from "./video-features"
import type { SubTopic } from "@/types/course"

interface EnhancedVideoPlayerProps {
  selectedSubTopic: SubTopic | null
  currentTopicTitle: string
  userIsEnrolled: boolean
  isSubTopicCompleted: (id: string) => boolean
  markAsCompleted: (id: string) => void
  courseTitle?: string
}

// Utility function to convert YouTube URL to embeddable format
const getYouTubeEmbedUrl = (url: string): string | null => {
  if (!url) return null
  try {
    const youtuBeMatch = url.match(/youtu\.be\/([a-zA-Z0-9_-]+)/)
    if (youtuBeMatch) {
      return `https://www.youtube.com/embed/${youtuBeMatch[1]}`
    }
    const youtubeMatch = url.match(/youtube\.com\/watch\?v=([a-zA-Z0-9_-]+)/)
    if (youtubeMatch) {
      return `https://www.youtube.com/embed/${youtubeMatch[1]}`
    }
    if (url.includes("youtube.com/embed/")) {
      return url
    }
    return null
  } catch (error) {
    console.error("Error parsing YouTube URL:", error)
    return null
  }
}

export function EnhancedVideoPlayer({
  selectedSubTopic,
  currentTopicTitle,
  userIsEnrolled,
  isSubTopicCompleted,
  markAsCompleted,
  courseTitle,
}: EnhancedVideoPlayerProps) {
  const [activeTab, setActiveTab] = useState("player")

  return (
    <Card className="sticky top-8">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Video className="h-5 w-5" />
          Enhanced Video Player
        </CardTitle>
      </CardHeader>
      <CardContent>
        {selectedSubTopic ? (
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="player" className="flex items-center gap-2">
                <Video className="h-4 w-4" />
                Player
              </TabsTrigger>
              <TabsTrigger value="features" className="flex items-center gap-2">
                <Sparkles className="h-4 w-4" />
                AI Features
              </TabsTrigger>
            </TabsList>
            <TabsContent value="player" className="space-y-4">
              {/* YouTube Video Player */}
              <div className="aspect-video bg-black rounded-lg overflow-hidden">
                {selectedSubTopic.videoUrl && getYouTubeEmbedUrl(selectedSubTopic.videoUrl) ? (
                  <iframe
                    src={getYouTubeEmbedUrl(selectedSubTopic.videoUrl)!}
                    title={selectedSubTopic.title}
                    className="w-full h-full"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center relative">
                    <div className="absolute inset-0 bg-black/10"></div>
                    <div className="text-center z-10">
                      <div className="bg-white/90 rounded-full p-4 mb-4 mx-auto w-fit">
                        <Video className="h-12 w-12 text-blue-600" />
                      </div>
                      <p className="text-gray-700 font-medium">No Video Available</p>
                      <p className="text-sm text-gray-500">Video content coming soon</p>
                    </div>
                  </div>
                )}
              </div>
              <div className="space-y-3">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant="outline" className="text-xs">
                      {currentTopicTitle}
                    </Badge>
                    {selectedSubTopic.tier === "premium" && (
                      <Badge className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-xs">
                        <Crown className="h-3 w-3 mr-1" />
                        Premium
                      </Badge>
                    )}
                  </div>
                  <h3 className="font-semibold text-lg leading-tight">{selectedSubTopic.title}</h3>
                </div>
                <p className="text-gray-600 text-sm leading-relaxed">{selectedSubTopic.videoContent}</p>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <Clock className="h-4 w-4" />
                  <span>Duration: {selectedSubTopic.duration || 15} minutes</span>
                </div>
                <div className="space-y-2">
                  {userIsEnrolled && (
                    <Button
                      variant="outline"
                      className="w-full bg-transparent"
                      onClick={() => markAsCompleted(selectedSubTopic._id)}
                    >
                      {isSubTopicCompleted(selectedSubTopic._id) ? (
                        <>
                          <CheckCircle className="h-4 w-4 mr-2 text-green-600" />
                          Completed
                        </>
                      ) : (
                        <>
                          <Circle className="h-4 w-4 mr-2" />
                          Mark as Complete
                        </>
                      )}
                    </Button>
                  )}
                </div>
              </div>
            </TabsContent>
            <TabsContent value="features" className="space-y-4">
              {selectedSubTopic?.videoUrl ? (
                <VideoFeatures
                  videoUrl={selectedSubTopic.videoUrl}
                  videoTitle={selectedSubTopic.title}
                  subjectContext={courseTitle || currentTopicTitle}
                />
              ) : (
                <div className="text-center py-8">
                  <div className="bg-gray-100 rounded-full p-6 mx-auto w-fit mb-4">
                    <FileText className="h-12 w-12 text-gray-400" />
                  </div>
                  <p className="text-gray-600 font-medium mb-2">No video available</p>
                  <p className="text-sm text-gray-500">AI features require a valid video URL</p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        ) : (
          <div className="text-center py-12">
            <div className="bg-gray-100 rounded-full p-6 mx-auto w-fit mb-4">
              <Video className="h-12 w-12 text-gray-400" />
            </div>
            <p className="text-gray-600 font-medium mb-2">Select a lesson to start</p>
            <p className="text-sm text-gray-500">Choose any lesson from the course content to begin learning</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
