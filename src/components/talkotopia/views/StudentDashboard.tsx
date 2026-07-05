'use client';

import { useState } from 'react';
import { BookOpen, Wallet, Award, Settings, TrendingUp, Clock, PlayCircle, CheckCircle2, Download, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { useLocale, useTranslations } from '@/lib/i18n';
import { useAppStore } from '@/lib/store';
import { courses, enrolledCourses, paymentHistory } from '@/lib/mockData';
import { DashboardLayout } from '@/components/talkotopia/DashboardLayout';

type Tab = 'overview' | 'myCourses' | 'payments' | 'certificates' | 'settings';

export function StudentDashboard() {
  const t = useTranslations('StudentDashboard');
  const tCommon = useTranslations('Common');
  const locale = useLocale();
  const isRtl = locale === 'fa';
  const { navigate, openAuth, role } = useAppStore();
  const [tab, setTab] = useState<Tab>('overview');

  if (role === 'guest') {
    return (
      <div className="animate-fade-in grid min-h-[60vh] place-items-center px-4">
        <div className="text-center">
          <div className="mx-auto grid h-20 w-20 place-items-center rounded-full bg-[#9EB766]/20">
            <BookOpen className="h-10 w-10 text-[#9EB766]" />
          </div>
          <h2 className="mt-6 text-2xl font-black text-[#5E6646]">{t('welcome')}</h2>
          <p className="mt-2 max-w-md font-medium text-[#5E6646]/70">{t('subtitle')}</p>
          <Button
            onClick={() => openAuth('login')}
            className="mt-6 rounded-full bg-[#9EB766] px-6 font-black text-white hover:bg-[#8aa454]"
          >
            {t('subtitle')}
          </Button>
        </div>
      </div>
    );
  }

  const stats = [
    { icon: BookOpen, label: t('stats.enrolled'), value: isRtl ? enrolledCourses.length.toLocaleString('fa-IR') : enrolledCourses.length, color: 'bg-[#9EB766]/20 text-[#9EB766]' },
    { icon: CheckCircle2, label: t('stats.completed'), value: isRtl ? '۱' : '1', color: 'bg-[#F1BD79]/30 text-[#F1BD79]' },
    { icon: Clock, label: t('stats.hoursLearned'), value: isRtl ? '۲۰٫۵' : '20.5', color: 'bg-[#9EB766]/20 text-[#9EB766]' },
    { icon: Award, label: t('stats.badges'), value: isRtl ? '۷' : '7', color: 'bg-[#F1BD79]/30 text-[#F1BD79]' },
  ];

  const navItems: { id: Tab; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { id: 'overview', label: t('nav.overview'), icon: TrendingUp },
    { id: 'myCourses', label: t('nav.myCourses'), icon: BookOpen },
    { id: 'payments', label: t('nav.payments'), icon: Wallet },
    { id: 'certificates', label: t('nav.certificates'), icon: Award },
    { id: 'settings', label: t('nav.settings'), icon: Settings },
  ];

  return (
    <div className="animate-fade-in mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
      <header className={isRtl ? 'text-right' : 'text-left'}>
        <h1 className="text-3xl font-black text-[#5E6646] sm:text-4xl">
          {t('welcome')}, {isRtl ? 'سارا' : 'Sara'} 👋
        </h1>
        <p className="mt-1 font-medium text-[#5E6646]/70">{t('subtitle')}</p>
      </header>

      <DashboardLayout navItems={navItems} activeTab={tab} onTabChange={(id) => setTab(id as Tab)}>
          {/* Stats */}
          {tab === 'overview' && (
            <div className="animate-fade-in space-y-6">
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                {stats.map((s) => {
                  const Icon = s.icon;
                  return (
                    <Card key={s.label} className="rounded-[1.5rem] border-0 bg-white/80 p-4 shadow-sm">
                      <div className={`grid h-10 w-10 place-items-center rounded-xl ${s.color}`}>
                        <Icon className="h-5 w-5" />
                      </div>
                      <p className="mt-3 text-2xl font-black text-[#5E6646]">{s.value}</p>
                      <p className="text-xs font-bold text-[#5E6646]/60">{s.label}</p>
                    </Card>
                  );
                })}
              </div>

              {/* Continue learning */}
              <Card className="rounded-[2rem] border-0 bg-white/80 p-6 shadow-sm">
                <h2 className="mb-4 text-lg font-black text-[#5E6646]">{t('myCourses.title')}</h2>
                <div className="space-y-3">
                  {enrolledCourses.map((ec) => {
                    const course = courses.find((c) => c.slug === ec.slug);
                    if (!course) return null;
                    return (
                      <button
                        key={ec.slug}
                        onClick={() => navigate('course-watch', { slug: ec.slug })}
                        className="flex w-full items-center gap-4 rounded-2xl bg-[#F2EED9]/60 p-3 text-start transition hover:bg-[#F2EED9]"
                      >
                        <span className="grid h-14 w-14 flex-shrink-0 place-items-center rounded-xl bg-white text-3xl">
                          {course.emoji}
                        </span>
                        <div className="min-w-0 flex-1">
                          <p className="truncate font-black text-[#5E6646]">
                            {isRtl ? course.titleFa : course.titleEn}
                          </p>
                          <div className="mt-1 flex items-center gap-2">
                            <Progress value={ec.progress} className="h-1.5 flex-1 bg-[#5E6646]/10" />
                            <span className="text-xs font-black text-[#9EB766]">
                              {isRtl ? ec.progress.toLocaleString('fa-IR') : ec.progress}%
                            </span>
                          </div>
                          <p className="mt-1 text-[10px] font-bold text-[#5E6646]/50">{ec.lastWatched}</p>
                        </div>
                        <PlayCircle className="h-6 w-6 flex-shrink-0 text-[#9EB766]" />
                      </button>
                    );
                  })}
                </div>
              </Card>
            </div>
          )}

          {tab === 'myCourses' && (
            <div className="animate-fade-in space-y-3">
              <h2 className="mb-2 text-lg font-black text-[#5E6646]">{t('myCourses.title')}</h2>
              {enrolledCourses.map((ec) => {
                const course = courses.find((c) => c.slug === ec.slug);
                if (!course) return null;
                const isCompleted = ec.progress === 100;
                return (
                  <Card key={ec.slug} className="rounded-[1.5rem] border-0 bg-white/80 p-4 shadow-sm">
                    <div className="flex items-center gap-4">
                      <span className="grid h-16 w-16 flex-shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-[#F1BD79]/40 to-[#9EB766]/40 text-3xl">
                        {course.emoji}
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="font-black text-[#5E6646]">{isRtl ? course.titleFa : course.titleEn}</p>
                        <p className="text-xs font-bold text-[#5E6646]/60">
                          {isRtl ? course.instructorFa : course.instructorEn}
                        </p>
                        <div className="mt-2 flex items-center gap-2">
                          <Progress value={ec.progress} className="h-2 flex-1 bg-[#5E6646]/10" />
                          <span className="text-xs font-black text-[#9EB766]">
                            {isRtl ? ec.progress.toLocaleString('fa-IR') : ec.progress}%
                          </span>
                        </div>
                      </div>
                      <div className="flex flex-col gap-2">
                        {isCompleted ? (
                          <>
                            <Badge className="bg-[#9EB766]/20 text-[#9EB766] hover:bg-[#9EB766]/20">
                              <CheckCircle2 className="me-1 h-3 w-3" /> {t('myCourses.completed')}
                            </Badge>
                            <Button
                              size="sm"
                              onClick={() => navigate('certificate')}
                              variant="outline"
                              className="rounded-full border-[#9EB766]/40 text-[#5E6646] hover:bg-[#9EB766]/10"
                            >
                              <Award className="me-1 h-3 w-3" /> {t('myCourses.viewCertificate')}
                            </Button>
                          </>
                        ) : (
                          <Button
                            size="sm"
                            onClick={() => navigate('course-watch', { slug: ec.slug })}
                            className="rounded-full bg-[#9EB766] font-black text-white hover:bg-[#8aa454]"
                          >
                            {t('myCourses.continue')} <ArrowRight className={`ms-1 h-3 w-3 ${isRtl ? 'rotate-180' : ''}`} />
                          </Button>
                        )}
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          )}

          {tab === 'payments' && (
            <Card className="animate-fade-in rounded-[2rem] border-0 bg-white/80 p-4 shadow-sm sm:p-6">
              <h2 className="mb-4 text-lg font-black text-[#5E6646]">{t('payments.title')}</h2>

              {/* Desktop table */}
              <div className="hidden overflow-x-auto sm:block">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-start text-xs font-black uppercase tracking-wider text-[#5E6646]/60">
                      <th className="px-3 pb-3 text-start">{t('payments.date')}</th>
                      <th className="px-3 pb-3 text-start">{t('payments.course')}</th>
                      <th className="px-3 pb-3 text-start">{t('payments.amount')}</th>
                      <th className="px-3 pb-3 text-start">{t('payments.method')}</th>
                      <th className="px-3 pb-3 text-start">{t('payments.status')}</th>
                      <th className="px-3 pb-3 text-start">{t('payments.invoice')}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paymentHistory.map((p) => (
                      <tr key={p.id} className="border-t border-[#5E6646]/8">
                        <td className="px-3 py-3 font-bold text-[#5E6646]/70">{p.date}</td>
                        <td className="px-3 py-3 font-black text-[#5E6646]">{isRtl ? p.courseFa : p.courseEn}</td>
                        <td className="px-3 py-3 font-black text-[#5E6646]">
                          {isRtl ? p.amountLabel.replace(/,/g, '٬') : p.amountLabel} {tCommon('toman')}
                        </td>
                        <td className="px-3 py-3 font-bold text-[#5E6646]/70">{p.method}</td>
                        <td className="px-3 py-3">
                          <Badge className={
                            p.status === 'paid' ? 'bg-[#9EB766]/20 text-[#9EB766] hover:bg-[#9EB766]/20' :
                            p.status === 'refunded' ? 'bg-orange-100 text-orange-700 hover:bg-orange-100' :
                            'bg-yellow-100 text-yellow-700 hover:bg-yellow-100'
                          }>
                            {t(`payments.${p.status}` as const)}
                          </Badge>
                        </td>
                        <td className="px-3 py-3">
                          <button className="inline-flex items-center gap-1 text-xs font-black text-[#9EB766] hover:underline">
                            <Download className="h-3 w-3" /> PDF
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile cards */}
              <div className="space-y-3 sm:hidden">
                {paymentHistory.map((p) => (
                  <div key={p.id} className="rounded-2xl border border-[#5E6646]/8 bg-[#F2EED9]/40 p-3">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-black text-[#5E6646]">{isRtl ? p.courseFa : p.courseEn}</p>
                        <p className="mt-0.5 text-xs font-bold text-[#5E6646]/60">{p.date} · {p.method}</p>
                      </div>
                      <Badge className={
                        p.status === 'paid' ? 'bg-[#9EB766]/20 text-[#9EB766] hover:bg-[#9EB766]/20' :
                        p.status === 'refunded' ? 'bg-orange-100 text-orange-700 hover:bg-orange-100' :
                        'bg-yellow-100 text-yellow-700 hover:bg-yellow-100'
                      }>
                        {t(`payments.${p.status}` as const)}
                      </Badge>
                    </div>
                    <div className="mt-2 flex items-center justify-between border-t border-[#5E6646]/8 pt-2">
                      <span className="text-sm font-black text-[#5E6646]">
                        {isRtl ? p.amountLabel.replace(/,/g, '٬') : p.amountLabel} {tCommon('toman')}
                      </span>
                      <button className="inline-flex items-center gap-1 text-xs font-black text-[#9EB766]">
                        <Download className="h-3 w-3" /> PDF
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          )}

          {tab === 'certificates' && (
            <Card className="animate-fade-in rounded-[2rem] border-0 bg-white/80 p-6 shadow-sm">
              <h2 className="mb-4 text-lg font-black text-[#5E6646]">{t('nav.certificates')}</h2>
              <div className="space-y-3">
                {enrolledCourses.filter((ec) => ec.progress === 100).map((ec) => {
                  const course = courses.find((c) => c.slug === ec.slug);
                  if (!course) return null;
                  return (
                    <div key={ec.slug} className="flex items-center gap-4 rounded-2xl border-2 border-dashed border-[#F1BD79] bg-[#F2EED9]/40 p-4">
                      <Award className="h-10 w-10 text-[#F1BD79]" />
                      <div className="flex-1">
                        <p className="font-black text-[#5E6646]">{isRtl ? course.titleFa : course.titleEn}</p>
                        <p className="text-xs font-bold text-[#5E6646]/60">TKP-2026-00{Math.floor(Math.random() * 99) + 10}</p>
                      </div>
                      <Button
                        onClick={() => navigate('certificate')}
                        size="sm"
                        variant="outline"
                        className="rounded-full border-[#9EB766]/40 text-[#5E6646] hover:bg-[#9EB766]/10"
                      >
                        <Download className="me-1 h-3 w-3" /> {tCommon('save')}
                      </Button>
                    </div>
                  );
                })}
              </div>
            </Card>
          )}

          {tab === 'settings' && (
            <Card className="animate-fade-in rounded-[2rem] border-0 bg-white/80 p-6 shadow-sm">
              <h2 className="mb-4 text-lg font-black text-[#5E6646]">{t('nav.settings')}</h2>
              <p className="text-sm font-medium text-[#5E6646]/60">Settings panel placeholder — profile, password, notifications.</p>
            </Card>
          )}
      </DashboardLayout>
    </div>
  );
}
