"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Plus,
  BookOpen,
  Edit,
  Trash2,
  BarChart3,
  Eye,
  Crown,
} from "lucide-react";
import Link from "next/link";
import type { Course } from "@/types/course";
import { CourseForm } from "./components/course-form";
import { AdminStats } from "./components/admin-stats";
import { API_CONFIG } from "@/lib/config";

export default function AdminPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  const [showStats, setShowStats] = useState(false);
  const [filter, setFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchCourses();
  }, [filter, searchTerm]);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const queryParams = new URLSearchParams();
      if (filter !== "all") queryParams.append("category", filter);
      if (searchTerm) queryParams.append("search", searchTerm);
      const response = await fetch(
        `${API_CONFIG.BASE_URL}/courses?${queryParams}`,
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
        setCourses(data.data);
      } else {
        console.error("Error fetching courses:", data.message);
      }
    } catch (error) {
      console.error("Error fetching courses:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCourse = async (courseId: string) => {
    if (
      !confirm(
        "Are you sure you want to delete this course? This action cannot be undone."
      )
    )
      return;
    try {
      const response = await fetch(
        `${API_CONFIG.BASE_URL}/courses/${courseId}`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );
      const data = await response.json();
      if (data.success) {
        fetchCourses();
      } else {
        alert("Error deleting course: " + data.message);
      }
    } catch (error) {
      console.error("Error deleting course:", error);
      alert("Error deleting course. Please try again.");
    }
  };

  const handleEditCourse = (course: Course) => {
    setEditingCourse(course);
    setShowForm(true);
  };

  const handleFormClose = () => {
    setShowForm(false);
    setEditingCourse(null);
    fetchCourses();
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      Programming: "bg-blue-100 text-blue-800",
      "Web Development": "bg-green-100 text-green-800",
      "Data Science": "bg-purple-100 text-purple-800",
      "Mobile Development": "bg-orange-100 text-orange-800",
      DevOps: "bg-red-100 text-red-800",
      Design: "bg-pink-100 text-pink-800",
      Other: "bg-gray-100 text-gray-800",
    };
    return colors[category as keyof typeof colors] || colors.Other;
  };

  const getLevelColor = (level: string) => {
    const colors = {
      Beginner: "bg-green-100 text-green-800",
      Intermediate: "bg-yellow-100 text-yellow-800",
      Advanced: "bg-red-100 text-red-800",
    };
    return colors[level as keyof typeof colors] || colors.Beginner;
  };

  const getTierBadge = (tier?: string) => {
    if (tier === "premium") {
      return (
        <Badge className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white">
          <Crown className="h-3 w-3 mr-1" />
          Premium
        </Badge>
      );
    }
    return null;
  };

  if (showForm) {
    return <CourseForm course={editingCourse} onClose={handleFormClose} />;
  }

  if (showStats) {
    return <AdminStats onClose={() => setShowStats(false)} />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Admin Dashboard
              </h1>
              <p className="text-gray-600">Manage your courses and content</p>
            </div>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" onClick={() => setShowStats(true)}>
              <BarChart3 className="h-4 w-4 mr-2" />
              Statistics
            </Button>
            <Button onClick={() => setShowForm(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Create Course
            </Button>
          </div>
        </div>
        {/* Filters and Search */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <input
                  type="text"
                  placeholder="Search courses..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Categories</option>
                <option value="Programming">Programming</option>
                <option value="Web Development">Web Development</option>
                <option value="Data Science">Data Science</option>
                <option value="Mobile Development">Mobile Development</option>
                <option value="DevOps">DevOps</option>
                <option value="Design">Design</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </CardContent>
        </Card>
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading courses...</p>
          </div>
        ) : courses.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent>
              <BookOpen className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {searchTerm || filter !== "all"
                  ? "No courses found"
                  : "No courses yet"}
              </h3>
              <p className="text-gray-600 mb-6">
                {searchTerm || filter !== "all"
                  ? "Try adjusting your search or filter criteria"
                  : "Create your first course to get started"}
              </p>
              {!searchTerm && filter === "all" && (
                <Button onClick={() => setShowForm(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Your First Course
                </Button>
              )}
            </CardContent>
          </Card>
        ) : (
          <>
            <div className="mb-4 text-sm text-gray-600">
              Showing {courses.length} course{courses.length !== 1 ? "s" : ""}
            </div>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {courses.map((course) => (
                <Card
                  key={course._id}
                  className="hover:shadow-lg transition-shadow"
                >
                  <CardHeader>
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex flex-wrap gap-2">
                        <Badge
                          className={getCategoryColor(
                            course.category || "Other"
                          )}
                        >
                          {course.category || "Other"}
                        </Badge>
                        <Badge
                          className={getLevelColor(course.level || "Beginner")}
                        >
                          {course.level || "Beginner"}
                        </Badge>
                        {getTierBadge(course.tier)}
                      </div>
                      <div className="flex items-center gap-1 text-sm text-gray-500">
                        <Eye className="h-4 w-4" />
                        <span>{course.enrollmentCount || 0}</span>
                      </div>
                    </div>
                    <CardTitle className="flex items-center gap-2">
                      <BookOpen className="h-5 w-5 text-blue-600" />
                      {course.title}
                    </CardTitle>
                    <CardDescription className="line-clamp-2">
                      {course.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3 mb-4">
                      <div className="flex items-center justify-between text-sm text-gray-600">
                        <span>
                          <strong>{course.topics?.length || 0}</strong> topics
                        </span>
                        <span>
                          <strong>
                            {course.topics?.reduce(
                              (acc, topic) =>
                                acc + (topic.subTopics?.length || 0),
                              0
                            ) || 0}
                          </strong>{" "}
                          lessons
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-sm text-gray-600">
                        <span className="font-medium">Base Price: </span>
                        <span>
                          {course.price === 0 ? "Free" : `Rs. ${course.price}`}
                        </span>
                      </div>
                      {course.premiumPrice !== undefined &&
                        course.premiumPrice > 0 && (
                          <div className="flex items-center justify-between text-sm text-gray-600">
                            <span className="font-medium">Premium Price: </span>
                            <span>Rs. {course.premiumPrice}</span>
                          </div>
                        )}
                      {course.tags && course.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          {course.tags.slice(0, 3).map((tag, index) => (
                            <span
                              key={index}
                              className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded"
                            >
                              {tag}
                            </span>
                          ))}
                          {course.tags.length > 3 && (
                            <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                              +{course.tags.length - 3}
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEditCourse(course)}
                        className="flex-1"
                      >
                        <Edit className="h-4 w-4 mr-1" />
                        Edit
                      </Button>
                      <Link href={`/courses/${course._id}`} className="flex-1">
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full bg-transparent"
                        >
                          <Eye className="h-4 w-4 mr-1" />
                          View
                        </Button>
                      </Link>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteCourse(course._id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
