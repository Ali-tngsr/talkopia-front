'use client';

import { Download, FileText, Image as ImageIcon, ArrowLeft, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useLocale, useTranslations } from '@/lib/i18n';
import { useAppStore } from '@/lib/store';
import { TakoMascot } from '@/components/talkotopia/TakoMascot';

interface DownloadFile {
  name: string;
  description: string;
  descriptionFa: string;
  url: string;
  size: string;
  type: 'md' | 'png';
  emoji: string;
}

const FILES: DownloadFile[] = [
  {
    name: 'Takofi_Mascot_Prompts.md',
    description: 'All mascot prompts in one file (8 KB)',
    descriptionFa: 'تمام پرامپت‌های ماسکات در یک فایل (۸ کیلوبایت)',
    url: '/downloads/Takofi_Mascot_Prompts.md',
    size: '8 KB',
    type: 'md',
    emoji: '📝',
  },
  {
    name: 'takofi-plush-front.png',
    description: 'Plush toy version — for physical product',
    descriptionFa: 'نسخه عروسک پلاش — برای محصول فیزیکی',
    url: '/downloads/mascots/takofi-plush-front.png',
    size: '116 KB',
    type: 'png',
    emoji: '🧸',
  },
  {
    name: 'takofi-character-3d.png',
    description: '3D Pixar-style character — for hero section',
    descriptionFa: 'کاراکتر 3D به سبک پیکسار — برای صفحه اصلی',
    url: '/downloads/mascots/takofi-character-3d.png',
    size: '101 KB',
    type: 'png',
    emoji: '🎬',
  },
  {
    name: 'takofi-flat-logo.png',
    description: 'Flat vector logo — for app icon & favicon',
    descriptionFa: 'لوگو فلت — برای آیکون اپ و فاوآیکون',
    url: '/downloads/mascots/takofi-flat-logo.png',
    size: '72 KB',
    type: 'png',
    emoji: '✏️',
  },
];

export function DownloadsPage() {
  const locale = useLocale();
  const isRtl = locale === 'fa';
  const { navigate } = useAppStore();

  return (
    <div className="animate-fade-in mx-auto max-w-4xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
      <button
        onClick={() => navigate('home')}
        className="mb-4 inline-flex items-center gap-1.5 text-sm font-bold text-[#5E6646]/60 transition hover:text-[#9EB766]"
      >
        <ArrowLeft className={`h-4 w-4 ${isRtl ? 'rotate-180' : ''}`} />
        {isRtl ? 'بازگشت به خانه' : 'Back to Home'}
      </button>

      <header className="text-center">
        <div className="mx-auto mb-3">
          <TakoMascot size={100} />
        </div>
        <h1 className="text-3xl font-black text-[#5E6646] sm:text-4xl">
          {isRtl ? '📥 دانلود فایل‌های Takofi' : '📥 Takofi Downloads'}
        </h1>
        <p className="mt-2 text-base font-medium text-[#5E6646]/70">
          {isRtl
            ? 'ماسکات رسمی Talkotopia — پرامپت‌ها و تصاویر نمونه'
            : 'Official Talkotopia mascot — prompts and sample images'}
        </p>
      </header>

      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        {FILES.map((file) => (
          <Card
            key={file.name}
            className="group overflow-hidden rounded-[2rem] border-0 bg-white/80 p-5 shadow-sm ring-1 ring-[#5E6646]/8 transition hover:shadow-lg hover:ring-[#9EB766]/30"
          >
            <div className="flex items-start gap-3">
              <span className="grid h-12 w-12 flex-shrink-0 place-items-center rounded-2xl bg-[#F1BD79]/30 text-2xl">
                {file.emoji}
              </span>
              <div className="min-w-0 flex-1">
                <h3 className="truncate text-sm font-black text-[#5E6646]">{file.name}</h3>
                <p className="mt-1 text-xs font-medium text-[#5E6646]/60">
                  {isRtl ? file.descriptionFa : file.description}
                </p>
                <div className="mt-2 flex items-center gap-2">
                  <span className="rounded-full bg-[#F2EED9] px-2 py-0.5 text-[10px] font-black uppercase text-[#9EB766]">
                    {file.type.toUpperCase()}
                  </span>
                  <span className="text-[10px] font-bold text-[#5E6646]/50">{file.size}</span>
                </div>
              </div>
            </div>

            {/* Preview for images */}
            {file.type === 'png' && (
              <div className="mt-3 overflow-hidden rounded-2xl bg-[#F2EED9]/60 p-2">
                <img
                  src={file.url}
                  alt={file.name}
                  className="mx-auto h-32 w-full rounded-xl object-contain"
                  loading="lazy"
                />
              </div>
            )}

            <div className="mt-4 flex gap-2">
              <a
                href={file.url}
                download={file.name}
                className="flex flex-1 items-center justify-center gap-2 rounded-full bg-[#9EB766] py-2.5 text-xs font-black text-white shadow-sm transition hover:bg-[#8aa454]"
              >
                <Download className="h-4 w-4" />
                {isRtl ? 'دانلود' : 'Download'}
              </a>
              <a
                href={file.url}
                target="_blank"
                rel="noopener noreferrer"
                className="grid h-9 w-9 flex-shrink-0 place-items-center rounded-full bg-[#F2EED9] text-[#5E6646] transition hover:bg-[#9EB766]/20"
                aria-label="Open in new tab"
              >
                <ExternalLink className="h-4 w-4" />
              </a>
            </div>
          </Card>
        ))}
      </div>

      {/* Quick stats */}
      <Card className="mt-6 rounded-[2rem] border-0 bg-[#5E6646] p-6 text-white shadow-lg">
        <h2 className="text-lg font-black">
          {isRtl ? '🎯 درباره Takofi' : '🎯 About Takofi'}
        </h2>
        <p className="mt-2 text-sm font-medium leading-7 text-white/80">
          {isRtl
            ? 'Takofi ترکیبی از روباه و هشت‌پاست — نماد یادگیرنده‌ی همه‌جانبه که می‌تونه همزمان ۸ کار انجام بده. این ماسکات طوری طراحی شده که هم دیجیتال استفاده بشه، هم به‌عنوان عروسک فیزیکی قابل فروش باشه.'
            : 'Takofi is a hybrid of fox and octopus — a symbol of a multi-talented learner who can do 8 things at once. Designed to work both digitally and as a sellable physical plush toy.'}
        </p>
        <div className="mt-4 flex flex-wrap gap-3 text-xs font-bold">
          <span className="rounded-full bg-white/10 px-3 py-1.5">🦊 Fox face</span>
          <span className="rounded-full bg-white/10 px-3 py-1.5">🐙 Octopus body</span>
          <span className="rounded-full bg-white/10 px-3 py-1.5">🧣 Cream scarf</span>
          <span className="rounded-full bg-white/10 px-3 py-1.5">🎨 Brand palette</span>
        </div>
      </Card>
    </div>
  );
}
