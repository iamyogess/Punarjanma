"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BookOpen, Users, TrendingUp, BarChart3 } from "lucide-react"
import { API_CONFIG } from "@/lib/config"

interface CourseStats {
  totalCourses: number
  publishedCourses: number
  totalEnrollments: number
  categoryStats: Array<{ _id: string; count: number }>
  levelStats: Array<{ _id: string; count: number }>
}

interface AdminStatsProps {
  onClose: () => void
}

export function AdminStats({ onClose }: AdminStatsProps) {
  const [stats, setStats] = useState<CourseStats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}/courses/stats`)
      const data = await response.json()
      if (data.success) {
        setStats(data.data)
      } else {
        console.error("Error fetching stats:", data.message)
      }
    } catch (error) {
      console.error("Error fetching stats:", error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading statistics...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Course Statistics</h1>
            <p className="text-gray-600">Overview of your e-learning platform</p>
          </div>
        </div>
        {stats && (
          <div className="space-y-6">
            {/* Overview Cards */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Courses</CardTitle>
                  <BookOpen className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.totalCourses}</div>
                  <p className="text-xs text-muted-foreground">{stats.publishedCourses} published</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Published Courses</CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.publishedCourses}</div>
                  <p className="text-xs text-muted-foreground">
                    {stats.totalCourses > 0 ? Math.round((stats.publishedCourses / stats.totalCourses) * 100) : 0}% of
                    total
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Enrollments</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.totalEnrollments}</div>
                  <p className="text-xs text-muted-foreground">Across all courses</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Avg. Enrollment</CardTitle>
                  <BarChart3 className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {stats.totalCourses > 0 ? Math.round(stats.totalEnrollments / stats.totalCourses) : 0}
                  </div>
                  <p className="text-xs text-muted-foreground">Per course</p>
                </CardContent>
              </Card>
            </div>
            {/* Category and Level Distribution */}
            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Courses by Category</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {stats.categoryStats.map((category) => (
                      <div key={category._id} className="flex items-center justify-between">
                        <span className="text-sm font-medium">{category._id}</span>
                        <div className="flex items-center gap-2">
                          <div className="w-20 bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-blue-600 h-2 rounded-full"
                              style={{
                                width: `${(category.count / stats.totalCourses) * 100}%`,
                              }}
                            ></div>
                          </div>
                          <span className="text-sm text-gray-600 w-8 text-right">{category.count}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Courses by Level</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {stats.levelStats.map((level) => (
                      <div key={level._id} className="flex items-center justify-between">
                        <span className="text-sm font-medium">{level._id}</span>
                        <div className="flex items-center gap-2">
                          <div className="w-20 bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-green-600 h-2 rounded-full"
                              style={{
                                width: `${(level.count / stats.totalCourses) * 100}%`,
                              }}
                            ></div>
                          </div>
                          <span className="text-sm text-gray-600 w-8 text-right">{level.count}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
