'use client';

import { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, CartesianGrid, Cell, Legend } from 'recharts';
import {
  Users, DollarSign, BookOpen, TrendingUp, Shield, Settings, LayoutDashboard,
  Ban, CheckCircle2, Eye, MoreHorizontal
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useLocale, useTranslations } from '@/lib/i18n';
import { useAppStore } from '@/lib/store';
import { courses, adminStats, adminUsers, adminCourses, adminMonthlyFinance } from '@/lib/mockData';

type Tab = 'overview' | 'users' | 'courses' | 'finance' | 'settings';

export function AdminDashboard() {
  const t = useTranslations('AdminDashboard');
  const tCommon = useTranslations('Common');
  const locale = useLocale();
  const isRtl = locale === 'fa';
  const { navigate, openAuth, role } = useAppStore();
  const [tab, setTab] = useState<Tab>('overview');
  const [users, setUsers] = useState(adminUsers);

  if (role === 'guest') {
    return (
      <div className="animate-fade-in grid min-h-[60vh] place-items-center px-4">
        <div className="text-center">
          <div className="mx-auto grid h-20 w-20 place-items-center rounded-full bg-[#5E6646]/15">
            <Shield className="h-10 w-10 text-[#5E6646]" />
          </div>
          <h2 className="mt-6 text-2xl font-black text-[#5E6646]">{t('welcome')}</h2>
          <p className="mt-2 max-w-md font-medium text-[#5E6646]/70">{t('subtitle')}</p>
          <Button
            onClick={() => {
              useAppStore.setState({ role: 'admin' });
              setTab('overview');
            }}
            className="mt-6 rounded-full bg-[#5E6646] px-6 font-black text-white hover:bg-[#4a5038]"
          >
            {isRtl ? 'ورود به عنوان ادمین (دمو)' : 'Enter as Admin (demo)'}
          </Button>
        </div>
      </div>
    );
  }

  const stats = [
    { icon: Users, label: t('stats.totalUsers'), value: isRtl ? adminStats.totalUsers.toLocaleString('fa-IR') : adminStats.totalUsers.toLocaleString(), color: 'bg-[#9EB766]/20 text-[#9EB766]' },
    { icon: DollarSign, label: t('stats.totalRevenue'), value: `${isRtl ? adminStats.totalRevenueLabel.replace(/,/g, '٬') : adminStats.totalRevenueLabel} ${tCommon('toman')}`, color: 'bg-[#F1BD79]/30 text-[#F1BD79]' },
    { icon: BookOpen, label: t('stats.activeCourses'), value: isRtl ? adminStats.activeCourses.toLocaleString('fa-IR') : adminStats.activeCourses, color: 'bg-[#9EB766]/20 text-[#9EB766]' },
    { icon: TrendingUp, label: t('stats.completionRate'), value: `${isRtl ? adminStats.completionRate.toLocaleString('fa-IR') : adminStats.completionRate}%`, color: 'bg-[#F1BD79]/30 text-[#F1BD79]' },
  ];

  const navItems: { id: Tab; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { id: 'overview', label: t('nav.overview'), icon: LayoutDashboard },
    { id: 'users', label: t('nav.users'), icon: Users },
    { id: 'courses', label: t('nav.courses'), icon: BookOpen },
    { id: 'finance', label: t('nav.finance'), icon: DollarSign },
    { id: 'settings', label: t('nav.settings'), icon: Settings },
  ];

  const toggleUserStatus = (id: string) => {
    setUsers((prev) => prev.map((u) => u.id === id ? { ...u, status: u.status === 'active' ? 'suspended' : 'active' } : u));
  };

  return (
    <div className="animate-fade-in mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
      <header className={isRtl ? 'text-right' : 'text-left'}>
        <h1 className="text-3xl font-black text-[#5E6646] sm:text-4xl">{t('welcome')}</h1>
        <p className="mt-1 font-medium text-[#5E6646]/70">{t('subtitle')}</p>
      </header>

      <div className="mt-6 grid gap-6 lg:grid-cols-[220px_1fr]">
        <aside>
          <nav className="sticky top-32 space-y-1 rounded-[2rem] border border-[#5E6646]/10 bg-white/80 p-3 shadow-sm">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => setTab(item.id)}
                  className={`flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-sm font-black transition ${
                    tab === item.id ? 'bg-[#5E6646] text-white shadow-sm' : 'text-[#5E6646]/70 hover:bg-[#F2EED9]'
                  }`}
                >
                  <Icon className="h-4 w-4" /> {item.label}
                </button>
              );
            })}
          </nav>
        </aside>

        <main>
          {/* Overview */}
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
                      <p className="mt-3 text-xl font-black text-[#5E6646]">{s.value}</p>
                      <p className="text-xs font-bold text-[#5E6646]/60">{s.label}</p>
                    </Card>
                  );
                })}
              </div>

              {/* Monthly finance chart */}
              <Card className="rounded-[2rem] border-0 bg-white/80 p-6 shadow-sm">
                <h2 className="mb-4 font-black text-[#5E6646]">{t('finance.monthlyBreakdown')} (M Toman)</h2>
                <ResponsiveContainer width="100%" height={320}>
                  <BarChart data={adminMonthlyFinance.map((m) => ({
                    name: isRtl ? m.monthFa : m.month,
                    [t('finance.grossRevenue')]: m.gross,
                    [t('platformShare')]: m.platform,
                    [t('teacherPayouts')]: m.teacher,
                  }))}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#5E6646" strokeOpacity={0.08} vertical={false} />
                    <XAxis dataKey="name" tick={{ fill: '#5E6646', fontSize: 12, fontWeight: 700 }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fill: '#5E6646', fontSize: 12, fontWeight: 700 }} axisLine={false} tickLine={false} />
                    <Tooltip
                      cursor={{ fill: '#9EB76620' }}
                      contentStyle={{ borderRadius: '1rem', border: 'none', boxShadow: '0 6px 24px rgba(0,0,0,0.08)', fontWeight: 'bold', color: '#5E6646' }}
                    />
                    <Legend wrapperStyle={{ fontWeight: 'bold', fontSize: 12 }} />
                    <Bar dataKey={t('finance.grossRevenue')} fill="#F1BD79" radius={[8, 8, 0, 0]} maxBarSize={24} />
                    <Bar dataKey={t('platformShare')} fill="#9EB766" radius={[8, 8, 0, 0]} maxBarSize={24} />
                    <Bar dataKey={t('teacherPayouts')} fill="#5E6646" radius={[8, 8, 0, 0]} maxBarSize={24} />
                  </BarChart>
                </ResponsiveContainer>
              </Card>
            </div>
          )}

          {/* Users */}
          {tab === 'users' && (
            <Card className="animate-fade-in rounded-[2rem] border-0 bg-white/80 p-6 shadow-sm">
              <h2 className="mb-4 font-black text-[#5E6646]">{t('users.title')}</h2>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-xs font-black uppercase tracking-wider text-[#5E6646]/60">
                      <th className="px-3 pb-3 text-start">{t('users.name')}</th>
                      <th className="px-3 pb-3 text-start">{t('users.email')}</th>
                      <th className="px-3 pb-3 text-start">{t('users.role')}</th>
                      <th className="px-3 pb-3 text-start">{t('users.joinedAt')}</th>
                      <th className="px-3 pb-3 text-start">{t('users.status')}</th>
                      <th className="px-3 pb-3 text-start">{t('users.actions')}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((u) => (
                      <tr key={u.id} className="border-t border-[#5E6646]/8">
                        <td className="px-3 py-3 font-black text-[#5E6646]">{isRtl ? u.nameFa : u.nameEn}</td>
                        <td className="px-3 py-3 font-bold text-[#5E6646]/70">{u.email}</td>
                        <td className="px-3 py-3 font-bold text-[#5E6646]">{isRtl ? u.roleFa : u.roleEn}</td>
                        <td className="px-3 py-3 font-bold text-[#5E6646]/70">{u.joined}</td>
                        <td className="px-3 py-3">
                          <Badge className={
                            u.status === 'active' ? 'bg-[#9EB766]/20 text-[#9EB766] hover:bg-[#9EB766]/20' :
                            'bg-red-100 text-red-700 hover:bg-red-100'
                          }>
                            {t(`users.${u.status}` as const)}
                          </Badge>
                        </td>
                        <td className="px-3 py-3">
                          <div className="flex gap-1">
                            <button className="grid h-8 w-8 place-items-center rounded-lg bg-[#F2EED9] text-[#5E6646]/70 hover:bg-white" aria-label={t('users.viewProfile')}>
                              <Eye className="h-3.5 w-3.5" />
                            </button>
                            <button
                              onClick={() => toggleUserStatus(u.id)}
                              className={`grid h-8 w-8 place-items-center rounded-lg ${u.status === 'active' ? 'bg-red-50 text-red-600 hover:bg-red-100' : 'bg-[#9EB766]/10 text-[#9EB766] hover:bg-[#9EB766]/20'}`}
                              aria-label={u.status === 'active' ? t('users.suspend') : t('users.activate')}
                            >
                              {u.status === 'active' ? <Ban className="h-3.5 w-3.5" /> : <CheckCircle2 className="h-3.5 w-3.5" />}
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          )}

          {/* Courses */}
          {tab === 'courses' && (
            <Card className="animate-fade-in rounded-[2rem] border-0 bg-white/80 p-6 shadow-sm">
              <h2 className="mb-4 font-black text-[#5E6646]">{t('courses.title')}</h2>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-xs font-black uppercase tracking-wider text-[#5E6646]/60">
                      <th className="px-3 pb-3 text-start">{tCommon('viewDetails')}</th>
                      <th className="px-3 pb-3 text-start">{t('courses.instructor')}</th>
                      <th className="px-3 pb-3 text-start">{t('courses.students')}</th>
                      <th className="px-3 pb-3 text-start">{t('courses.revenue')}</th>
                      <th className="px-3 pb-3 text-start">{t('courses.status')}</th>
                      <th className="px-3 pb-3 text-start">{t('users.actions')}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {adminCourses.map((c) => {
                      const course = courses.find((x) => x.slug === c.slug);
                      return (
                        <tr key={c.slug} className="border-t border-[#5E6646]/8">
                          <td className="px-3 py-3">
                            <div className="flex items-center gap-2">
                              <span className="text-2xl">{course?.emoji}</span>
                              <span className="font-black text-[#5E6646]">{course ? (isRtl ? course.titleFa : course.titleEn) : c.slug}</span>
                            </div>
                          </td>
                          <td className="px-3 py-3 font-bold text-[#5E6646]/70">{isRtl ? c.instructorFa : c.instructorEn}</td>
                          <td className="px-3 py-3 font-black text-[#5E6646]">{c.students.toLocaleString(isRtl ? 'fa-IR' : 'en-US')}</td>
                          <td className="px-3 py-3 font-black text-[#5E6646]">
                            {isRtl ? c.revenueLabel.replace(/,/g, '٬') : c.revenueLabel} {tCommon('toman')}
                          </td>
                          <td className="px-3 py-3">
                            <Badge className={
                              c.status === 'published' ? 'bg-[#9EB766]/20 text-[#9EB766] hover:bg-[#9EB766]/20' :
                              c.status === 'pending' ? 'bg-yellow-100 text-yellow-700 hover:bg-yellow-100' :
                              'bg-gray-100 text-gray-700 hover:bg-gray-100'
                            }>
                              {t(`courses.${c.status}` as const)}
                            </Badge>
                          </td>
                          <td className="px-3 py-3">
                            <button
                              onClick={() => navigate('course-watch', { slug: c.slug })}
                              className="grid h-8 w-8 place-items-center rounded-lg bg-[#F2EED9] text-[#5E6646]/70 hover:bg-white"
                              aria-label="View"
                            >
                              <Eye className="h-3.5 w-3.5" />
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </Card>
          )}

          {/* Finance */}
          {tab === 'finance' && (
            <div className="animate-fade-in space-y-5">
              <h2 className="font-black text-[#5E6646]">{t('finance.title')}</h2>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                {[
                  { label: t('finance.grossRevenue'), value: '702M', color: 'bg-[#9EB766]/20 text-[#9EB766]' },
                  { label: t('finance.platformShare'), value: '175.5M', color: 'bg-[#F1BD79]/30 text-[#F1BD79]' },
                  { label: t('finance.teacherPayouts'), value: '526.5M', color: 'bg-[#9EB766]/20 text-[#9EB766]' },
                  { label: t('finance.refunds'), value: '12M', color: 'bg-red-100 text-red-700' },
                  { label: t('finance.netRevenue'), value: '690M', color: 'bg-[#5E6646]/15 text-[#5E6646]' },
                ].map((s) => (
                  <Card key={s.label} className="rounded-[1.5rem] border-0 bg-white/80 p-4 shadow-sm">
                    <div className={`grid h-10 w-10 place-items-center rounded-xl ${s.color}`}>
                      <DollarSign className="h-5 w-5" />
                    </div>
                    <p className="mt-3 text-xl font-black text-[#5E6646]">{s.value}</p>
                    <p className="text-xs font-bold text-[#5E6646]/60">{s.label}</p>
                  </Card>
                ))}
              </div>

              <Card className="rounded-[2rem] border-0 bg-white/80 p-6 shadow-sm">
                <h3 className="mb-4 font-black text-[#5E6646]">{t('finance.monthlyBreakdown')} (M Toman)</h3>
                <ResponsiveContainer width="100%" height={320}>
                  <BarChart data={adminMonthlyFinance.map((m) => ({
                    name: isRtl ? m.monthFa : m.month,
                    [t('finance.grossRevenue')]: m.gross,
                    [t('platformShare')]: m.platform,
                    [t('teacherPayouts')]: m.teacher,
                  }))}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#5E6646" strokeOpacity={0.08} vertical={false} />
                    <XAxis dataKey="name" tick={{ fill: '#5E6646', fontSize: 12, fontWeight: 700 }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fill: '#5E6646', fontSize: 12, fontWeight: 700 }} axisLine={false} tickLine={false} />
                    <Tooltip
                      cursor={{ fill: '#9EB76620' }}
                      contentStyle={{ borderRadius: '1rem', border: 'none', boxShadow: '0 6px 24px rgba(0,0,0,0.08)', fontWeight: 'bold', color: '#5E6646' }}
                    />
                    <Legend wrapperStyle={{ fontWeight: 'bold', fontSize: 12 }} />
                    <Bar dataKey={t('finance.grossRevenue')} fill="#F1BD79" radius={[8, 8, 0, 0]} maxBarSize={24} />
                    <Bar dataKey={t('platformShare')} fill="#9EB766" radius={[8, 8, 0, 0]} maxBarSize={24} />
                    <Bar dataKey={t('teacherPayouts')} fill="#5E6646" radius={[8, 8, 0, 0]} maxBarSize={24} />
                  </BarChart>
                </ResponsiveContainer>
              </Card>
            </div>
          )}

          {tab === 'settings' && (
            <Card className="animate-fade-in rounded-[2rem] border-0 bg-white/80 p-6 shadow-sm">
              <h2 className="mb-4 font-black text-[#5E6646]">{t('nav.settings')}</h2>
              <p className="text-sm font-medium text-[#5E6646]/60">Platform settings placeholder — fees, payout schedule, feature flags.</p>
            </Card>
          )}
        </main>
      </div>
    </div>
  );
}
