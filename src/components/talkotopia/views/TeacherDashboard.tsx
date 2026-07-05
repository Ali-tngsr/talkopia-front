'use client';

import { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, CartesianGrid, Cell } from 'recharts';
import {
  Plus, Upload, FileVideo, TrendingUp, DollarSign, Users, Star, Trash2,
  Image as ImageIcon, Save, Send, CheckCircle2, Loader2, BookOpen, Settings, ArrowRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { useLocale, useTranslations } from '@/lib/i18n';
import { useAppStore } from '@/lib/store';
import { courses, teacherStats, teacherMonthlyRevenue, teacherTopCourses } from '@/lib/mockData';
import { DashboardLayout } from '@/components/talkotopia/DashboardLayout';

type Tab = 'overview' | 'courses' | 'createCourse' | 'uploadMedia' | 'sales' | 'students';

interface ChapterDraft {
  id: string;
  titleEn: string;
  lessons: { id: string; titleEn: string; duration: number; videoFile: string }[];
}

export function TeacherDashboard() {
  const t = useTranslations('TeacherDashboard');
  const tCommon = useTranslations('Common');
  const locale = useLocale();
  const isRtl = locale === 'fa';
  const { navigate, openAuth, role } = useAppStore();
  const [tab, setTab] = useState<Tab>('overview');

  // Create course form
  const [courseTitle, setCourseTitle] = useState('');
  const [courseSubtitle, setCourseSubtitle] = useState('');
  const [courseDescription, setCourseDescription] = useState('');
  const [courseCategory, setCourseCategory] = useState('art');
  const [courseAge, setCourseAge] = useState('6-10');
  const [coursePrice, setCoursePrice] = useState('');
  const [courseLanguage, setCourseLanguage] = useState<'en' | 'fa' | 'both'>('both');
  const [coverName, setCoverName] = useState<string | null>(null);
  const [chapters, setChapters] = useState<ChapterDraft[]>([
    { id: 'ch1', titleEn: 'Chapter 1', lessons: [{ id: 'l1', titleEn: 'Lesson 1', duration: 10, videoFile: '' }] },
  ]);
  const [publishing, setPublishing] = useState(false);
  const [published, setPublished] = useState(false);

  // Media upload
  const [mediaItems, setMediaItems] = useState<{ name: string; size: string; progress: number; status: 'uploading' | 'uploaded' | 'failed' }[]>([]);

  if (role === 'guest') {
    return (
      <div className="animate-fade-in grid min-h-[60vh] place-items-center px-4">
        <div className="text-center">
          <div className="mx-auto grid h-20 w-20 place-items-center rounded-full bg-[#9EB766]/20">
            <Star className="h-10 w-10 text-[#9EB766]" />
          </div>
          <h2 className="mt-6 text-2xl font-black text-[#5E6646]">{t('welcome')}</h2>
          <p className="mt-2 max-w-md font-medium text-[#5E6646]/70">{t('subtitle')}</p>
          <Button
            onClick={() => openAuth('register')}
            className="mt-6 rounded-full bg-[#9EB766] px-6 font-black text-white hover:bg-[#8aa454]"
          >
            {t('subtitle')}
          </Button>
        </div>
      </div>
    );
  }

  const stats = [
    { icon: Users, label: t('stats.totalStudents'), value: isRtl ? teacherStats.totalStudents.toLocaleString('fa-IR') : teacherStats.totalStudents.toLocaleString(), color: 'bg-[#9EB766]/20 text-[#9EB766]' },
    { icon: DollarSign, label: t('stats.totalRevenue'), value: `${isRtl ? teacherStats.totalRevenueLabel.replace(/,/g, '٬') : teacherStats.totalRevenueLabel} ${tCommon('toman')}`, color: 'bg-[#F1BD79]/30 text-[#F1BD79]' },
    { icon: BookOpen, label: t('stats.activeCourses'), value: isRtl ? teacherStats.activeCourses.toLocaleString('fa-IR') : teacherStats.activeCourses, color: 'bg-[#9EB766]/20 text-[#9EB766]' },
    { icon: Star, label: t('stats.avgRating'), value: isRtl ? teacherStats.avgRating.toLocaleString('fa-IR') : teacherStats.avgRating, color: 'bg-[#F1BD79]/30 text-[#F1BD79]' },
  ];

  const navItems: { id: Tab; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { id: 'overview', label: t('nav.overview'), icon: TrendingUp },
    { id: 'courses', label: t('nav.courses'), icon: BookOpen },
    { id: 'createCourse', label: t('nav.createCourse'), icon: Plus },
    { id: 'uploadMedia', label: t('nav.uploadMedia'), icon: Upload },
    { id: 'sales', label: t('nav.sales'), icon: DollarSign },
  ];

  // Course creation handlers
  const addChapter = () => {
    setChapters((c) => [...c, { id: `ch${c.length + 1}`, titleEn: `Chapter ${c.length + 1}`, lessons: [] }]);
  };
  const addLesson = (chId: string) => {
    setChapters((c) => c.map((ch) => ch.id === chId ? { ...ch, lessons: [...ch.lessons, { id: `${chId}-l${ch.lessons.length + 1}`, titleEn: 'New Lesson', duration: 10, videoFile: '' }] } : ch));
  };
  const removeChapter = (chId: string) => setChapters((c) => c.filter((ch) => ch.id !== chId));
  const updateChapterTitle = (chId: string, title: string) => setChapters((c) => c.map((ch) => ch.id === chId ? { ...ch, titleEn: title } : ch));
  const updateLesson = (chId: string, lId: string, patch: Partial<{ titleEn: string; duration: number; videoFile: string }>) =>
    setChapters((c) => c.map((ch) => ch.id === chId ? { ...ch, lessons: ch.lessons.map((l) => l.id === lId ? { ...l, ...patch } : l) } : ch));
  const removeLesson = (chId: string, lId: string) =>
    setChapters((c) => c.map((ch) => ch.id === chId ? { ...ch, lessons: ch.lessons.filter((l) => l.id !== lId) } : ch));

  const publish = async () => {
    setPublishing(true);
    await new Promise((r) => setTimeout(r, 1000));
    setPublishing(false);
    setPublished(true);
    setTimeout(() => {
      setPublished(false);
      setTab('courses');
      setCourseTitle('');
      setCourseSubtitle('');
      setCourseDescription('');
      setCoursePrice('');
      setCoverName(null);
      setChapters([{ id: 'ch1', titleEn: 'Chapter 1', lessons: [{ id: 'l1', titleEn: 'Lesson 1', duration: 10, videoFile: '' }] }]);
    }, 1800);
  };

  const simulateUpload = () => {
    const fakeFiles = [
      { name: 'lesson-1-intro.mp4', size: '142 MB' },
      { name: 'lesson-2-colors.mp4', size: '88 MB' },
      { name: 'lesson-3-brushes.mp4', size: '215 MB' },
    ];
    fakeFiles.forEach((f, idx) => {
      setTimeout(() => {
        const item = { name: f.name, size: f.size, progress: 0, status: 'uploading' as const };
        setMediaItems((prev) => [...prev, item]);
        const interval = setInterval(() => {
          setMediaItems((prev) => prev.map((m, i) => {
            const idxInList = prev.length - fakeFiles.length + idx;
            if (i !== idxInList) return m;
            const newProgress = Math.min(100, m.progress + 8);
            return { ...m, progress: newProgress, status: newProgress === 100 ? 'uploaded' as const : 'uploading' as const };
          }));
        }, 200);
        setTimeout(() => clearInterval(interval), 3000);
      }, idx * 200);
    });
  };

  return (
    <div className="animate-fade-in mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
      <header className={isRtl ? 'text-right' : 'text-left'}>
        <h1 className="text-3xl font-black text-[#5E6646] sm:text-4xl">
          {t('welcome')} {isRtl && '🌟'}
        </h1>
        <p className="mt-1 font-medium text-[#5E6646]/70">{t('subtitle')}</p>
      </header>

      <DashboardLayout navItems={navItems} activeTab={tab} onTabChange={(id) => setTab(id as Tab)}>
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

              {/* Revenue chart */}
              <Card className="rounded-[2rem] border-0 bg-white/80 p-6 shadow-sm">
                <h2 className="mb-4 text-lg font-black text-[#5E6646]">{t('sales.monthlyRevenue')} (M Toman)</h2>
                <ResponsiveContainer width="100%" height={260}>
                  <BarChart data={teacherMonthlyRevenue.map((m) => ({ name: isRtl ? m.monthFa : m.month, revenue: m.revenue }))}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#5E6646" strokeOpacity={0.08} vertical={false} />
                    <XAxis dataKey="name" tick={{ fill: '#5E6646', fontSize: 12, fontWeight: 700 }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fill: '#5E6646', fontSize: 12, fontWeight: 700 }} axisLine={false} tickLine={false} />
                    <Tooltip
                      cursor={{ fill: '#9EB76620' }}
                      contentStyle={{ borderRadius: '1rem', border: 'none', boxShadow: '0 6px 24px rgba(0,0,0,0.08)', fontWeight: 'bold', color: '#5E6646' }}
                    />
                    <Bar dataKey="revenue" radius={[12, 12, 0, 0]} maxBarSize={48}>
                      {teacherMonthlyRevenue.map((_, i) => (
                        <Cell key={i} fill={i === teacherMonthlyRevenue.length - 1 ? '#9EB766' : '#F1BD79'} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </Card>
            </div>
          )}

          {/* My courses */}
          {tab === 'courses' && (
            <div className="animate-fade-in space-y-3">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-black text-[#5E6646]">{t('nav.courses')}</h2>
                <Button onClick={() => setTab('createCourse')} className="rounded-full bg-[#9EB766] font-black text-white hover:bg-[#8aa454]">
                  <Plus className="me-1 h-4 w-4" /> {t('nav.createCourse')}
                </Button>
              </div>
              {courses.slice(0, 4).map((c) => (
                <Card key={c.slug} className="flex items-center gap-4 rounded-[1.5rem] border-0 bg-white/80 p-4 shadow-sm">
                  <span className="grid h-14 w-14 flex-shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-[#F1BD79]/40 to-[#9EB766]/40 text-3xl">
                    {c.emoji}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="font-black text-[#5E6646]">{isRtl ? c.titleFa : c.titleEn}</p>
                    <p className="text-xs font-bold text-[#5E6646]/60">
                      {c.studentsCount.toLocaleString(isRtl ? 'fa-IR' : 'en-US')} {tCommon('students')} · ⭐ {c.rating}
                    </p>
                  </div>
                  <Button
                    onClick={() => navigate('course-watch', { slug: c.slug })}
                    variant="outline"
                    size="sm"
                    className="rounded-full border-[#9EB766]/40 text-[#5E6646] hover:bg-[#9EB766]/10"
                  >
                    {tCommon('viewDetails')}
                  </Button>
                </Card>
              ))}
            </div>
          )}

          {/* Create course */}
          {tab === 'createCourse' && (
            <div className="animate-fade-in space-y-5">
              <h2 className="text-lg font-black text-[#5E6646]">{t('createCourse.title')}</h2>

              {published ? (
                <Card className="rounded-[2rem] border-2 border-[#9EB766] bg-[#9EB766]/10 p-8 text-center">
                  <CheckCircle2 className="mx-auto h-12 w-12 text-[#9EB766]" />
                  <p className="mt-3 text-xl font-black text-[#5E6646]">
                    {isRtl ? 'دوره با موفقیت منتشر شد!' : 'Course published successfully!'}
                  </p>
                </Card>
              ) : (
                <>
                  <Card className="rounded-[2rem] border-0 bg-white/80 p-6 shadow-sm">
                    <h3 className="mb-3 font-black text-[#5E6646]">{t('createCourse.basicInfo')}</h3>
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div>
                        <label className="mb-1 block text-xs font-black uppercase tracking-wider text-[#5E6646]/60">{t('createCourse.titleField')}</label>
                        <Input value={courseTitle} onChange={(e) => setCourseTitle(e.target.value)} placeholder={isRtl ? 'مثلاً: نقاشی با تاکو' : 'e.g. Painting with Tako'} className="rounded-xl border-[#9EB766]/30 bg-[#F2EED9]/40 font-bold text-[#5E6646]" />
                      </div>
                      <div>
                        <label className="mb-1 block text-xs font-black uppercase tracking-wider text-[#5E6646]/60">{t('createCourse.subtitleField')}</label>
                        <Input value={courseSubtitle} onChange={(e) => setCourseSubtitle(e.target.value)} placeholder={isRtl ? 'زیرعنوان' : 'Subtitle'} className="rounded-xl border-[#9EB766]/30 bg-[#F2EED9]/40 font-bold text-[#5E6646]" />
                      </div>
                      <div className="sm:col-span-2">
                        <label className="mb-1 block text-xs font-black uppercase tracking-wider text-[#5E6646]/60">{t('createCourse.descriptionField')}</label>
                        <Textarea value={courseDescription} onChange={(e) => setCourseDescription(e.target.value)} rows={3} className="rounded-xl border-[#9EB766]/30 bg-[#F2EED9]/40 font-medium text-[#5E6646]" />
                      </div>
                      <div>
                        <label className="mb-1 block text-xs font-black uppercase tracking-wider text-[#5E6646]/60">{t('createCourse.categoryField')}</label>
                        <Select value={courseCategory} onValueChange={setCourseCategory}>
                          <SelectTrigger className="rounded-xl border-[#9EB766]/30 bg-[#F2EED9]/40 font-bold text-[#5E6646]">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {['art', 'language', 'math', 'music', 'science', 'coding'].map((c) => (
                              <SelectItem key={c} value={c}>{c}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <label className="mb-1 block text-xs font-black uppercase tracking-wider text-[#5E6646]/60">{t('createCourse.ageField')}</label>
                        <Input value={courseAge} onChange={(e) => setCourseAge(e.target.value)} className="rounded-xl border-[#9EB766]/30 bg-[#F2EED9]/40 font-bold text-[#5E6646]" />
                      </div>
                      <div>
                        <label className="mb-1 block text-xs font-black uppercase tracking-wider text-[#5E6646]/60">{t('createCourse.priceField')}</label>
                        <Input type="number" value={coursePrice} onChange={(e) => setCoursePrice(e.target.value)} placeholder="320000" className="rounded-xl border-[#9EB766]/30 bg-[#F2EED9]/40 font-bold text-[#5E6646]" />
                      </div>
                      <div>
                        <label className="mb-1 block text-xs font-black uppercase tracking-wider text-[#5E6646]/60">{t('createCourse.languageField')}</label>
                        <Select value={courseLanguage} onValueChange={(v: 'en' | 'fa' | 'both') => setCourseLanguage(v)}>
                          <SelectTrigger className="rounded-xl border-[#9EB766]/30 bg-[#F2EED9]/40 font-bold text-[#5E6646]">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="en">English</SelectItem>
                            <SelectItem value="fa">فارسی</SelectItem>
                            <SelectItem value="both">{isRtl ? 'هر دو' : 'Both'}</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="sm:col-span-2">
                        <label className="mb-1 block text-xs font-black uppercase tracking-wider text-[#5E6646]/60">{t('createCourse.coverUpload')}</label>
                        <label className="flex cursor-pointer items-center gap-3 rounded-2xl border-2 border-dashed border-[#9EB766]/40 bg-[#F2EED9]/40 p-4 transition hover:bg-[#F2EED9]">
                          <span className="grid h-10 w-10 place-items-center rounded-xl bg-white text-[#9EB766]">
                            <ImageIcon className="h-5 w-5" />
                          </span>
                          <div className="flex-1">
                            <p className="text-sm font-black text-[#5E6646]">{coverName ?? (isRtl ? 'فایل را اینجا بکش یا کلیک کن' : 'Click to upload')}</p>
                            <p className="text-xs font-bold text-[#5E6646]/50">{t('createCourse.coverHint')}</p>
                          </div>
                          <input
                            type="file"
                            className="hidden"
                            accept="image/*"
                            onChange={(e) => setCoverName(e.target.files?.[0]?.name ?? null)}
                          />
                        </label>
                      </div>
                    </div>
                  </Card>

                  {/* Chapters builder */}
                  <Card className="rounded-[2rem] border-0 bg-white/80 p-6 shadow-sm">
                    <div className="mb-3 flex items-center justify-between">
                      <h3 className="font-black text-[#5E6646]">{t('createCourse.chapters')}</h3>
                      <Button onClick={addChapter} variant="outline" size="sm" className="rounded-full border-[#9EB766]/40 text-[#5E6646] hover:bg-[#9EB766]/10">
                        <Plus className="me-1 h-3 w-3" /> {t('createCourse.addChapter')}
                      </Button>
                    </div>
                    <div className="space-y-3">
                      {chapters.map((ch) => (
                        <div key={ch.id} className="rounded-2xl border border-[#5E6646]/8 bg-[#F2EED9]/40 p-3">
                          <div className="flex items-center gap-2">
                            <Input
                              value={ch.titleEn}
                              onChange={(e) => updateChapterTitle(ch.id, e.target.value)}
                              className="rounded-xl border-[#9EB766]/30 bg-white text-sm font-black text-[#5E6646] sm:text-base"
                            />
                            <button onClick={() => removeChapter(ch.id)} className="grid h-9 w-9 flex-shrink-0 place-items-center rounded-full bg-white text-[#5E6646]/60 hover:bg-red-100 hover:text-red-600">
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                          <div className="mt-2 space-y-2">
                            {ch.lessons.map((l) => (
                              <div key={l.id} className="flex flex-col gap-2 rounded-xl bg-white p-2.5 sm:flex-row sm:items-center">
                                <div className="flex items-center gap-2">
                                  <FileVideo className="h-4 w-4 flex-shrink-0 text-[#9EB766]" />
                                  <Input
                                    value={l.titleEn}
                                    onChange={(e) => updateLesson(ch.id, l.id, { titleEn: e.target.value })}
                                    className="h-9 rounded-lg border-[#9EB766]/30 bg-[#F2EED9]/40 text-sm font-bold text-[#5E6646]"
                                  />
                                </div>
                                <div className="flex items-center gap-2">
                                  <Input
                                    type="number"
                                    value={l.duration}
                                    onChange={(e) => updateLesson(ch.id, l.id, { duration: Number(e.target.value) })}
                                    className="h-9 w-20 flex-shrink-0 rounded-lg border-[#9EB766]/30 bg-[#F2EED9]/40 text-sm font-bold text-[#5E6646]"
                                  />
                                  <label className="flex-shrink-0 cursor-pointer rounded-lg bg-[#F2EED9] px-3 py-2 text-xs font-black text-[#5E6646]">
                                    <span className="block max-w-[80px] truncate sm:max-w-none">{l.videoFile || (isRtl ? 'ویدیو' : 'Video')}</span>
                                    <input type="file" className="hidden" accept="video/*" onChange={(e) => updateLesson(ch.id, l.id, { videoFile: e.target.files?.[0]?.name ?? '' })} />
                                  </label>
                                  <button onClick={() => removeLesson(ch.id, l.id)} className="grid h-7 w-7 flex-shrink-0 place-items-center rounded-full text-[#5E6646]/60 hover:bg-red-100 hover:text-red-600">
                                    <Trash2 className="h-3.5 w-3.5" />
                                  </button>
                                </div>
                              </div>
                            ))}
                            <button onClick={() => addLesson(ch.id)} className="flex w-full items-center justify-center gap-1 rounded-xl border border-dashed border-[#9EB766]/40 py-2 text-xs font-black text-[#9EB766] transition hover:bg-[#9EB766]/5">
                              <Plus className="h-3 w-3" /> {t('createCourse.addLesson')}
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </Card>

                  <div className="flex gap-2">
                    <Button onClick={publish} disabled={publishing} className="flex-1 rounded-2xl bg-[#9EB766] font-black text-white shadow-lg shadow-[#9EB766]/25 hover:bg-[#8aa454]">
                      {publishing ? <Loader2 className="me-2 h-4 w-4 animate-spin" /> : <Send className="me-2 h-4 w-4" />}
                      {t('createCourse.publish')}
                    </Button>
                    <Button variant="outline" className="rounded-2xl border-[#5E6646]/20 font-black text-[#5E6646] hover:bg-[#F2EED9]">
                      <Save className="me-2 h-4 w-4" /> {t('createCourse.saveDraft')}
                    </Button>
                  </div>
                </>
              )}
            </div>
          )}

          {/* Upload media */}
          {tab === 'uploadMedia' && (
            <div className="animate-fade-in space-y-5">
              <header>
                <h2 className="text-lg font-black text-[#5E6646]">{t('uploadMedia.title')}</h2>
                <p className="text-sm font-medium text-[#5E6646]/70">{t('uploadMedia.subtitle')}</p>
              </header>

              <label className="block cursor-pointer rounded-[2rem] border-2 border-dashed border-[#9EB766]/40 bg-[#F2EED9]/40 p-12 text-center transition hover:bg-[#F2EED9]">
                <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-[#9EB766]/20">
                  <Upload className="h-8 w-8 text-[#9EB766]" />
                </div>
                <p className="mt-4 font-black text-[#5E6646]">{t('uploadMedia.dragDrop')}</p>
                <p className="mt-1 text-xs font-bold text-[#5E6646]/50">{t('uploadMedia.maxSize')}</p>
                <input type="file" className="hidden" multiple onChange={simulateUpload} />
              </label>

              <div className="space-y-3">
                {mediaItems.map((m, i) => (
                  <Card key={i} className="rounded-2xl border-0 bg-white/80 p-4 shadow-sm">
                    <div className="flex items-center gap-3">
                      <span className="grid h-10 w-10 place-items-center rounded-xl bg-[#9EB766]/20 text-[#9EB766]">
                        <FileVideo className="h-5 w-5" />
                      </span>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between">
                          <p className="truncate text-sm font-black text-[#5E6646]">{m.name}</p>
                          <span className="text-xs font-bold text-[#5E6646]/60">{m.size}</span>
                        </div>
                        <div className="mt-1 flex items-center gap-2">
                          <Progress value={m.progress} className="h-1.5 flex-1 bg-[#5E6646]/10" />
                          <span className="text-xs font-black text-[#9EB766]">
                            {isRtl ? m.progress.toLocaleString('fa-IR') : m.progress}%
                          </span>
                        </div>
                      </div>
                      {m.status === 'uploaded' && <CheckCircle2 className="h-5 w-5 text-[#9EB766]" />}
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Sales analytics */}
          {tab === 'sales' && (
            <div className="animate-fade-in space-y-5">
              <h2 className="text-lg font-black text-[#5E6646]">{t('sales.title')}</h2>

              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                {[
                  { label: t('sales.revenue'), value: '184.6M', color: 'bg-[#9EB766]/20 text-[#9EB766]' },
                  { label: t('sales.enrollments'), value: '4,920', color: 'bg-[#F1BD79]/30 text-[#F1BD79]' },
                  { label: t('sales.conversion'), value: '12.4%', color: 'bg-[#9EB766]/20 text-[#9EB766]' },
                ].map((s) => (
                  <Card key={s.label} className="rounded-[1.5rem] border-0 bg-white/80 p-4 shadow-sm">
                    <div className={`grid h-10 w-10 place-items-center rounded-xl ${s.color}`}>
                      <TrendingUp className="h-5 w-5" />
                    </div>
                    <p className="mt-3 text-2xl font-black text-[#5E6646]">{s.value}</p>
                    <p className="text-xs font-bold text-[#5E6646]/60">{s.label}</p>
                  </Card>
                ))}
              </div>

              <Card className="rounded-[2rem] border-0 bg-white/80 p-6 shadow-sm">
                <h3 className="mb-4 font-black text-[#5E6646]">{t('sales.monthlyRevenue')} (M Toman)</h3>
                <ResponsiveContainer width="100%" height={280}>
                  <BarChart data={teacherMonthlyRevenue.map((m) => ({ name: isRtl ? m.monthFa : m.month, revenue: m.revenue }))}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#5E6646" strokeOpacity={0.08} vertical={false} />
                    <XAxis dataKey="name" tick={{ fill: '#5E6646', fontSize: 12, fontWeight: 700 }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fill: '#5E6646', fontSize: 12, fontWeight: 700 }} axisLine={false} tickLine={false} />
                    <Tooltip
                      cursor={{ fill: '#9EB76620' }}
                      contentStyle={{ borderRadius: '1rem', border: 'none', boxShadow: '0 6px 24px rgba(0,0,0,0.08)', fontWeight: 'bold', color: '#5E6646' }}
                    />
                    <Bar dataKey="revenue" radius={[12, 12, 0, 0]} maxBarSize={48}>
                      {teacherMonthlyRevenue.map((_, i) => (
                        <Cell key={i} fill={i === teacherMonthlyRevenue.length - 1 ? '#9EB766' : '#F1BD79'} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </Card>

              <Card className="rounded-[2rem] border-0 bg-white/80 p-6 shadow-sm">
                <h3 className="mb-3 font-black text-[#5E6646]">{t('sales.topCourses')}</h3>
                <div className="space-y-2">
                  {teacherTopCourses.map((tc, i) => {
                    const c = courses.find((x) => x.slug === tc.slug);
                    if (!c) return null;
                    return (
                      <div key={tc.slug} className="flex items-center gap-3 rounded-2xl bg-[#F2EED9]/60 p-3">
                        <span className="grid h-8 w-8 flex-shrink-0 place-items-center rounded-full bg-[#5E6646] text-sm font-black text-white">
                          {isRtl ? (i + 1).toLocaleString('fa-IR') : i + 1}
                        </span>
                        <span className="text-2xl">{c.emoji}</span>
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-black text-[#5E6646]">{isRtl ? c.titleFa : c.titleEn}</p>
                          <p className="text-xs font-bold text-[#5E6646]/60">
                            {tc.students.toLocaleString(isRtl ? 'fa-IR' : 'en-US')} {tCommon('students')} · {isRtl ? tc.revenueLabel.replace(/,/g, '٬') : tc.revenueLabel} {tCommon('toman')}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </Card>
            </div>
          )}
      </DashboardLayout>
    </div>
  );
}
