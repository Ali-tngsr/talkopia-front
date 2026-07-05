'use client';

import { useState, useEffect } from 'react';
import { ArrowRight, Star, Lock, CheckCircle2, FileText, Download, Send, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useLocale, useTranslations } from '@/lib/i18n';
import { useAppStore } from '@/lib/store';
import { getCourseBySlug, type Lesson } from '@/lib/mockData';
import { VideoPlayer } from '@/components/talkotopia/VideoPlayer';
import { CourseSidebar } from '@/components/talkotopia/CourseSidebar';

export function CourseWatchPage({ slug }: { slug: string }) {
  const t = useTranslations('CourseWatch');
  const tCommon = useTranslations('Common');
  const locale = useLocale();
  const isRtl = locale === 'fa';
  const { navigate, addToCart } = useAppStore();
  const course = getCourseBySlug(slug);
  const [currentLesson, setCurrentLesson] = useState<Lesson | undefined>(course?.chapters[0]?.lessons[0]);
  const [lastSlug, setLastSlug] = useState(slug);

  // Reset selected lesson when slug changes — using render-phase comparison
  if (slug !== lastSlug) {
    setLastSlug(slug);
    setCurrentLesson(course?.chapters[0]?.lessons[0]);
  }

  if (!course) {
    return (
      <div className="grid min-h-[60vh] place-items-center px-4">
        <div className="text-center">
          <p className="text-5xl">🤔</p>
          <p className="mt-4 font-bold text-[#5E6646]/70">Course not found.</p>
          <Button onClick={() => navigate('courses')} className="mt-4 rounded-full bg-[#9EB766] font-black text-white">
            {tCommon('backToCourses')}
          </Button>
        </div>
      </div>
    );
  }

  const title = isRtl ? course.titleFa : course.titleEn;
  const subtitle = isRtl ? course.subtitleFa : course.subtitleEn;
  const description = isRtl ? course.descriptionFa : course.descriptionEn;
  const instructor = isRtl ? course.instructorFa : course.instructorEn;
  const instructorBio = isRtl ? course.instructorBioFa : course.instructorBioEn;
  const whatYouLearn = isRtl ? course.whatYouLearnFa : course.whatYouLearnEn;
  const requirements = isRtl ? course.requirementsFa : course.requirementsEn;
  const ratingStr = isRtl ? course.rating.toLocaleString('fa-IR') : course.rating.toFixed(1);

  const isEnrolled = true; // mock
  const isPreview = currentLesson?.isPreview;

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
          <VideoPlayer title={title} emoji={course.emoji} />

          {/* Lock overlay if not enrolled */}
          {!isEnrolled && !isPreview && (
            <div className="rounded-[2rem] bg-[#5E6646] p-6 text-white shadow-lg">
              <div className="flex items-center gap-3">
                <Lock className="h-6 w-6 text-[#F1BD79]" />
                <p className="font-black">{isRtl ? 'این درس قفل شده — ابتدا دوره را بخر' : 'This lesson is locked — buy the course first'}</p>
              </div>
              <Button
                onClick={() => {
                  addToCart({
                    slug: course.slug,
                    title,
                    price: course.price,
                    priceLabel: course.priceLabel,
                    instructor,
                    tag: isRtl ? course.tagFa : course.tagEn,
                    emoji: course.emoji,
                  });
                  navigate('checkout');
                }}
                className="mt-4 rounded-full bg-[#F1BD79] font-black text-[#5E6646] hover:bg-[#e8a85e]"
              >
                {tCommon('buyNow')} · {isRtl ? course.priceLabel.replace(/,/g, '٬') : course.priceLabel} {tCommon('toman')}
              </Button>
            </div>
          )}

          {/* Course header */}
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-full bg-[#F1BD79]/30 px-3 py-1 text-xs font-black text-[#5E6646]">
                {isRtl ? course.tagFa : course.tagEn}
              </span>
              <span className="rounded-full bg-[#9EB766]/20 px-3 py-1 text-xs font-black text-[#9EB766]">
                {t('chapters')} {isRtl ? course.chapters.length.toLocaleString('fa-IR') : course.chapters.length}
              </span>
              <span className="flex items-center gap-1 text-xs font-bold text-[#5E6646]">
                <Star className="h-3.5 w-3.5 fill-[#F1BD79] text-[#F1BD79]" />
                {ratingStr}
                <span className="text-[#5E6646]/50">({isRtl ? course.ratingCount.toLocaleString('fa-IR') : course.ratingCount})</span>
              </span>
            </div>
            <h1 className="mt-3 text-3xl font-black text-[#5E6646] sm:text-4xl">{title}</h1>
            <p className="mt-1 text-base font-bold text-[#5E6646]/70">{subtitle}</p>
            <p className="mt-2 text-sm font-bold text-[#5E6646]/60">
              {tCommon('teacher')}: <span className="text-[#5E6646]">{instructor}</span>
            </p>
          </div>

          {/* Tabs */}
          <Tabs defaultValue="description" className="w-full">
            <TabsList className="grid w-full grid-cols-3 rounded-2xl bg-[#F2EED9]/70 p-1">
              <TabsTrigger value="description" className="rounded-xl font-black text-[#5E6646] data-[state=active]:bg-white data-[state=active]:shadow-sm">
                {t('tabs.description')}
              </TabsTrigger>
              <TabsTrigger value="attachments" className="rounded-xl font-black text-[#5E6646] data-[state=active]:bg-white data-[state=active]:shadow-sm">
                {t('tabs.attachments')}
              </TabsTrigger>
              <TabsTrigger value="comments" className="rounded-xl font-black text-[#5E6646] data-[state=active]:bg-white data-[state=active]:shadow-sm">
                {t('tabs.comments')}
              </TabsTrigger>
            </TabsList>

            <TabsContent value="description" className="mt-4 space-y-6">
              <Card className="rounded-[2rem] border-0 bg-white/80 p-6 shadow-sm">
                <h3 className="text-lg font-black text-[#5E6646]">{t('whatYouLearn')}</h3>
                <ul className="mt-3 grid gap-2 sm:grid-cols-2">
                  {whatYouLearn.map((item, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm font-medium text-[#5E6646]/80">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-[#9EB766]" />
                      {item}
                    </li>
                  ))}
                </ul>
              </Card>

              <Card className="rounded-[2rem] border-0 bg-white/80 p-6 shadow-sm">
                <h3 className="text-lg font-black text-[#5E6646]">{tCommon('viewDetails')}</h3>
                <p className="mt-3 text-sm font-medium leading-7 text-[#5E6646]/80">{description}</p>
              </Card>

              <Card className="rounded-[2rem] border-0 bg-white/80 p-6 shadow-sm">
                <h3 className="text-lg font-black text-[#5E6646]">{t('requirements')}</h3>
                <ul className="mt-3 space-y-2">
                  {requirements.map((item, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm font-medium text-[#5E6646]/80">
                      <span className="mt-1 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-[#F1BD79]" />
                      {item}
                    </li>
                  ))}
                </ul>
              </Card>

              <Card className="rounded-[2rem] border-0 bg-[#F2EED9]/60 p-6 shadow-sm">
                <h3 className="text-lg font-black text-[#5E6646]">{t('instructor')}</h3>
                <div className="mt-4 flex items-start gap-4">
                  <Avatar className="h-16 w-16 border-2 border-[#9EB766]">
                    <AvatarFallback className="bg-[#F1BD79] text-2xl font-black text-[#5E6646]">
                      {course.emoji}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-black text-[#5E6646]">{instructor}</p>
                    <p className="mt-1 text-sm font-medium leading-6 text-[#5E6646]/70">{instructorBio}</p>
                  </div>
                </div>
              </Card>
            </TabsContent>

            <TabsContent value="attachments" className="mt-4">
              <Card className="rounded-[2rem] border-0 bg-white/80 p-6 shadow-sm">
                <ul className="space-y-2">
                  {course.attachments.map((a, i) => (
                    <li key={i} className="flex items-center justify-between rounded-2xl bg-[#F2EED9]/50 p-3">
                      <div className="flex items-center gap-3">
                        <span className="grid h-10 w-10 place-items-center rounded-xl bg-[#9EB766]/20">
                          <FileText className="h-5 w-5 text-[#9EB766]" />
                        </span>
                        <div>
                          <p className="text-sm font-black text-[#5E6646]">{isRtl ? a.nameFa : a.nameEn}</p>
                          <p className="text-xs font-bold text-[#5E6646]/50">{a.size}</p>
                        </div>
                      </div>
                      <Button variant="outline" className="rounded-full border-[#9EB766]/40 text-[#5E6646] hover:bg-[#9EB766]/10">
                        <Download className="me-1 h-4 w-4" /> {t('downloadAttachment')}
                      </Button>
                    </li>
                  ))}
                </ul>
              </Card>
            </TabsContent>

            <TabsContent value="comments" className="mt-4 space-y-4">
              <Card className="rounded-[2rem] border-0 bg-white/80 p-6 shadow-sm">
                <p className="mb-3 font-black text-[#5E6646]">{t('leaveComment')}</p>
                <textarea
                  placeholder={t('commentPlaceholder')}
                  className="min-h-[100px] w-full resize-none rounded-2xl border border-[#9EB766]/30 bg-white p-4 text-sm font-medium text-[#5E6646] placeholder:text-[#5E6646]/40 focus:border-[#9EB766] focus:outline-none"
                />
                <Button className="mt-3 rounded-full bg-[#9EB766] font-black text-white hover:bg-[#8aa454]">
                  <Send className="me-1.5 h-4 w-4" /> {t('postComment')}
                </Button>
              </Card>

              <div className="space-y-3">
                {course.comments.map((c, i) => (
                  <Card key={i} className="rounded-2xl border-0 bg-white/70 p-4 shadow-sm">
                    <div className="flex items-start gap-3">
                      <Avatar className="h-10 w-10 border border-[#9EB766]/30">
                        <AvatarFallback className="bg-[#F2EED9] text-lg">{c.avatar}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-black text-[#5E6646]">{c.author}</p>
                          <p className="text-xs font-bold text-[#5E6646]/50">{c.date}</p>
                        </div>
                        <p className="mt-1 text-sm font-medium leading-6 text-[#5E6646]/80">
                          {isRtl ? c.textFa : c.textEn}
                        </p>
                        <button className="mt-2 inline-flex items-center gap-1 text-xs font-bold text-[#5E6646]/60 hover:text-[#9EB766]">
                          <Heart className="h-3.5 w-3.5" />
                          {isRtl ? c.likes.toLocaleString('fa-IR') : c.likes}
                        </button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* Sidebar */}
        <aside>
          <div className="sticky top-32 space-y-4">
            <CourseSidebar
              course={course}
              currentLessonId={currentLesson?.id}
              onSelectLesson={(l) => setCurrentLesson(l)}
            />
            {isEnrolled && (
              <Button
                className="w-full rounded-2xl bg-[#9EB766] py-3 font-black text-white shadow-sm hover:bg-[#8aa454]"
                onClick={() => setCurrentLesson((l) => ({ ...l, watched: true } as Lesson))}
              >
                <CheckCircle2 className="me-2 h-4 w-4" />
                {t('markComplete')}
              </Button>
            )}
          </div>
        </aside>
      </div>
    </div>
  );
}
