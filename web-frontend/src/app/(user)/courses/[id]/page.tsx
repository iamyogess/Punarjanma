"use client";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  ArrowLeft,
  ChevronDown,
  ChevronRight,
  Video,
  BookOpen,
  CheckCircle,
  Circle,
  Lock,
  Crown,
} from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/contexts/auth-context";
import type { Course, SubTopic, Topic, UserProgress } from "@/types/course";
import WidthWrapper from "@/components/WidthWrapper";
import PremiumUpgradeSection from "@/components/premium-upgrade-section";
import { EnhancedVideoPlayer } from "@/components/enhanced-video-player";

const CourseIdPage = () => {
  const params = useParams();
  const { id } = params;
  const { user, isPremiumUser, isEnrolled, refreshUser } = useAuth();
  const [course, setCourse] = useState<Course | null>(null);
  const [userProgress, setUserProgress] = useState<UserProgress | null>(null);
  const [loading, setLoading] = useState(true);
  const [enrolling, setEnrolling] = useState(false);
  const [openTopics, setOpenTopics] = useState<Set<string>>(new Set());
  const [selectedSubTopic, setSelectedSubTopic] = useState<SubTopic | null>(
    null
  );
  const [currentTopicTitle, setCurrentTopicTitle] = useState<string>("");

  useEffect(() => {
    if (id) {
      fetchCourse();
      if (user) {
        fetchUserProgress();
      }
    }
  }, [id, user]);

  const fetchCourse = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/courses/${id}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        }
      );
      const data = await response.json();
      if (data.success) {
        setCourse(data.data);
        if (data.data.topics.length > 0) {
          const firstTopic = data.data.topics[0];
          setOpenTopics(new Set([firstTopic._id]));
          const firstAccessibleSubTopic = firstTopic.subTopics.find(
            (st: SubTopic) =>
              st.tier === "free" || (user && isPremiumUser(data.data._id))
          );
          if (firstAccessibleSubTopic) {
            setSelectedSubTopic(firstAccessibleSubTopic);
            setCurrentTopicTitle(firstTopic.title);
          }
        }
      }
    } catch (error) {
      console.error("Error fetching course:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserProgress = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/courses/${id}/progress`,
        {
          credentials: "include",
        }
      );
      const data = await response.json();
      if (data.success) {
        setUserProgress(data.data);
      } else {
        setUserProgress(null);
        console.warn(
          "Could not fetch user progress:",
          data.message || "Unknown error"
        );
      }
    } catch (error) {
      console.error("Error fetching progress:", error);
      setUserProgress(null);
    }
  };

  const enrollInCourse = async () => {
    if (!user) {
      alert("Please log in to enroll in courses.");
      return;
    }
    setEnrolling(true);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/courses/${id}/enroll`,
        {
          method: "POST",
          credentials: "include",
        }
      );
      const data = await response.json();
      if (data.success) {
        alert("Successfully enrolled in the course!");
        await refreshUser();
        await fetchUserProgress();
      } else {
        alert(`Failed to enroll: ${data.message || "Unknown error"}`);
      }
    } catch (error) {
      console.error("Error enrolling:", error);
      alert("An error occurred during enrollment. Please try again.");
    } finally {
      setEnrolling(false);
    }
  };

  const toggleTopic = (topicId: string) => {
    setOpenTopics((prevOpenTopics) => {
      const newOpenTopics = new Set(prevOpenTopics);
      if (newOpenTopics.has(topicId)) {
        newOpenTopics.delete(topicId);
      } else {
        newOpenTopics.add(topicId);
      }
      return newOpenTopics;
    });
  };

  const handleSubTopicClick = (subTopic: SubTopic, topic: Topic) => {
    if (subTopic.tier === "premium" && !isPremiumUser(course!._id)) {
      return;
    }
    setSelectedSubTopic(subTopic);
    setCurrentTopicTitle(topic.title);
  };

  const markAsCompleted = async (subTopicId: string) => {
    if (!user || !course) return;
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/courses/${course._id}/progress`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ subTopicId, completed: true }),
        }
      );
      if (response.ok) {
        await fetchUserProgress();
      }
    } catch (error) {
      console.error("Error updating progress:", error);
    }
  };

  const isSubTopicAccessible = (subTopic: SubTopic): boolean => {
    return subTopic.tier === "free" || (course && isPremiumUser(course._id));
  };

  const isSubTopicCompleted = (subTopicId: string): boolean => {
    return userProgress?.completedLessons.includes(subTopicId) || false;
  };

  const getProgressPercentage = (): number => {
    if (!course || !userProgress) return 0;
    const totalLessons = course.topics.reduce(
      (acc, topic) => acc + topic.subTopics.length,
      0
    );
    return totalLessons > 0
      ? (userProgress.completedLessons.length / totalLessons) * 100
      : 0;
  };

  const getPremiumLessonsCount = (): number => {
    if (!course) return 0;
    return course.topics.reduce(
      (acc, topic) =>
        acc + topic.subTopics.filter((st) => st.tier === "premium").length,
      0
    );
  };

  const getFreeLessonsCount = (): number => {
    if (!course) return 0;
    return course.topics.reduce(
      (acc, topic) =>
        acc + topic.subTopics.filter((st) => st.tier === "free").length,
      0
    );
  };

  const handlePaymentInitiated = () => {
    console.log("Payment initiated for course:", course?.title);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading course...</p>
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="text-center p-8">
          <CardContent>
            <BookOpen className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Course not found
            </h2>
            <p className="text-gray-600 mb-4">
              The course you&apos;re looking for doesn&apos;t exist.
            </p>
            <Link href="/courses">
              <Button>Back to Courses</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  const totalLessons = course.topics.reduce(
    (acc, topic) => acc + topic.subTopics.length,
    0
  );
  const freeLessons = getFreeLessonsCount();
  const premiumLessons = getPremiumLessonsCount();
  const userHasPremium = isPremiumUser(course._id);
  const userIsEnrolled = isEnrolled(course._id);

  return (
    <div className="min-h-screen  py-10">
      <WidthWrapper>
        <div className="flex flex-col items-start gap-4 mb-8">
          <Link href="/courses">
            <Button variant="outline" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Courses
            </Button>
          </Link>
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-3xl font-bold text-gray-900">
                {course.title}
              </h1>
              {course.tier === "premium" && (
                <Badge className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white">
                  <Crown className="h-3 w-3 mr-1" />
                  Premium
                </Badge>
              )}
            </div>
            <p className="text-gray-600 mt-1">{course.description}</p>
            <div className="flex items-center gap-4 mt-3">
              <Badge variant="secondary" className="flex items-center gap-1">
                <BookOpen className="h-3 w-3" />
                {course.topics.length} Topics
              </Badge>
              <Badge variant="secondary" className="flex items-center gap-1">
                <Video className="h-3 w-3" />
                {freeLessons} Free Lessons
              </Badge>
              {premiumLessons > 0 && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  <Crown className="h-3 w-3" />
                  {premiumLessons} Premium Lessons
                </Badge>
              )}
              <Badge variant="secondary" className="flex items-center gap-1">
                <Video className="h-3 w-3" />
                {totalLessons * 15} min
              </Badge>
            </div>
          </div>
        </div>

        {/* Enrollment and Premium Upgrade */}
        {user && (
          <div className="mb-8 space-y-4">
            {!userIsEnrolled && (
              <Alert>
                <AlertDescription>
                  <div className="flex items-center justify-between w-full">
                    <div className="flex items-center gap-x-2">
                      <BookOpen className="h-4 w-4" />
                      <span>
                        Enroll in this course to track your progress and access
                        content.
                      </span>
                    </div>
                    <Button
                      onClick={enrollInCourse}
                      disabled={enrolling}
                      size="sm"
                      className="cursor-pointer"
                    >
                      {enrolling ? "Enrolling..." : "Enroll Now"}
                    </Button>
                  </div>
                </AlertDescription>
              </Alert>
            )}
            {/* Premium Upgrade Section */}
            <PremiumUpgradeSection
              course={course}
              premiumLessonsCount={premiumLessons}
              userIsEnrolled={userIsEnrolled}
              userHasPremium={userHasPremium}
              onPaymentInitiated={handlePaymentInitiated}
            />
          </div>
        )}

        {/* Progress Bar */}
        {userIsEnrolled && userProgress && (
          <Card className="mb-8">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Course Progress</span>
                <span className="text-sm text-gray-600">
                  {userProgress.completedLessons.length} of {totalLessons}{" "}
                  lessons completed
                </span>
              </div>
              <Progress value={getProgressPercentage()} className="h-2" />
              <p className="text-xs text-gray-500 mt-1">
                {getProgressPercentage().toFixed(0)}% complete
              </p>
            </CardContent>
          </Card>
        )}

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Course Content */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5" />
                  Course Content
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {course.topics.map((topic) => (
                  <Collapsible
                    key={topic._id}
                    open={openTopics.has(topic._id)}
                    onOpenChange={() => toggleTopic(topic._id)}
                  >
                    <CollapsibleTrigger asChild>
                      <Button
                        variant="ghost"
                        className="w-full justify-between p-4 h-auto text-left hover:bg-gray-50"
                      >
                        <div className="flex items-center gap-3">
                          <span className="font-medium">{topic.title}</span>
                          <Badge variant="outline" className="text-xs">
                            {topic.subTopics.length} lessons
                          </Badge>
                        </div>
                        {openTopics.has(topic._id) ? (
                          <ChevronDown className="h-4 w-4" />
                        ) : (
                          <ChevronRight className="h-4 w-4" />
                        )}
                      </Button>
                    </CollapsibleTrigger>
                    <CollapsibleContent className="pl-4 space-y-1">
                      {topic.subTopics.map((subTopic) => {
                        const isAccessible = isSubTopicAccessible(subTopic);
                        const isCompleted = isSubTopicCompleted(subTopic._id);
                        return (
                          <div
                            key={subTopic._id}
                            className="flex items-center gap-2"
                          >
                            <Button
                              variant="ghost"
                              className={`flex-1 justify-start p-3 h-auto text-left ${
                                isAccessible
                                  ? "hover:bg-blue-50 cursor-pointer"
                                  : "opacity-60 cursor-not-allowed"
                              } ${
                                selectedSubTopic?._id === subTopic._id
                                  ? "bg-blue-50 border-l-4 border-l-blue-500"
                                  : ""
                              }`}
                              onClick={() =>
                                isAccessible &&
                                handleSubTopicClick(subTopic, topic)
                              }
                              disabled={!isAccessible}
                            >
                              <div className="flex items-center gap-3 flex-1">
                                {isAccessible ? (
                                  <Video className="h-4 w-4 text-blue-600 flex-shrink-0" />
                                ) : (
                                  <Lock className="h-4 w-4 text-gray-400 flex-shrink-0" />
                                )}
                                <div className="flex-1">
                                  <div className="flex items-center gap-2">
                                    <span className="block font-medium">
                                      {subTopic.title}
                                    </span>
                                    {subTopic.tier === "premium" && (
                                      <Crown className="h-3 w-3 text-yellow-500" />
                                    )}
                                  </div>
                                  <span className="text-xs text-gray-500">
                                    {subTopic.duration || 15} min
                                  </span>
                                </div>
                              </div>
                            </Button>
                            {userIsEnrolled && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() =>
                                  isAccessible && markAsCompleted(subTopic._id)
                                }
                                className="p-1"
                                disabled={!isAccessible}
                              >
                                {isCompleted ? (
                                  <CheckCircle className="h-5 w-5 text-green-600" />
                                ) : (
                                  <Circle className="h-5 w-5 text-gray-400" />
                                )}
                              </Button>
                            )}
                          </div>
                        );
                      })}
                    </CollapsibleContent>
                  </Collapsible>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Enhanced Video Player */}
          <div className="lg:col-span-1">
            <EnhancedVideoPlayer
              selectedSubTopic={selectedSubTopic}
              currentTopicTitle={currentTopicTitle}
              userIsEnrolled={userIsEnrolled}
              isSubTopicCompleted={isSubTopicCompleted}
              markAsCompleted={markAsCompleted}
            />
          </div>
        </div>
      </WidthWrapper>
    </div>
  );
};

export default CourseIdPage;
