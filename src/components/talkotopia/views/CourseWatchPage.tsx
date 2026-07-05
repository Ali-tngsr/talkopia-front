'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { ArrowRight, Lock, CheckCircle2, Loader2, AlertCircle, Star, BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useLocale, useTranslations } from '@/lib/i18n';
import { useAppStore } from '@/lib/store';
import { fetchCourseBySlug, fetchCourseSections, fetchLessonMedia, enrollInCourse, fetchCourseReviews } from '@/lib/api';
import type { Lesson } from '@/lib/types';
import { VideoPlayer } from '@/components/talkotopia/VideoPlayer';
import { CourseSidebar } from '@/components/talkotopia/CourseSidebar';

/** Pick a stable emoji from the slug — backend has no emoji field. */
function emojiFor(slug: string): string {
  const emojis = ['🦊', '🐼', '🦁', '🐰', '🐢', '🦉'];
  let hash = 0;
  for (let i = 0; i < slug.length; i++) hash = (hash * 31 + slug.charCodeAt(i)) >>> 0;
  return emojis[hash % emojis.length];
}

export function CourseWatchPage({ slug }: { slug: string }) {
  const t = useTranslations('CourseWatch');
  const tCommon = useTranslations('Common');
  const locale = useLocale();
  const isRtl = locale === 'fa';
  const { navigate, addToCart, role, openAuth, user } = useAppStore();
  const [currentLesson, setCurrentLesson] = useState<Lesson | undefined>(undefined);

  // Fetch course details
  const { data: course, isLoading: courseLoading, error: courseError } = useQuery({
    queryKey: ['course', slug, locale],
    queryFn: () => fetchCourseBySlug(slug),
    enabled: !!slug,
  });

  // Fetch sections + lessons
  const { data: sections = [] } = useQuery({
    queryKey: ['course-sections', slug, locale],
    queryFn: () => fetchCourseSections(slug),
    enabled: !!slug,
  });

  // Fetch reviews
  const { data: reviews = [] } = useQuery({
    queryKey: ['course-reviews', course?.id, locale],
    queryFn: () => fetchCourseReviews(course!.id),
    enabled: !!course?.id,
  });

  // Auto-select first lesson when sections load
  const firstLesson = sections[0]?.lessons?.[0];
  if (!currentLesson && firstLesson) {
    setCurrentLesson(firstLesson);
  }

  // Fetch media for the selected lesson
  const { data: lessonMedia } = useQuery({
    queryKey: ['lesson-media', course?.id, currentLesson?.id],
    queryFn: () => fetchLessonMedia(course!.id, currentLesson!.id),
    enabled: !!course?.id && !!currentLesson?.id && role !== 'guest',
  });

  if (courseLoading) {
    return (
      <div className="grid min-h-[60vh] place-items-center px-4">
        <Loader2 className="h-10 w-10 animate-spin text-[#9EB766]" />
      </div>
    );
  }

  if (courseError || !course) {
    return (
      <div className="grid min-h-[60vh] place-items-center px-4">
        <div className="text-center">
          <p className="text-5xl">🤔</p>
          <p className="mt-4 font-bold text-[#5E6646]/70">
            {courseError instanceof Error ? courseError.message : (isRtl ? 'دوره یافت نشد.' : 'Course not found.')}
          </p>
          <Button onClick={() => navigate('courses')} className="mt-4 rounded-full bg-[#9EB766] font-black text-white">
            {tCommon('backToCourses')}
          </Button>
        </div>
      </div>
    );
  }

  const title = course.title;
  const description = course.description;
  const displayPrice = course.discount_price ?? course.price;
  const emoji = emojiFor(course.slug);
  const isEnrolled = role !== 'guest'; // Simplified — real check would query enrollments
  const isPreview = currentLesson?.is_free_preview;

  const handleEnroll = async () => {
    if (role === 'guest') {
      openAuth('login');
      return;
    }
    try {
      await enrollInCourse(course.id);
      // refetch or show toast
    } catch (err) {
      console.error('Enroll failed:', err);
    }
  };

  const handleAddToCart = () => {
    addToCart({
      id: course.id,
      slug: course.slug,
      title,
      price: displayPrice,
      priceLabel: (isRtl ? displayPrice.toLocaleString('fa-IR') : displayPrice.toLocaleString('en-US')),
      instructor: isRtl ? 'مدرس دوره' : 'Course Instructor',
      tag: course.status,
      emoji,
    });
    navigate('checkout');
  };

  return (
    <div className="animate-fade-in mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
      {/* Breadcrumb */}
      <button
        onClick={() => navigate('courses')}
        className="mb-4 inline-flex items-center gap-1.5 text-sm font-bold text-[#5E6646]/60 transition hover:text-[#9EB766]"
      >
        <ArrowRight className={`h-4 w-4 ${isRtl ? '' : 'rotate-180'}`} />
        {tCommon('backToCourses')}
      </button>

      <div className="grid gap-4 lg:grid-cols-[1.7fr_1fr] lg:gap-6">
        <div className="space-y-4 sm:space-y-5">
          {/* Video player */}
          <VideoPlayer
            title={title}
            emoji={emoji}
            videoUrl={lessonMedia?.quality_720_url ?? currentLesson?.quality_720_url}
          />

          {/* Lock overlay if not enrolled and not preview */}
          {!isEnrolled && !isPreview && (
            <div className="rounded-[2rem] bg-[#5E6646] p-6 text-white shadow-lg">
              <div className="flex items-center gap-3">
                <Lock className="h-6 w-6 text-[#F1BD79]" />
                <p className="font-black">{isRtl ? 'این درس قفل شده — ابتدا دوره را بخر' : 'This lesson is locked — buy the course first'}</p>
              </div>
              <div className="mt-4 flex gap-2">
                <Button
                  onClick={handleAddToCart}
                  className="rounded-full bg-[#F1BD79] font-black text-[#5E6646] hover:bg-[#e8a85e]"
                >
                  {tCommon('buyNow')} · {isRtl ? displayPrice.toLocaleString('fa-IR') : displayPrice.toLocaleString('en-US')} {tCommon('toman')}
                </Button>
                <Button
                  onClick={handleEnroll}
                  variant="outline"
                  className="rounded-full border-white/30 text-white hover:bg-white/10"
                >
                  {isRtl ? 'ثبت‌نام رایگان' : 'Enroll Free'}
                </Button>
              </div>
            </div>
          )}

          {/* Course header */}
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <Badge className="bg-[#F1BD79]/30 text-[#5E6646] hover:bg-[#F1BD79]/30">
                {course.status === 'published' ? (isRtl ? 'منتشر شده' : 'Published') : (isRtl ? 'پیش‌نویس' : 'Draft')}
              </Badge>
              <span className="flex items-center gap-1 text-xs font-bold text-[#5E6646]">
                <BookOpen className="h-3.5 w-3.5" />
                {isRtl ? sections.length.toLocaleString('fa-IR') : sections.length} {t('chapters')}
              </span>
              {reviews.length > 0 && (
                <span className="flex items-center gap-1 text-xs font-bold text-[#5E6646]">
                  <Star className="h-3.5 w-3.5 fill-[#F1BD79] text-[#F1BD79]" />
                  {(reviews.reduce((a, r) => a + r.rating, 0) / reviews.length).toFixed(1)}
                  <span className="text-[#5E6646]/50">({isRtl ? reviews.length.toLocaleString('fa-IR') : reviews.length})</span>
                </span>
              )}
            </div>
            <h1 className="mt-3 text-2xl font-black text-[#5E6646] sm:text-3xl lg:text-4xl">{title}</h1>
            <p className="mt-2 text-base font-medium leading-7 text-[#5E6646]/70">{description}</p>
          </div>

          {/* Tabs */}
          <Tabs defaultValue="description" className="w-full">
            <TabsList className="grid w-full grid-cols-2 rounded-2xl bg-[#F2EED9]/70 p-1 sm:grid-cols-3">
              <TabsTrigger value="description" className="rounded-xl font-black text-[#5E6646] data-[state=active]:bg-white data-[state=active]:shadow-sm">
                {t('tabs.description')}
              </TabsTrigger>
              <TabsTrigger value="comments" className="rounded-xl font-black text-[#5E6646] data-[state=active]:bg-white data-[state=active]:shadow-sm">
                {t('tabs.comments')}
              </TabsTrigger>
              <TabsTrigger value="attachments" className="hidden rounded-xl font-black text-[#5E6646] data-[state=active]:bg-white data-[state=active]:shadow-sm sm:block">
                {t('tabs.attachments')}
              </TabsTrigger>
            </TabsList>

            <TabsContent value="description" className="mt-4">
              <Card className="rounded-[2rem] border-0 bg-white/80 p-6 shadow-sm">
                <h3 className="text-lg font-black text-[#5E6646]">{tCommon('viewDetails')}</h3>
                <p className="mt-3 text-sm font-medium leading-7 text-[#5E6646]/80">{description}</p>
                {sections.length > 0 && (
                  <>
                    <h3 className="mt-6 text-lg font-black text-[#5E6646]">{t('whatYouLearn')}</h3>
                    <ul className="mt-3 space-y-2">
                      {sections.flatMap((s) => s.lessons ?? []).slice(0, 5).map((l) => (
                        <li key={l.id} className="flex items-start gap-2 text-sm font-medium text-[#5E6646]/80">
                          <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-[#9EB766]" />
                          {l.title}
                        </li>
                      ))}
                    </ul>
                  </>
                )}
              </Card>
            </TabsContent>

            <TabsContent value="comments" className="mt-4 space-y-3">
              {reviews.length === 0 ? (
                <Card className="rounded-[2rem] border-0 bg-white/80 p-6 text-center shadow-sm">
                  <p className="text-sm font-bold text-[#5E6646]/60">
                    {isRtl ? 'هنوز نظری ثبت نشده.' : 'No reviews yet.'}
                  </p>
                </Card>
              ) : (
                reviews.map((review) => (
                  <Card key={review.id} className="rounded-2xl border-0 bg-white/70 p-4 shadow-sm">
                    <div className="flex items-start gap-3">
                      <div className="grid h-10 w-10 flex-shrink-0 place-items-center rounded-full bg-[#F2EED9] text-lg">
                        {review.user?.name?.[0] ?? '👤'}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-black text-[#5E6646]">{review.user?.name ?? (isRtl ? 'کاربر' : 'User')}</p>
                          <span className="flex items-center gap-0.5">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <Star
                                key={i}
                                className={`h-3 w-3 ${i < review.rating ? 'fill-[#F1BD79] text-[#F1BD79]' : 'text-[#5E6646]/20'}`}
                              />
                            ))}
                          </span>
                        </div>
                        <p className="mt-1 text-sm font-medium leading-6 text-[#5E6646]/80">{review.comment}</p>
                      </div>
                    </div>
                  </Card>
                ))
              )}
            </TabsContent>

            <TabsContent value="attachments" className="mt-4">
              <Card className="rounded-[2rem] border-0 bg-white/80 p-6 shadow-sm">
                <p className="text-sm font-medium text-[#5E6646]/60">
                  {isRtl ? 'پیوستی وجود ندارد.' : 'No attachments available.'}
                </p>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Sidebar */}
        <aside>
          <div className="sticky top-32 space-y-4">
            <CourseSidebar
              sections={sections}
              currentLessonId={currentLesson?.id}
              onSelectLesson={(l) => setCurrentLesson(l)}
              isEnrolled={isEnrolled}
            />
            {isEnrolled && currentLesson && (
              <Button
                className="w-full rounded-2xl bg-[#9EB766] py-3 font-black text-white shadow-sm hover:bg-[#8aa454]"
                onClick={() => {
                  // Mark as complete — backend doesn't have this endpoint yet
                  console.log('Mark complete:', currentLesson.id);
                }}
              >
                <CheckCircle2 className="me-2 h-4 w-4" />
                {t('markComplete')}
              </Button>
            )}
            {user && (
              <p className="text-center text-xs font-bold text-[#5E6646]/50">
                {isRtl ? 'وارد شده به‌عنوان' : 'Signed in as'}: {user.name}
              </p>
            )}
          </div>
        </aside>
      </div>
    </div>
  );
}
