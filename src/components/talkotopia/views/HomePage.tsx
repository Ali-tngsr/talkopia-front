'use client';

import { ArrowRight, BookOpen, ShoppingBag, Sparkles, Star, ShieldCheck, Users, Globe2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useLocale, useTranslations } from '@/lib/i18n';
import { useAppStore } from '@/lib/store';
import { courses } from '@/lib/mockData';
import { CourseCard } from '@/components/talkotopia/CourseCard';
import { TakoMascot } from '@/components/talkotopia/TakoMascot';

export function HomePage() {
  const t = useTranslations('HomePage');
  const common = useTranslations('Common');
  const locale = useLocale();
  const isRtl = locale === 'fa';
  const { navigate } = useAppStore();

  const featuredCourses = courses.slice(0, 4);

  return (
    <div className="animate-fade-in">
      {/* Hero section */}
      <section className="mx-auto grid max-w-7xl items-center gap-10 px-4 py-10 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:px-8 lg:py-16">
        <div className={isRtl ? 'text-right' : 'text-left'}>
          <div className="inline-flex items-center gap-2 rounded-full bg-white/70 px-4 py-2 text-sm font-black text-[#5E6646] shadow-sm ring-1 ring-[#5E6646]/10">
            <Sparkles className="h-4 w-4 fill-[#F1BD79] text-[#F1BD79]" />
            {t('hero.badge')}
          </div>
          <h1 className="mt-6 max-w-4xl text-4xl font-black leading-[1.05] tracking-tight text-[#5E6646] sm:text-5xl lg:text-7xl">
            {t('hero.headline')}
          </h1>
          <p className="mt-6 max-w-2xl text-lg font-medium leading-8 text-[#5E6646]/75 sm:text-xl">
            {t('hero.body')}
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
            <Button
              onClick={() => navigate('courses')}
              className="h-12 rounded-full bg-[#9EB766] px-7 text-base font-black text-white shadow-lg shadow-[#9EB766]/25 hover:bg-[#8aa454]"
            >
              {t('hero.primaryCta')}
              <ArrowRight className={`ms-2 h-5 w-5 ${isRtl ? 'rotate-180' : ''}`} />
            </Button>
            <Button
              onClick={() => navigate('student')}
              variant="outline"
              className="h-12 rounded-full border-[#5E6646]/20 bg-white/60 px-7 text-base font-black text-[#5E6646] hover:bg-white"
            >
              {t('hero.secondaryCta')}
            </Button>
          </div>

          {/* Stats row */}
          <div className="mt-10 flex flex-wrap gap-6 text-[#5E6646]/80">
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-[#9EB766]" />
              <span className="text-sm font-bold">12,400+ {isRtl ? 'یادگیرنده' : 'learners'}</span>
            </div>
            <div className="flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-[#9EB766]" />
              <span className="text-sm font-bold">100+ {isRtl ? 'درس' : 'lessons'}</span>
            </div>
            <div className="flex items-center gap-2">
              <Globe2 className="h-5 w-5 text-[#9EB766]" />
              <span className="text-sm font-bold">EN · FA</span>
            </div>
          </div>
        </div>

        {/* Mascot panel */}
        <div className="relative mx-auto aspect-square w-full max-w-[520px] rounded-[3rem] bg-[#F1BD79]/70 p-6 shadow-2xl shadow-[#5E6646]/10 ring-1 ring-white/70">
          <div className="absolute -start-4 top-10 z-10 rounded-3xl bg-white/85 px-4 py-3 text-sm font-black text-[#5E6646] shadow-lg">
            {t('hero.floatOne')}
          </div>
          <div className="absolute -end-3 bottom-12 z-10 rounded-3xl bg-[#9EB766] px-4 py-3 text-sm font-black text-white shadow-lg">
            {t('hero.floatTwo')}
          </div>
          <div className="grid h-full place-items-center rounded-[2.4rem] bg-[#F2EED9]">
            <div className="relative flex flex-col items-center">
              <TakoMascot size={280} />
              <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-[#5E6646] px-4 py-2 text-sm font-black text-white shadow-lg">
                <BookOpen className="me-1.5 inline h-4 w-4" />
                {t('hero.mascotLabel')}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured courses */}
      <section id="courses" className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div className={isRtl ? 'text-right' : 'text-left'}>
            <p className="text-sm font-black uppercase tracking-[0.24em] text-[#9EB766]">{t('courses.eyebrow')}</p>
            <h2 className="mt-2 text-3xl font-black text-[#5E6646] sm:text-4xl">{t('courses.title')}</h2>
          </div>
          <Button
            onClick={() => navigate('courses')}
            variant="outline"
            className="rounded-full border-[#9EB766]/40 bg-white/70 px-6 font-black text-[#5E6646] hover:bg-white"
          >
            {t('courses.viewAll')}
            <ArrowRight className={`ms-2 h-4 w-4 ${isRtl ? 'rotate-180' : ''}`} />
          </Button>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {featuredCourses.map((course, i) => (
            <CourseCard key={course.slug} course={course} index={i} />
          ))}
        </div>
      </section>

      {/* Shop teaser */}
      <section id="shop" className="mx-auto max-w-7xl px-4 pb-12 sm:px-6 lg:px-8">
        <div className="rounded-[2.5rem] bg-[#5E6646] p-6 text-white shadow-2xl shadow-[#5E6646]/15 sm:p-10">
          <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
            <div className={isRtl ? 'text-right' : 'text-left'}>
              <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-black text-[#F1BD79]">
                <ShoppingBag className="h-4 w-4" /> {t('shop.eyebrow')}
              </div>
              <h2 className="mt-4 text-3xl font-black sm:text-4xl">{t('shop.title')}</h2>
              <p className="mt-4 max-w-xl text-base font-medium leading-8 text-white/75">{t('shop.body')}</p>
              <Button className="mt-6 rounded-full bg-[#F1BD79] px-6 font-black text-[#5E6646] hover:bg-[#e8a85e]">
                {t('shop.eyebrow')}
                <ArrowRight className={`ms-2 h-4 w-4 ${isRtl ? 'rotate-180' : ''}`} />
              </Button>
            </div>
            <div className="grid gap-4 sm:grid-cols-3">
              {[
                { emoji: '📚', name: isRtl ? 'کتاب مصور' : 'Picture Books', price: '120K' },
                { emoji: '🎨', name: isRtl ? 'کیت هنری' : 'Art Kits', price: '180K' },
                { emoji: '🧸', name: isRtl ? 'عروسک تاکو' : 'Tako Plush', price: '240K' },
              ].map((item) => (
                <div key={item.name} className="rounded-[2rem] border border-white/15 bg-white/10 p-4 backdrop-blur-sm">
                  <div className="mb-4 grid h-20 place-items-center rounded-3xl bg-[#F1BD79]/30 text-4xl">
                    {item.emoji}
                  </div>
                  <p className="text-sm font-black">{item.name}</p>
                  <p className="mt-1 text-xs font-bold text-white/60">{item.price} {common('toman')}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Why Talkotopia */}
      <section className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {[
            { icon: ShieldCheck, titleEn: 'Verified Certificates', titleFa: 'گواهینامه‌های معتبر', bodyEn: 'Earn certificates that employers and schools recognize.', bodyFa: 'گواهینامه‌هایی بگیر که کارفرماها و مدارس به رسمیت می‌شناسند.' },
            { icon: Users, titleEn: 'Loved by Families', titleFa: 'محبوب خانواده‌ها', bodyEn: 'Safe, ad-free, and designed with parents in mind.', bodyFa: 'ایمن، بدون تبلیغ، و طراحی‌شده با توجه به والدین.' },
            { icon: Globe2, titleEn: 'Truly Bilingual', titleFa: 'واقعاً دوزبانه', bodyEn: 'Switch between English and Farsi instantly, anywhere.', bodyFa: 'هر لحظه بین انگلیسی و فارسی جابه‌جا شو.' },
          ].map((f) => {
            const Icon = f.icon;
            return (
              <Card key={f.titleEn} className="rounded-[2rem] border-0 bg-white/80 p-6 shadow-sm ring-1 ring-[#5E6646]/8">
                <span className="grid h-12 w-12 place-items-center rounded-2xl bg-[#F1BD79]/30">
                  <Icon className="h-6 w-6 text-[#5E6646]" />
                </span>
                <h3 className="mt-4 text-xl font-black text-[#5E6646]">{isRtl ? f.titleFa : f.titleEn}</h3>
                <p className="mt-2 text-sm font-medium leading-7 text-[#5E6646]/70">{isRtl ? f.bodyFa : f.bodyEn}</p>
              </Card>
            );
          })}
        </div>
      </section>
    </div>
  );
}
