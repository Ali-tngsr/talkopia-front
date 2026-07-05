'use client';

import { useState } from 'react';
import { Lock, CheckCircle2, PlayCircle, ChevronDown, Clock } from 'lucide-react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { useLocale, useTranslations } from '@/lib/i18n';
import type { Course, Lesson } from '@/lib/mockData';

interface CourseSidebarProps {
  course: Course;
  currentLessonId?: string;
  onSelectLesson?: (lesson: Lesson) => void;
}

export function CourseSidebar({ course, currentLessonId, onSelectLesson }: CourseSidebarProps) {
  const locale = useLocale();
  const isRtl = locale === 'fa';
  const t = useTranslations('CourseWatch');
  const tCommon = useTranslations('Common');
  const [openChapters, setOpenChapters] = useState<string[]>([`chapter-1`]);

  const totalLessons = course.chapters.reduce((acc, c) => acc + c.lessons.length, 0);
  const totalDuration = course.chapters.reduce(
    (acc, c) => acc + c.lessons.reduce((a, l) => a + l.duration, 0),
    0
  );

  return (
    <div className="rounded-[2rem] border border-[#5E6646]/10 bg-white/80 p-4 shadow-sm">
      <div className="mb-3 flex items-center justify-between px-2">
        <h3 className="text-lg font-black text-[#5E6646]">{t('chapters')}</h3>
        <span className="text-xs font-bold text-[#5E6646]/60">
          {totalLessons} {t('lessonsCount')} · {totalDuration} {tCommon('minutes')}
        </span>
      </div>
      <Accordion
        type="multiple"
        value={openChapters}
        onValueChange={setOpenChapters}
        className="space-y-2"
      >
        {course.chapters.map((chapter, cIdx) => {
          const chapterDuration = chapter.lessons.reduce((a, l) => a + l.duration, 0);
          return (
            <AccordionItem
              key={chapter.id}
              value={chapter.id}
              className="overflow-hidden rounded-2xl border border-[#5E6646]/8 bg-[#F2EED9]/40 px-3 first:rounded-t-2xl last:rounded-b-2xl"
            >
              <AccordionTrigger className="hover:no-underline">
                <div className="flex w-full items-center gap-3 py-2 text-start">
                  <span className="grid h-8 w-8 flex-shrink-0 place-items-center rounded-full bg-[#9EB766] text-xs font-black text-white">
                    {isRtl ? (cIdx + 1).toLocaleString('fa-IR') : cIdx + 1}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-black text-[#5E6646]">
                      {isRtl ? chapter.titleFa : chapter.titleEn}
                    </p>
                    <p className="text-[10px] font-bold text-[#5E6646]/60">
                      {chapter.lessons.length} {t('lessonsCount')} · {chapterDuration} {tCommon('minutes')}
                    </p>
                  </div>
                </div>
              </AccordionTrigger>
              <AccordionContent className="pb-2">
                <ul className="space-y-1 pt-1">
                  {chapter.lessons.map((lesson, lIdx) => {
                    const isCurrent = lesson.id === currentLessonId;
                    const isLocked = !lesson.isPreview && cIdx > 0 && !lesson.watched;
                    const isWatched = lesson.watched;
                    return (
                      <li key={lesson.id}>
                        <button
                          onClick={() => !isLocked && onSelectLesson?.(lesson)}
                          disabled={isLocked}
                          className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-start transition ${
                            isCurrent
                              ? 'bg-[#9EB766] text-white shadow-sm'
                              : isLocked
                              ? 'cursor-not-allowed opacity-50'
                              : 'hover:bg-[#F2EED9]'
                          }`}
                        >
                          <span className="grid h-7 w-7 flex-shrink-0 place-items-center rounded-full bg-white/60">
                            {isLocked ? (
                              <Lock className="h-3.5 w-3.5 text-[#5E6646]/60" />
                            ) : isWatched ? (
                              <CheckCircle2 className="h-4 w-4 text-[#9EB766]" />
                            ) : (
                              <PlayCircle className={`h-4 w-4 ${isCurrent ? 'text-white' : 'text-[#5E6646]'}`} />
                            )}
                          </span>
                          <div className="min-w-0 flex-1">
                            <p className={`truncate text-xs font-bold ${isCurrent ? 'text-white' : 'text-[#5E6646]'}`}>
                              {isRtl ? lesson.titleFa : lesson.titleEn}
                            </p>
                            <p className={`text-[10px] font-medium ${isCurrent ? 'text-white/80' : 'text-[#5E6646]/50'}`}>
                              <Clock className="me-1 inline h-2.5 w-2.5" />
                              {lesson.duration} {tCommon('minutes')}
                              {lesson.isPreview && (
                                <span className="ms-2 rounded-full bg-[#F1BD79]/30 px-2 py-0.5 text-[9px] font-black uppercase text-[#5E6646]">
                                  {t('preview')}
                                </span>
                              )}
                            </p>
                          </div>
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </AccordionContent>
            </AccordionItem>
          );
        })}
      </Accordion>
    </div>
  );
}
