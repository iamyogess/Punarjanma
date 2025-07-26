"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import {
  Plus,
  Trash2,
  Save,
  Clock,
  DollarSign,
  Crown,
  Info,
} from "lucide-react";
import type { Course, Topic, SubTopic } from "@/types/course";
import { API_CONFIG, COURSE_TIERS } from "@/lib/config";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface CourseFormProps {
  course?: Course | null;
  onClose: () => void;
}

// Helper function to generate temporary IDs for React state management
const generateTempId = () =>
  `temp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

export function CourseForm({ course, onClose }: CourseFormProps) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "Programming",
    level: "Beginner",
    price: 0,
    premiumPrice: 1000,
    instructor: "Admin",
    tags: [] as string[],
    tier: COURSE_TIERS.FREE,
  });
  const [topics, setTopics] = useState<Topic[]>([]);
  const [loading, setLoading] = useState(false);
  const [tagInput, setTagInput] = useState("");

  useEffect(() => {
    if (course) {
      setFormData({
        title: course.title,
        description: course.description,
        category: course.category || "Programming",
        level: course.level || "Beginner",
        price: course.price || 0,
        premiumPrice: course.premiumPrice || 1000,
        instructor: course.instructor || "Admin",
        tags: course.tags || [],
        tier: course.tier || COURSE_TIERS.FREE,
      });
      setTopics(course.topics || []);
    }
  }, [course]);

  const addTopic = () => {
    const newTopic: Topic = {
      _id: generateTempId(),
      title: "",
      description: "",
      subTopics: [],
      order: topics.length,
    };
    setTopics([...topics, newTopic]);
  };

  const updateTopic = (
    topicId: string,
    field: keyof Topic,
    value: string | number
  ) => {
    setTopics(
      topics.map((topic) =>
        topic._id === topicId ? { ...topic, [field]: value } : topic
      )
    );
  };

  const deleteTopic = (topicId: string) => {
    setTopics(topics.filter((topic) => topic._id !== topicId));
  };

  const addSubTopic = (topicId: string) => {
    const newSubTopic: SubTopic = {
      _id: generateTempId(),
      title: "",
      videoContent: "",
      videoUrl: "",
      duration: 15,
      order: 0,
      tier: COURSE_TIERS.FREE,
    };
    setTopics(
      topics.map((topic) => {
        if (topic._id === topicId) {
          const updatedSubTopic = {
            ...newSubTopic,
            order: topic.subTopics.length,
          };
          return { ...topic, subTopics: [...topic.subTopics, updatedSubTopic] };
        }
        return topic;
      })
    );
  };

  const updateSubTopic = (
    topicId: string,
    subTopicId: string,
    field: keyof SubTopic,
    value: string | number | boolean
  ) => {
    setTopics(
      topics.map((topic) =>
        topic._id === topicId
          ? {
              ...topic,
              subTopics: topic.subTopics.map((subTopic) =>
                subTopic._id === subTopicId
                  ? { ...subTopic, [field]: value }
                  : subTopic
              ),
            }
          : topic
      )
    );
  };

  const deleteSubTopic = (topicId: string, subTopicId: string) => {
    setTopics(
      topics.map((topic) =>
        topic._id === topicId
          ? {
              ...topic,
              subTopics: topic.subTopics.filter(
                (subTopic) => subTopic._id !== subTopicId
              ),
            }
          : topic
      )
    );
  };

  const addTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData((prev) => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()],
      }));
      setTagInput("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((tag) => tag !== tagToRemove),
    }));
  };

  // Replace your existing cleanDataForServer function with this:
  const cleanDataForServer = (data: any): any => {
    if (Array.isArray(data)) {
      return data.map(cleanDataForServer);
    } else if (data && typeof data === "object") {
      const cleaned = {};
      // Remove ALL _id fields when creating a new course
      for (const [key, value] of Object.entries(data)) {
        if (key !== "_id") {
          cleaned[key] = cleanDataForServer(value);
        }
      }
      return cleaned;
    }
    return data;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const courseData = {
        ...formData,
        topics: topics.map((topic, index) => ({
          ...topic,
          order: index,
          subTopics: topic.subTopics.map((subTopic, subIndex) => ({
            ...subTopic,
            order: subIndex,
          })),
        })),
      };

      // Clean the data to remove temporary IDs
      const cleanedCourseData = cleanDataForServer(courseData);

      const url = course
        ? `${API_CONFIG.BASE_URL}/courses/${course._id}`
        : `${API_CONFIG.BASE_URL}/courses`;
      const method = course ? "PUT" : "POST";

      console.log(
        "Sending course data:",
        JSON.stringify(cleanedCourseData, null, 2)
      ); // Debug log

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(cleanedCourseData),
        credentials: "include",
      });

      const data = await response.json();
      if (data.success) {
        onClose();
      } else {
        console.error("Server error:", data);
        alert("Error saving course: " + (data.message || "Unknown error"));
      }
    } catch (error) {
      console.error("Error saving course:", error);
      alert("Error saving course. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const getTotalDuration = () => {
    return topics.reduce((total, topic) => {
      return (
        total +
        topic.subTopics.reduce((topicTotal, subTopic) => {
          return topicTotal + (subTopic.duration || 15);
        }, 0)
      );
    }, 0);
  };

  const getTotalLessons = () => {
    return topics.reduce((total, topic) => total + topic.subTopics.length, 0);
  };

  const getPremiumLessonsCount = () => {
    return topics.reduce(
      (total, topic) =>
        total +
        topic.subTopics.filter((st) => st.tier === COURSE_TIERS.PREMIUM).length,
      0
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center gap-4 mb-8">
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-gray-900">
              {course ? "Edit Course" : "Create New Course"}
            </h1>
            <p className="text-gray-600">
              Build your course structure with topics and lessons
            </p>
          </div>
          <div className="flex items-center gap-4 text-sm text-gray-600">
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              <span>{getTotalDuration()} min</span>
            </div>
            <div className="flex items-center gap-1">
              <span>{getTotalLessons()} lessons</span>
            </div>
            {getPremiumLessonsCount() > 0 && (
              <div className="flex items-center gap-1">
                <Crown className="h-4 w-4 text-yellow-500" />
                <span>{getPremiumLessonsCount()} premium</span>
              </div>
            )}
          </div>
        </div>
        <form onSubmit={handleSubmit} className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>Course Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <Label htmlFor="title">Course Title *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        title: e.target.value,
                      }))
                    }
                    placeholder="e.g., Python for Beginners"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="instructor">Instructor</Label>
                  <Input
                    id="instructor"
                    value={formData.instructor}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        instructor: e.target.value,
                      }))
                    }
                    placeholder="Instructor name"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="description">Course Description *</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      description: e.target.value,
                    }))
                  }
                  placeholder="Describe what students will learn in this course..."
                  rows={4}
                  required
                />
              </div>
              <div className="grid gap-4 md:grid-cols-3">
                <div>
                  <Label htmlFor="category">Category</Label>
                  <select
                    id="category"
                    value={formData.category}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        category: e.target.value,
                      }))
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="Programming">Programming</option>
                    <option value="Web Development">Web Development</option>
                    <option value="Data Science">Data Science</option>
                    <option value="Mobile Development">
                      Mobile Development
                    </option>
                    <option value="DevOps">DevOps</option>
                    <option value="Design">Design</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div>
                  <Label htmlFor="level">Level</Label>
                  <select
                    id="level"
                    value={formData.level}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        level: e.target.value,
                      }))
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                  </select>
                </div>
                <div>
                  <Label htmlFor="price">Base Price ($)</Label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      id="price"
                      type="number"
                      min="0"
                      step="0.01"
                      value={formData.price}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          price: Number.parseFloat(e.target.value) || 0,
                        }))
                      }
                      className="pl-10"
                      placeholder="0.00"
                    />
                  </div>
                </div>
              </div>

              {/* Freemium Model Settings */}
              <div className="border p-4 rounded-lg bg-gray-50 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Crown className="h-5 w-5 text-yellow-500" />
                    <Label htmlFor="tier" className="text-lg font-medium">
                      Freemium Settings
                    </Label>
                  </div>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button variant="ghost" size="sm" className="p-1">
                          <Info className="h-4 w-4 text-gray-500" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="max-w-xs">
                          Configure premium pricing and content access.
                          Individual lessons can be marked as premium.
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <Label htmlFor="tier">Course Tier</Label>
                    <select
                      id="tier"
                      value={formData.tier}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          tier: e.target.value as "free" | "premium",
                        }))
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value={COURSE_TIERS.FREE}>
                        Free (with premium lessons)
                      </option>
                      <option value={COURSE_TIERS.PREMIUM}>
                        Premium (entire course)
                      </option>
                    </select>
                  </div>
                  <div>
                    <Label htmlFor="premiumPrice">Premium Price (NPR)</Label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        id="premiumPrice"
                        type="number"
                        min="0"
                        step="1"
                        value={formData.premiumPrice}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            premiumPrice:
                              Number.parseInt(e.target.value) || 1000,
                          }))
                        }
                        className="pl-10"
                        placeholder="1000"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <Label htmlFor="tags">Tags</Label>
                <div className="flex gap-2 mb-2">
                  <Input
                    id="tags"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    placeholder="Add a tag..."
                    onKeyPress={(e) =>
                      e.key === "Enter" && (e.preventDefault(), addTag())
                    }
                  />
                  <Button type="button" onClick={addTag} size="sm">
                    Add
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.tags.map((tag, index) => (
                    <Badge
                      key={index}
                      variant="secondary"
                      className="flex items-center gap-1"
                    >
                      {tag}
                      <button
                        type="button"
                        onClick={() => removeTag(tag)}
                        className="ml-1 hover:text-red-600"
                      >
                        ×
                      </button>
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Course Content</CardTitle>
              <Button type="button" onClick={addTopic} size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Add Topic
              </Button>
            </CardHeader>
            <CardContent className="space-y-6">
              {topics.map((topic, topicIndex) => (
                <Card key={topic._id} className="border-l-4 border-l-blue-500">
                  <CardHeader className="flex flex-row items-center justify-between">
                    <div className="flex-1 space-y-2">
                      <Input
                        value={topic.title}
                        onChange={(e) =>
                          updateTopic(topic._id, "title", e.target.value)
                        }
                        placeholder={`Topic ${
                          topicIndex + 1
                        } title (e.g., Introduction)`}
                        className="font-medium"
                        required
                      />
                      <Input
                        value={topic.description || ""}
                        onChange={(e) =>
                          updateTopic(topic._id, "description", e.target.value)
                        }
                        placeholder="Topic description (optional)"
                        className="text-sm"
                      />
                    </div>
                    <div className="flex gap-2 ml-4">
                      <Button
                        type="button"
                        onClick={() => addSubTopic(topic._id)}
                        size="sm"
                        variant="outline"
                      >
                        <Plus className="h-4 w-4 mr-1" />
                        Lesson
                      </Button>
                      <Button
                        type="button"
                        onClick={() => deleteTopic(topic._id)}
                        size="sm"
                        variant="outline"
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {topic.subTopics.map((subTopic, subTopicIndex) => (
                      <div
                        key={subTopic._id}
                        className={`flex gap-2 items-start p-4 rounded-lg border ${
                          subTopic.tier === COURSE_TIERS.PREMIUM
                            ? "bg-yellow-50 border-yellow-200"
                            : "bg-gray-50"
                        }`}
                      >
                        <div className="flex-1 space-y-3">
                          <div className="grid gap-2 md:grid-cols-2">
                            <Input
                              value={subTopic.title}
                              onChange={(e) =>
                                updateSubTopic(
                                  topic._id,
                                  subTopic._id,
                                  "title",
                                  e.target.value
                                )
                              }
                              placeholder={`Lesson ${subTopicIndex + 1} title`}
                              required
                            />
                            <div className="flex items-center gap-2">
                              <Clock className="h-4 w-4 text-gray-400" />
                              <Input
                                type="number"
                                min="1"
                                value={subTopic.duration || 15}
                                onChange={(e) =>
                                  updateSubTopic(
                                    topic._id,
                                    subTopic._id,
                                    "duration",
                                    Number.parseInt(e.target.value) || 15
                                  )
                                }
                                placeholder="Duration (min)"
                                className="w-24"
                              />
                              <span className="text-sm text-gray-500">min</span>
                            </div>
                          </div>
                          <Textarea
                            value={subTopic.videoContent}
                            onChange={(e) =>
                              updateSubTopic(
                                topic._id,
                                subTopic._id,
                                "videoContent",
                                e.target.value
                              )
                            }
                            placeholder="Lesson description or content notes..."
                            rows={2}
                            required
                          />
                          <Input
                            value={subTopic.videoUrl || ""}
                            onChange={(e) =>
                              updateSubTopic(
                                topic._id,
                                subTopic._id,
                                "videoUrl",
                                e.target.value
                              )
                            }
                            placeholder="Video URL (optional)"
                            type="url"
                          />
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                              <Switch
                                id={`premium-${subTopic._id}`}
                                checked={subTopic.tier === COURSE_TIERS.PREMIUM}
                                onCheckedChange={(checked) =>
                                  updateSubTopic(
                                    topic._id,
                                    subTopic._id,
                                    "tier",
                                    checked
                                      ? COURSE_TIERS.PREMIUM
                                      : COURSE_TIERS.FREE
                                  )
                                }
                              />
                              <Label
                                htmlFor={`premium-${subTopic._id}`}
                                className="flex items-center gap-1"
                              >
                                <Crown
                                  className={`h-4 w-4 ${
                                    subTopic.tier === COURSE_TIERS.PREMIUM
                                      ? "text-yellow-500"
                                      : "text-gray-400"
                                  }`}
                                />
                                Premium Content
                              </Label>
                            </div>
                          </div>
                        </div>
                        <Button
                          type="button"
                          onClick={() =>
                            deleteSubTopic(topic._id, subTopic._id)
                          }
                          size="sm"
                          variant="outline"
                          className="text-red-600 hover:text-red-700 mt-2"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                    {topic.subTopics.length === 0 && (
                      <p className="text-gray-500 text-sm italic text-center py-4">
                        No lessons yet. Click Lesson to add your first lesson to
                        this topic.
                      </p>
                    )}
                  </CardContent>
                </Card>
              ))}
              {topics.length === 0 && (
                <div className="text-center py-12 border-2 border-dashed border-gray-300 rounded-lg">
                  <p className="text-gray-500 mb-4">
                    No topics yet. Start building your course structure.
                  </p>
                  <Button type="button" onClick={addTopic} variant="outline">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Your First Topic
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
          <div className="flex gap-4">
            <Button type="submit" disabled={loading} className="flex-1">
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Saving...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  {course ? "Update Course" : "Create Course"}
                </>
              )}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="px-8 bg-transparent"
            >
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
