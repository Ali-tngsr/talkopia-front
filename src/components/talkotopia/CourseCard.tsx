'use client';

import { Star, Clock, Users } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { useLocale, useTranslations } from '@/lib/i18n';
import { useAppStore } from '@/lib/store';
import type { Course } from '@/lib/mockData';

export function CourseCard({ course, index = 0 }: { course: Course; index?: number }) {
  const locale = useLocale();
  const isRtl = locale === 'fa';
  const t = useTranslations('Common');
  const { navigate, addToCart } = useAppStore();

  const title = isRtl ? course.titleFa : course.titleEn;
  const subtitle = isRtl ? course.subtitleFa : course.subtitleEn;
  const instructor = isRtl ? course.instructorFa : course.instructorEn;
  const tag = isRtl ? course.tagFa : course.tagEn;
  const ratingStr = isRtl ? course.rating.toLocaleString('fa-IR') : course.rating.toFixed(1);

  const open = () => navigate('course-watch', { slug: course.slug });

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={open}
      onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && open()}
      className="group block w-full cursor-pointer text-start"
      aria-label={title}
    >
      <Card className="h-full overflow-hidden rounded-[2rem] border-0 bg-white/80 p-3 shadow-sm ring-1 ring-[#5E6646]/8 transition hover:-translate-y-1 hover:shadow-xl hover:ring-[#9EB766]/30">
        <div className="relative h-44 overflow-hidden rounded-[1.5rem] bg-gradient-to-br from-[#F1BD79] via-[#F2EED9] to-[#9EB766] p-4">
          <div className="flex h-full items-end justify-between rounded-[1.15rem] bg-white/35 p-4 backdrop-blur-sm">
            <span className="rounded-full bg-white/85 px-3 py-1 text-xs font-black text-[#5E6646] shadow-sm">{tag}</span>
            <span className="text-5xl transition group-hover:scale-110">{course.emoji}</span>
          </div>
          <span className="absolute top-3 end-3 rounded-full bg-[#5E6646]/90 px-2.5 py-1 text-[10px] font-black uppercase tracking-wider text-white">
            {course.chapters.reduce((acc, c) => acc + c.lessons.length, 0)} {t('lessons')}
          </span>
        </div>
        <CardContent className="space-y-3 px-2 pb-2 pt-4">
          <div>
            <h3 className="text-lg font-black leading-7 text-[#5E6646] line-clamp-2">{title}</h3>
            <p className="mt-1 text-sm font-bold text-[#5E6646]/60 line-clamp-1">{subtitle}</p>
          </div>
          <div className="flex items-center justify-between gap-3 text-xs font-bold text-[#5E6646]/70">
            <span className="truncate">{t('teacher')}: {instructor}</span>
            <span className="flex flex-shrink-0 items-center gap-1 text-[#5E6646]">
              <Star className="h-3.5 w-3.5 fill-[#F1BD79] text-[#F1BD79]" />
              {ratingStr}
            </span>
          </div>
          <div className="flex items-center gap-3 text-[10px] font-bold uppercase tracking-wider text-[#5E6646]/50">
            <span className="flex items-center gap-1"><Users className="h-3 w-3" /> {course.studentsCount.toLocaleString(isRtl ? 'fa-IR' : 'en-US')}</span>
            <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {course.chapters.reduce((a, c) => a + c.lessons.reduce((b, l) => b + l.duration, 0), 0)} {t('minutes')}</span>
          </div>
          <div className="flex items-center justify-between rounded-2xl bg-[#F2EED9] px-4 py-3">
            <span className="text-[10px] font-black uppercase tracking-wider text-[#9EB766]">{t('toman')}</span>
            <span className="text-lg font-black text-[#5E6646]">{isRtl ? course.priceLabel.replace(/,/g, '٬') : course.priceLabel}</span>
          </div>
          <div className="flex gap-2 pt-1">
            <button
              onClick={(e) => {
                e.stopPropagation();
                addToCart({
                  slug: course.slug,
                  title,
                  price: course.price,
                  priceLabel: course.priceLabel,
                  instructor,
                  tag,
                  emoji: course.emoji,
                });
              }}
              className="flex-1 rounded-full bg-[#F2EED9] py-2.5 text-xs font-black text-[#5E6646] transition hover:bg-[#9EB766]/20"
            >
              {t('addToCart')}
            </button>
            <span className="flex-1 rounded-full bg-[#9EB766] py-2.5 text-xs font-black text-white opacity-0 transition group-hover:opacity-100">
              {t('viewDetails')}
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
