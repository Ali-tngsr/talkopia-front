'use client';

import { useState } from 'react';
import { Lock, CheckCircle2, PlayCircle, Clock } from 'lucide-react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { useLocale, useTranslations } from '@/lib/i18n';
import type { CourseSection, Lesson } from '@/lib/types';

interface CourseSidebarProps {
  sections: CourseSection[];
  currentLessonId?: string;
  onSelectLesson?: (lesson: Lesson) => void;
  /** Whether the user is enrolled (controls lock state). */
  isEnrolled?: boolean;
}

export function CourseSidebar({ sections, currentLessonId, onSelectLesson, isEnrolled = false }: CourseSidebarProps) {
  const locale = useLocale();
  const isRtl = locale === 'fa';
  const t = useTranslations('CourseWatch');
  const tCommon = useTranslations('Common');
  const [openChapters, setOpenChapters] = useState<string[]>(sections.length > 0 ? [sections[0].id] : []);

  const totalLessons = sections.reduce((acc, s) => acc + (s.lessons?.length ?? 0), 0);
  const totalDuration = sections.reduce(
    (acc, s) => acc + (s.lessons ?? []).reduce((a, l) => a + (l.duration_seconds ?? 0), 0),
    0
  );
  const totalMinutes = Math.round(totalDuration / 60);

  return (
    <div className="rounded-[2rem] border border-[#5E6646]/10 bg-white/80 p-4 shadow-sm">
      <div className="mb-3 flex items-center justify-between px-2">
        <h3 className="text-lg font-black text-[#5E6646]">{t('chapters')}</h3>
        <span className="text-xs font-bold text-[#5E6646]/60">
          {isRtl ? totalLessons.toLocaleString('fa-IR') : totalLessons} {t('lessonsCount')} · {isRtl ? totalMinutes.toLocaleString('fa-IR') : totalMinutes} {tCommon('minutes')}
        </span>
      </div>
      {sections.length === 0 ? (
        <p className="px-2 py-4 text-sm font-bold text-[#5E6646]/50">
          {isRtl ? 'هنوز فصلی اضافه نشده.' : 'No sections yet.'}
        </p>
      ) : (
        <Accordion
          type="multiple"
          value={openChapters}
          onValueChange={setOpenChapters}
          className="space-y-2"
        >
          {sections.map((section, sIdx) => {
            const lessons = section.lessons ?? [];
            const sectionDuration = lessons.reduce((a, l) => a + (l.duration_seconds ?? 0), 0);
            const sectionMinutes = Math.round(sectionDuration / 60);
            return (
              <AccordionItem
                key={section.id}
                value={section.id}
                className="overflow-hidden rounded-2xl border border-[#5E6646]/8 bg-[#F2EED9]/40 px-3 first:rounded-t-2xl last:rounded-b-2xl"
              >
                <AccordionTrigger className="hover:no-underline">
                  <div className="flex w-full items-center gap-3 py-2 text-start">
                    <span className="grid h-8 w-8 flex-shrink-0 place-items-center rounded-full bg-[#9EB766] text-xs font-black text-white">
                      {isRtl ? (sIdx + 1).toLocaleString('fa-IR') : sIdx + 1}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-black text-[#5E6646]">{section.title}</p>
                      <p className="text-[10px] font-bold text-[#5E6646]/60">
                        {isRtl ? lessons.length.toLocaleString('fa-IR') : lessons.length} {t('lessonsCount')} · {isRtl ? sectionMinutes.toLocaleString('fa-IR') : sectionMinutes} {tCommon('minutes')}
                      </p>
                    </div>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="pb-2">
                  <ul className="space-y-1 pt-1">
                    {lessons.map((lesson, lIdx) => {
                      const isCurrent = lesson.id === currentLessonId;
                      const isLocked = !lesson.is_free_preview && !isEnrolled;
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
                              ) : (
                                <PlayCircle className={`h-4 w-4 ${isCurrent ? 'text-white' : 'text-[#5E6646]'}`} />
                              )}
                            </span>
                            <div className="min-w-0 flex-1">
                              <p className={`truncate text-xs font-bold ${isCurrent ? 'text-white' : 'text-[#5E6646]'}`}>
                                {lesson.title}
                              </p>
                              <p className={`text-[10px] font-medium ${isCurrent ? 'text-white/80' : 'text-[#5E6646]/50'}`}>
                                <Clock className="me-1 inline h-2.5 w-2.5" />
                                {lesson.duration_seconds ? Math.round(lesson.duration_seconds / 60) : '—'} {tCommon('minutes')}
                                {lesson.is_free_preview && (
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
      )}
    </div>
  );
}
