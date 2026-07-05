'use client';

import { Star, Users, BookOpen } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { useLocale, useTranslations } from '@/lib/i18n';
import { useAppStore } from '@/lib/store';
import type { Course } from '@/lib/types';

interface CourseCardProps {
  course: Course;
  index?: number;
}

/** Format price for display — Persian digits in fa locale. */
function formatPrice(price: number, locale: 'fa' | 'en'): string {
  return locale === 'fa' ? price.toLocaleString('fa-IR') : price.toLocaleString('en-US');
}

/** Pick a stable emoji from the course slug — backend has no emoji field. */
function emojiFor(slug: string): string {
  const emojis = ['🦊', '🐼', '🦁', '🐰', '🐢', '🦉'];
  let hash = 0;
  for (let i = 0; i < slug.length; i++) hash = (hash * 31 + slug.charCodeAt(i)) >>> 0;
  return emojis[hash % emojis.length];
}

export function CourseCard({ course, index = 0 }: CourseCardProps) {
  const locale = useLocale();
  const isRtl = locale === 'fa';
  const t = useTranslations('Common');
  const { navigate, addToCart } = useAppStore();

  // Backend doesn't have bilingual fields — it returns a single title/description.
  // The Accept-Language header tells the backend which language to use.
  const title = course.title;
  const subtitle = course.description?.slice(0, 80) ?? '';
  const instructor = isRtl ? 'مدرس دوره' : 'Course Instructor';
  const tag = course.status === 'published' ? (isRtl ? 'منتشر شده' : 'Published') : (isRtl ? 'در حال آماده‌سازی' : 'Draft');
  const emoji = emojiFor(course.slug);
  const displayPrice = course.discount_price ?? course.price;
  const hasDiscount = course.discount_price != null && course.discount_price < course.price;

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
            <span className="text-5xl transition group-hover:scale-110">{emoji}</span>
          </div>
          {hasDiscount && (
            <span className="absolute top-3 end-3 rounded-full bg-red-500 px-2.5 py-1 text-[10px] font-black uppercase tracking-wider text-white">
              {isRtl ? 'تخفیف' : 'Sale'}
            </span>
          )}
        </div>
        <CardContent className="space-y-3 px-2 pb-2 pt-4">
          <div>
            <h3 className="text-lg font-black leading-7 text-[#5E6646] line-clamp-2">{title}</h3>
            <p className="mt-1 text-sm font-bold text-[#5E6646]/60 line-clamp-2">{subtitle}</p>
          </div>
          <div className="flex items-center justify-between gap-3 text-xs font-bold text-[#5E6646]/70">
            <span className="truncate">{t('teacher')}: {instructor}</span>
          </div>
          <div className="flex items-center justify-between rounded-2xl bg-[#F2EED9] px-4 py-3">
            <span className="text-[10px] font-black uppercase tracking-wider text-[#9EB766]">{t('toman')}</span>
            <div className="text-end">
              {hasDiscount && (
                <span className="me-2 text-xs font-bold text-[#5E6646]/40 line-through">
                  {formatPrice(course.price, locale)}
                </span>
              )}
              <span className="text-lg font-black text-[#5E6646]">{formatPrice(displayPrice, locale)}</span>
            </div>
          </div>
          <div className="flex flex-col gap-2 pt-1 sm:flex-row">
            <button
              onClick={(e) => {
                e.stopPropagation();
                addToCart({
                  id: course.id,
                  slug: course.slug,
                  title,
                  price: displayPrice,
                  priceLabel: formatPrice(displayPrice, locale),
                  instructor,
                  tag,
                  emoji,
                });
              }}
              className="flex-1 rounded-full bg-[#F2EED9] py-2.5 text-xs font-black text-[#5E6646] transition hover:bg-[#9EB766]/20"
            >
              {t('addToCart')}
            </button>
            <span className="hidden flex-1 items-center justify-center rounded-full bg-[#9EB766] py-2.5 text-xs font-black text-white opacity-0 transition group-hover:opacity-100 sm:flex">
              {t('viewDetails')}
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
