"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookOpen, ArrowLeft, Users, Clock, Star, Crown } from "lucide-react";
import Link from "next/link";
import type { Course } from "@/types/course";
import WidthWrapper from "@/components/WidthWrapper";
import { API_CONFIG } from "@/lib/config";
import { Badge } from "@/components/ui/badge";

export default function CoursesPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(`${API_CONFIG.BASE_URL}/courses`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();

        if (data.success) {
          setCourses(data.data);
        } else {
          throw new Error(data.message || "Failed to fetch courses");
        }
      } catch (error) {
        console.error("Error fetching courses:", error);
        setError(
          error instanceof Error
            ? error.message
            : "An error occurred while fetching courses"
        );
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, []);

  const getCourseDuration = (course: Course) => {
    // Use the virtual field from the backend or calculate manually
    if (course.totalDuration) {
      return `${course.totalDuration} min`;
    }

    const totalDuration = course.topics.reduce((total, topic) => {
      return (
        total +
        topic.subTopics.reduce((topicTotal, subTopic) => {
          return topicTotal + (subTopic.duration || 15);
        }, 0)
      );
    }, 0);

    return `${totalDuration} min`;
  };

  const getTotalLessons = (course: Course) => {
    // Use the virtual field from the backend or calculate manually
    if (course.totalLessons) {
      return course.totalLessons;
    }

    return course.topics.reduce((total, topic) => {
      return total + topic.subTopics.length;
    }, 0);
  };

  const getPremiumLessonsCount = (course: Course) => {
    // Use the virtual field from the backend or calculate manually
    if (course.premiumLessons !== undefined) {
      return course.premiumLessons;
    }

    return course.topics.reduce((total, topic) => {
      return (
        total +
        topic.subTopics.filter((subTopic) => subTopic.tier === "premium").length
      );
    }, 0);
  };

  const getCourseRating = (course: Course) => {
    return course.rating && course.rating > 0
      ? course.rating.toFixed(1)
      : "4.5"; // Default rating if none set
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-10">
        <WidthWrapper>
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading courses...</p>
          </div>
        </WidthWrapper>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 py-10">
        <WidthWrapper>
          <div className="flex items-start flex-col gap-4 mb-8">
            <Link href="/">
              <Button variant="outline" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Home
              </Button>
            </Link>
          </div>
          <div className="text-center py-12">
            <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md mx-auto">
              <h3 className="text-lg font-semibold text-red-800 mb-2">
                Error Loading Courses
              </h3>
              <p className="text-red-600 mb-4">{error}</p>
              <Button
                onClick={() => window.location.reload()}
                variant="outline"
                className="border-red-300 text-red-700 hover:bg-red-50"
              >
                Try Again
              </Button>
            </div>
          </div>
        </WidthWrapper>
      </div>
    );
  }

  return (
    <div className="min-h-screen  py-10">
      <WidthWrapper>
        <div className="flex items-start flex-col gap-4 mb-8">
          <Link href="/">
            <Button variant="outline" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Home
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Course Catalog</h1>
            <p className="text-gray-600">
              Explore our comprehensive collection of courses
            </p>
          </div>
        </div>
        {courses.length === 0 ? (
          <div className="text-center py-12">
            <BookOpen className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              No Courses Available
            </h3>
            <p className="text-gray-600">
              There are no published courses at the moment. Check back later!
            </p>
          </div>
        ) : (
          <>
            {/* <div className="mb-6 text-center">
              <p className="text-gray-600">
                <span className="font-semibold text-blue-600">
                  {courses.length}
                </span>{" "}
                course
                {courses.length !== 1 ? "s" : ""} available
              </p>
            </div> */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {courses.map((course) => (
                <Card
                  key={course._id}
                  className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
                >
                  <CardHeader>
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <BookOpen className="h-5 w-5 text-blue-600" />
                        <Badge
                          variant="outline"
                          className="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded-full"
                        >
                          {course.topics?.length || 0} Topics
                        </Badge>
                        {course.tier === "premium" && (
                          <Crown className="h-4 w-4 text-yellow-500" />
                        )}
                      </div>
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 text-yellow-500 fill-current" />
                        <span className="text-sm font-medium">
                          {getCourseRating(course)}
                        </span>
                      </div>
                    </div>
                    <CardTitle className="text-lg leading-tight">
                      {course.title}
                    </CardTitle>
                    <CardDescription className="line-clamp-3 text-sm">
                      {course.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3 mb-6">
                      <div className="flex items-center justify-between text-sm text-gray-600">
                        <div className="flex items-center gap-2">
                          <Users className="h-4 w-4" />
                          <span>{getTotalLessons(course)} lessons</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4" />
                          <span>{getCourseDuration(course)}</span>
                        </div>
                      </div>
                      {/* Course Level and Category */}
                      <div className="flex items-center justify-between text-sm">
                        <Badge
                          variant="outline"
                          className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs font-medium"
                        >
                          {course.level}
                        </Badge>
                        <Badge
                          variant="outline"
                          className="bg-purple-100 text-purple-700 px-2 py-1 rounded text-xs font-medium"
                        >
                          {course.category}
                        </Badge>
                      </div>
                      {/* Premium Content Info */}
                      {getPremiumLessonsCount(course) > 0 && (
                        <div className="flex items-center gap-1 text-xs text-yellow-600 bg-yellow-50 px-2 py-1 rounded">
                          <Crown className="h-3 w-3" />
                          <span>
                            {getPremiumLessonsCount(course)} premium lessons
                          </span>
                        </div>
                      )}
                      {/* Course Topics Preview */}
                      {course.topics && course.topics.length > 0 && (
                        <div className="space-y-1">
                          <p className="text-xs font-medium text-gray-700">
                            Course Topics:
                          </p>
                          <div className="flex flex-wrap gap-1">
                            {course.topics.slice(0, 3).map((topic) => (
                              <span
                                key={topic._id}
                                className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded"
                              >
                                {topic.title}
                              </span>
                            ))}
                            {course.topics.length > 3 && (
                              <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                                +{course.topics.length - 3} more
                              </span>
                            )}
                          </div>
                        </div>
                      )}
                      {/* Pricing Info */}
                      <div className="flex items-center justify-between pt-2 border-t">
                        <div className="text-sm">
                          {course.price && course.price > 0 ? (
                            <span className="font-semibold text-green-600">
                              ${course.price}
                            </span>
                          ) : (
                            <span className="font-semibold text-green-600">
                              Free
                            </span>
                          )}
                          {course.premiumPrice &&
                            course.premiumPrice > 0 &&
                            course.tier !== "premium" && (
                              <span className="text-xs text-gray-500 ml-1">
                                (Premium: NPR {course.premiumPrice})
                              </span>
                            )}
                        </div>
                        {course.enrollmentCount &&
                          course.enrollmentCount > 0 && (
                            <span className="text-xs text-gray-500">
                              {course.enrollmentCount} enrolled
                            </span>
                          )}
                      </div>
                    </div>
                    <Link href={`/courses/${course._id}`}>
                      <Button className="w-full">
                        {(course.price && course.price > 0) ||
                        course.tier === "premium"
                          ? "View Course"
                          : "Start Learning"}
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
          </>
        )}
      </WidthWrapper>
    </div>
  );
}
