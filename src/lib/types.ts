// ==========================================
// Talkotopia — TypeScript types matching backend entities/DTOs
// Mirror of apps/api/src in Talkotopia_Site backend repo.
// ==========================================

export type Role = 'student' | 'teacher' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
}

export interface AuthResponse {
  message: string;
  access_token: string;
  refresh_token: string;
  user: User;
}

export interface RefreshResponse {
  access_token: string;
  refresh_token: string;
}

export type CourseStatus = 'draft' | 'published' | 'archived';
export type ContentType = 'video' | 'article' | 'quiz';
export type ProcessingStatus = 'pending' | 'processing' | 'ready' | 'failed';
export type OrderStatus = 'pending' | 'paid' | 'failed' | 'refunded' | 'cancelled';
export type PaymentStatus = 'pending' | 'success' | 'failed';

export interface Course {
  id: string;
  title: string;
  slug: string;
  description: string;
  teacher_id: string;
  teacher?: User;
  price: number;
  discount_price: number | null;
  thumbnail: string | null;
  status: CourseStatus;
  created_at: string;
  updated_at: string;
}

export interface PaginatedCourses {
  data: Course[];
  total: number;
  page: number;
  limit: number;
  pages: number;
}

export interface CourseSection {
  id: string;
  course_id: string;
  title: string;
  order: number;
  lessons?: Lesson[];
}

export interface Lesson {
  id: string;
  section_id: string;
  title: string;
  order: number;
  content_type: ContentType;
  quality_720_url: string;
  quality_1080_url: string | null;
  quality_480_url: string | null;
  duration_seconds: number | null;
  is_free_preview: boolean;
  allow_download: boolean;
  created_at: string;
}

export interface CourseReview {
  id: string;
  user_id: string;
  user?: User;
  course_id: string;
  rating: number;
  comment: string | null;
  created_at: string;
  updated_at: string;
}

export interface Enrollment {
  id: string;
  user_id: string;
  course_id: string;
  course?: Course;
  enrolled_at: string;
  completed_at: string | null;
  updated_at: string;
}

export interface OrderItem {
  id: string;
  order_id: string;
  course_id: string;
  course?: Course;
  course_title: string;
  unit_price: number;
}

export interface PaymentTransaction {
  id: string;
  order_id: string;
  authority: string | null;
  gateway: string;
  amount: number;
  status: PaymentStatus;
  tracking_code: string | null;
  created_at: string;
  updated_at: string;
}

export interface Order {
  id: string;
  user_id: string;
  total_amount: number;
  currency: string;
  status: OrderStatus;
  failure_reason: string | null;
  created_at: string;
  updated_at: string;
  items: OrderItem[];
  transactions?: PaymentTransaction[];
}

// ====== Request DTOs ======

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface VerifyOtpPayload {
  email: string;
  otp: string;
}

export interface ForgotPasswordPayload {
  email: string;
}

export interface ResetPasswordPayload {
  token: string;
  new_password: string;
}

export interface RefreshPayload {
  refresh_token: string;
}

export interface CreateCoursePayload {
  title: string;
  description: string;
  price: number;
  discount_price?: number;
  thumbnail?: string;
}

export interface UpdateCoursePayload extends Partial<CreateCoursePayload> {
  status?: CourseStatus;
}

export interface CreateSectionPayload {
  title: string;
  order: number;
}

export interface CreateLessonPayload {
  title: string;
  order: number;
  content_type?: ContentType;
  quality_720_url: string;
  quality_1080_url?: string;
  quality_480_url?: string;
  is_free_preview?: boolean;
  allow_download?: boolean;
}

export interface CreateReviewPayload {
  rating: number;
  comment?: string;
}

export interface CreateOrderPayload {
  course_ids: string[];
}

export interface VerifyPaymentPayload {
  authority?: string;
  status?: 'OK' | 'NOK';
}

export interface PaymentRequestResponse {
  authority: string;
  payment_url: string;
}

// ====== API helpers ======

export interface ApiError {
  statusCode: number;
  message: string | string[];
  error?: string;
}
