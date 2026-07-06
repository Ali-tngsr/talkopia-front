'use client';

import { useEffect } from 'react';
import { useAppStore } from '@/lib/store';
import { I18nProvider } from '@/lib/i18n';
import { Navbar } from '@/components/talkotopia/Navbar';
import { AuthModal } from '@/components/talkotopia/AuthModal';
import { HomePage } from '@/components/talkotopia/views/HomePage';
import { CoursesPage } from '@/components/talkotopia/views/CoursesPage';
import { CourseWatchPage } from '@/components/talkotopia/views/CourseWatchPage';
import { CheckoutPage } from '@/components/talkotopia/views/CheckoutPage';
import { CertificatePage } from '@/components/talkotopia/views/CertificatePage';
import { StudentDashboard } from '@/components/talkotopia/views/StudentDashboard';
import { TeacherDashboard } from '@/components/talkotopia/views/TeacherDashboard';
import { AdminDashboard } from '@/components/talkotopia/views/AdminDashboard';

function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="mt-auto bg-[#5E6646] py-8 text-white">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 text-center sm:flex-row sm:px-6 sm:text-start lg:px-8">
        <div>
          <p className="font-black">Talkotopia · تالکوتوپیا</p>
          <p className="text-xs text-white/60">© {year} · Learn with Joy</p>
        </div>
        <div className="flex gap-6 text-xs font-bold text-white/70">
          <span>EN · FA</span>
          <span>Self-hosted · Anti-sanction</span>
          <span>Made with 🌈</span>
        </div>
      </div>
    </footer>
  );
}

export default function Home() {
  const { locale, view, viewParams } = useAppStore();

  // Apply dir/lang to <html> reactively based on locale
  useEffect(() => {
    if (typeof document !== 'undefined') {
      const dir = locale === 'fa' ? 'rtl' : 'ltr';
      document.documentElement.lang = locale;
      document.documentElement.dir = dir;
    }
  }, [locale]);

  return (
    <I18nProvider locale={locale}>
      <div className="flex min-h-screen flex-col bg-[#F2EED9] text-[#5E6646]">
        <Navbar />

        <main className="flex-1">
          {view === 'home' && <HomePage />}
          {view === 'courses' && <CoursesPage />}
          {view === 'course-watch' && <CourseWatchPage slug={viewParams.slug || 'painting-with-tako'} />}
          {view === 'checkout' && <CheckoutPage />}
          {view === 'certificate' && <CertificatePage />}
          {view === 'student' && <StudentDashboard />}
          {view === 'teacher' && <TeacherDashboard />}
          {view === 'admin' && <AdminDashboard />}
        </main>

        <Footer />

        <AuthModal />
      </div>
    </I18nProvider>
  );
}
