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
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {courses.map((course) => (
                <Card
                  key={course._id}
                  className="hover:shadow-md transition-shadow duration-200 border border-gray-200"
                >
                  <CardHeader className="pb-1">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <BookOpen className="h-4 w-4 text-gray-600" />
                        <span className="text-sm text-gray-600">
                          {course.topics?.length || 0} Topics
                        </span>
                        {course.tier === "premium" && (
                          <Crown className="h-4 w-4 text-amber-500" />
                        )}
                      </div>
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 text-amber-400 fill-current" />
                        <span className="text-sm text-gray-700">
                          {getCourseRating(course)}
                        </span>
                      </div>
                    </div>

                    <CardTitle className="text-lg font-semibold text-gray-900 leading-tight mb-2">
                      {course.title}
                    </CardTitle>

                    <CardDescription className="text-gray-600 text-sm line-clamp-2">
                      {course.description}
                    </CardDescription>
                  </CardHeader>

                  <CardContent className="pt-0 flex flex-col h-full">
                    <div className="flex flex-col justify-between flex-grow space-y-2">
                      {/* Course Stats */}
                      <div className="space-y-3">
                        <div className="flex items-center justify-between text-sm text-gray-600">
                          <div className="flex items-center gap-1">
                            <Users className="h-4 w-4" />
                            <span>{getTotalLessons(course)} lessons</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            <span>{getCourseDuration(course)}</span>
                          </div>
                        </div>

                        {/* Level and Category */}
                        <div className="flex items-center justify-between gap-2">
                          <div className="flex flex-wrap gap-1">
                            <span className="px-2 py-1 bg-blue-50 text-blue-700 text-xs font-medium rounded">
                              {course.level}
                            </span>
                            <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs font-medium rounded">
                              {course.category}
                            </span>
                          </div>
                        </div>
                      </div>
                      {getPremiumLessonsCount(course) > 0 ? (
                        <div className="flex items-center gap-1 text-xs text-amber-700 bg-amber-50 px-2 py-1 rounded">
                          <Crown className="h-3 w-3" />
                          <span>
                            {getPremiumLessonsCount(course)} premium lessons
                          </span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1 text-xs text-green-700 bg-green-50  px-2 py-1 rounded">
                          <Crown className="h-3 w-3" />
                          <span>Free Course</span>
                        </div>
                      )}

                      {/* Spacer to push price + button to bottom */}
                      <div className="flex-grow" />

                      {/* Pricing and Enrollments */}
                      <div>
                        <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                          <div>
                            {course.price && course.price > 0 ? (
                              <span className="font-semibold text-gray-900">
                                ${course.price}
                              </span>
                            ) : (
                              <span className="font-semibold text-green-600">
                                Free
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

                        <Link
                          href={`/courses/${course._id}`}
                          className="block mt-3 cursor-pointer"
                        >
                          <Button className="w-full text-white cursor-pointer">
                            {(course.price && course.price > 0) ||
                            course.tier === "premium"
                              ? "View Course"
                              : "Start Learning"}
                          </Button>
                        </Link>
                      </div>
                    </div>
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
