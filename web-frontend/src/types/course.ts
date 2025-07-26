export interface SubTopic {
  _id: string;
  title: string;
  videoContent: string;
  videoUrl?: string;
  duration?: number;
  order?: number;
  tier?: "free" | "premium";
}

export interface Topic {
  _id: string;
  title: string;
  description?: string;
  subTopics: SubTopic[];
  order?: number;
}

export interface Course {
  _id: string;
  title: string;
  description: string;
  topics: Topic[];
  category?: string;
  level?: string;
  price?: number;
  premiumPrice?: number;
  instructor?: string;
  tags?: string[];
  createdAt?: string;
  updatedAt?: string;
  enrollmentCount?: number;
  rating?: number;
  isPublished?: boolean;
  thumbnail?: string;
  tier?: "free" | "premium";
  premiumLessons: string | number;
  totalLessons: number | string;
  totalDuration: number | string;
}

export interface UserProgress {
  courseId: string;
  completedLessons: string[];
  lastAccessedLesson?: string;
  progressPercentage: number;
  enrolledAt: string;
  isPremium: boolean;
}

export interface PaymentData {
  courseId: string;
  amount: number;
  productId: string;
  productName: string;
}
