// Simulated API layer — mimics backend delays. Swap to real fetch() in production.
import { courses, getCourseBySlug, validCertificates } from './mockData';

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export async function fetchCourses() {
  await delay(400);
  return courses;
}

export async function fetchCourse(slug: string) {
  await delay(300);
  return getCourseBySlug(slug);
}

export async function verifyCertificate(id: string) {
  await delay(700);
  return validCertificates[id.toUpperCase()] ?? null;
}

export async function loginRequest() {
  await delay(500);
  return { success: true };
}

export async function registerRequest() {
  await delay(700);
  return { success: true };
}

export async function submitOtpRequest() {
  await delay(500);
  return { success: true };
}

export async function processPayment() {
  await delay(1200);
  return { success: true, transactionId: 'TX-' + Math.random().toString(36).substring(2, 10).toUpperCase() };
}
