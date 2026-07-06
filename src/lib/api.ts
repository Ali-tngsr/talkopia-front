// ==========================================
// Talkotopia — REST API client (courses, lessons, reviews, orders)
// All functions return promises; throw Error with a friendly message on failure.
// ==========================================
import { http, getApiError } from './http';
import type {
  Course,
  CourseReview,
  CourseSection,
  CreateCoursePayload,
  CreateLessonPayload,
  CreateOrderPayload,
  CreateReviewPayload,
  CreateSectionPayload,
  Lesson,
  Order,
  PaginatedCourses,
  PaymentRequestResponse,
  UpdateCoursePayload,
  VerifyPaymentPayload,
} from './types';

// ====== Courses ======

export async function fetchCourses(params?: { page?: number; limit?: number; sort?: string }): Promise<PaginatedCourses> {
  try {
    const res = await http.get<PaginatedCourses>('/courses', { params });
    return res.data;
  } catch (err) {
    throw new Error(getApiError(err, 'دریافت لیست دوره‌ها ناموفق بود.'));
  }
}

export async function fetchCourseBySlug(slug: string): Promise<Course> {
  try {
    const res = await http.get<Course>(`/courses/${slug}`);
    return res.data;
  } catch (err) {
    throw new Error(getApiError(err, 'دریافت دوره ناموفق بود.'));
  }
}

export async function fetchCourseSections(slug: string): Promise<CourseSection[]> {
  try {
    const res = await http.get<CourseSection[]>(`/courses/${slug}/sections`);
    return res.data;
  } catch (err) {
    throw new Error(getApiError(err, 'دریافت فصل‌های دوره ناموفق بود.'));
  }
}

export async function fetchCourseReviews(courseId: string): Promise<CourseReview[]> {
  try {
    const res = await http.get<CourseReview[]>(`/courses/${courseId}/reviews`);
    return res.data;
  } catch (err) {
    throw new Error(getApiError(err, 'دریافت نظرات ناموفق بود.'));
  }
}

// ====== Teacher endpoints ======

export async function createCourse(payload: CreateCoursePayload): Promise<Course> {
  try {
    const res = await http.post<Course>('/courses', payload);
    return res.data;
  } catch (err) {
    throw new Error(getApiError(err, 'ساخت دوره ناموفق بود.'));
  }
}

export async function updateCourse(courseId: string, payload: UpdateCoursePayload): Promise<Course> {
  try {
    const res = await http.put<Course>(`/courses/${courseId}`, payload);
    return res.data;
  } catch (err) {
    throw new Error(getApiError(err, 'به‌روزرسانی دوره ناموفق بود.'));
  }
}

export async function createSection(courseId: string, payload: CreateSectionPayload): Promise<CourseSection> {
  try {
    const res = await http.post<CourseSection>(`/courses/${courseId}/sections`, payload);
    return res.data;
  } catch (err) {
    throw new Error(getApiError(err, 'افزودن فصل ناموفق بود.'));
  }
}

export async function createLesson(sectionId: string, payload: CreateLessonPayload): Promise<Lesson> {
  try {
    const res = await http.post<Lesson>(`/courses/sections/${sectionId}/lessons`, payload);
    return res.data;
  } catch (err) {
    throw new Error(getApiError(err, 'افزودن درس ناموفق بود.'));
  }
}

export async function deleteLesson(lessonId: string): Promise<void> {
  try {
    await http.delete(`/courses/lessons/${lessonId}`);
  } catch (err) {
    throw new Error(getApiError(err, 'حذف درس ناموفق بود.'));
  }
}

export async function fetchMyCreatedCourses(): Promise<Course[]> {
  try {
    const res = await http.get<Course[]>('/courses/my/created');
    return res.data;
  } catch (err) {
    throw new Error(getApiError(err, 'دریافت دوره‌های ساخته‌شده ناموفق بود.'));
  }
}

// ====== Student endpoints ======

export async function fetchMyEnrolledCourses(): Promise<Course[]> {
  try {
    const res = await http.get<Course[]>('/courses/my/enrolled');
    return res.data;
  } catch (err) {
    throw new Error(getApiError(err, 'دریافت دوره‌های من ناموفق بود.'));
  }
}

export async function fetchLessonContent(courseId: string, lessonId: string): Promise<Lesson> {
  try {
    const res = await http.get<Lesson>(`/courses/${courseId}/lessons/${lessonId}`);
    return res.data;
  } catch (err) {
    throw new Error(getApiError(err, 'دریافت محتوای درس ناموفق بود.'));
  }
}

export interface LessonMedia {
  quality_480_url: string | null;
  quality_720_url: string | null;
  quality_1080_url: string | null;
}

export async function fetchLessonMedia(courseId: string, lessonId: string): Promise<LessonMedia> {
  try {
    const res = await http.get<LessonMedia>(`/courses/${courseId}/lessons/${lessonId}/media`);
    return res.data;
  } catch (err) {
    throw new Error(getApiError(err, 'دریافت ویدیو ناموفق بود.'));
  }
}

export async function enrollInCourse(courseId: string): Promise<{ message: string }> {
  try {
    const res = await http.post<{ message: string }>(`/courses/${courseId}/enroll`);
    return res.data;
  } catch (err) {
    throw new Error(getApiError(err, 'ثبت‌نام در دوره ناموفق بود.'));
  }
}

export async function addCourseReview(courseId: string, payload: CreateReviewPayload): Promise<CourseReview> {
  try {
    const res = await http.post<CourseReview>(`/courses/${courseId}/reviews`, payload);
    return res.data;
  } catch (err) {
    throw new Error(getApiError(err, 'ثبت نظر ناموفق بود.'));
  }
}

// ====== Orders & payments ======

export async function createOrder(payload: CreateOrderPayload): Promise<Order> {
  try {
    const res = await http.post<Order>('/orders', payload);
    return res.data;
  } catch (err) {
    throw new Error(getApiError(err, 'ساخت سفارش ناموفق بود.'));
  }
}

export async function fetchMyOrders(): Promise<Order[]> {
  try {
    const res = await http.get<Order[]>('/orders');
    return res.data;
  } catch (err) {
    throw new Error(getApiError(err, 'دریافت سفارش‌ها ناموفق بود.'));
  }
}

export async function fetchOrder(orderId: string): Promise<Order> {
  try {
    const res = await http.get<Order>(`/orders/${orderId}`);
    return res.data;
  } catch (err) {
    throw new Error(getApiError(err, 'دریافت سفارش ناموفق بود.'));
  }
}

export async function requestPayment(orderId: string): Promise<PaymentRequestResponse> {
  try {
    const res = await http.post<PaymentRequestResponse>(`/orders/${orderId}/payment/request`);
    return res.data;
  } catch (err) {
    throw new Error(getApiError(err, 'شروع پرداخت ناموفق بود.'));
  }
}

export async function verifyPayment(payload: VerifyPaymentPayload): Promise<{ message: string; order: Order }> {
  try {
    const res = await http.post<{ message: string; order: Order }>('/orders/payments/verify', payload);
    return res.data;
  } catch (err) {
    throw new Error(getApiError(err, 'تأیید پرداخت ناموفق بود.'));
  }
}
