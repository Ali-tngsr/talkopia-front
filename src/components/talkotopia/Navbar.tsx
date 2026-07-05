'use client';

import { Globe2, BookOpen, ShoppingBag, GraduationCap, Shield, LogOut, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTranslations } from '@/lib/i18n';
import { useAppStore, type ViewKey } from '@/lib/store';
import { TakoMascot } from './TakoMascot';

export function Navbar() {
  const tNav = useTranslations('Nav');
  const tCommon = useTranslations('Common');
  const { locale, toggleLocale, navigate, view, openAuth, role, setRole } = useAppStore();
  const isRtl = locale === 'fa';

  const go = (v: ViewKey) => () => navigate(v);

  const navItems: { key: ViewKey; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { key: 'courses', label: tNav('courses'), icon: BookOpen },
    { key: 'student', label: tNav('student'), icon: GraduationCap },
    { key: 'teacher', label: tNav('teacher'), icon: Shield },
    { key: 'admin', label: tNav('admin'), icon: Shield },
  ];

  return (
    <nav className="sticky top-0 z-30 mx-auto max-w-7xl px-4 pt-4 sm:px-6 lg:px-8">
      <div className="flex items-center justify-between gap-4 rounded-[2rem] border border-[#5E6646]/10 bg-white/80 px-4 py-3 shadow-sm backdrop-blur-md md:px-6">
        <button
          onClick={go('home')}
          className="flex items-center gap-3 transition hover:opacity-80"
          aria-label={tNav('home')}
        >
          <span className="grid h-11 w-11 place-items-center rounded-2xl bg-[#F1BD79] shadow-sm">
            <TakoMascot size={32} animated={false} />
          </span>
          <span className="hidden flex-col leading-none sm:flex">
            <span className="text-lg font-black tracking-tight text-[#5E6646]">{tCommon('appName')}</span>
            <span className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#9EB766]">
              {tCommon('appTagline')}
            </span>
          </span>
        </button>

        <div className="hidden items-center gap-1 rounded-full bg-[#F2EED9]/75 px-2 py-1 text-sm font-bold text-[#5E6646]/80 lg:flex">
          <button
            onClick={go('home')}
            className={`flex items-center gap-1.5 rounded-full px-4 py-2 transition hover:bg-white hover:text-[#9EB766] ${view === 'home' ? 'bg-white text-[#9EB766] shadow-sm' : ''}`}
          >
            <Home className="h-4 w-4" /> {tNav('home')}
          </button>
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.key}
                onClick={go(item.key)}
                className={`flex items-center gap-1.5 rounded-full px-4 py-2 transition hover:bg-white hover:text-[#9EB766] ${view === item.key ? 'bg-white text-[#9EB766] shadow-sm' : ''}`}
              >
                <Icon className="h-4 w-4" /> {item.label}
              </button>
            );
          })}
          <button
            onClick={go('certificate')}
            className={`flex items-center gap-1.5 rounded-full px-4 py-2 transition hover:bg-white hover:text-[#9EB766] ${view === 'certificate' ? 'bg-white text-[#9EB766] shadow-sm' : ''}`}
          >
            <Shield className="h-4 w-4" /> {tNav('certificate')}
          </button>
        </div>

        <div className="flex items-center gap-2">
          {role !== 'guest' ? (
            <Button
              onClick={() => {
                setRole('guest');
                navigate('home');
              }}
              variant="ghost"
              className="hidden rounded-full px-4 font-bold text-[#5E6646] hover:bg-[#F2EED9] sm:inline-flex"
            >
              <LogOut className={`h-4 w-4 ${isRtl ? 'ml-1' : 'mr-1'}`} />
              {tNav('logout')}
            </Button>
          ) : (
            <>
              <Button
                onClick={() => openAuth('login')}
                variant="ghost"
                className="hidden rounded-full px-4 font-bold text-[#5E6646] hover:bg-[#F2EED9] sm:inline-flex"
              >
                {tNav('login')}
              </Button>
              <Button
                onClick={() => openAuth('register')}
                className="rounded-full bg-[#9EB766] px-5 font-black text-white shadow-sm hover:bg-[#8aa454]"
              >
                {tNav('signup')}
              </Button>
            </>
          )}
          <Button
            onClick={toggleLocale}
            variant="outline"
            className="rounded-full border-[#9EB766]/40 bg-white/80 px-3 font-black text-[#5E6646] hover:bg-[#F1BD79]/30"
            aria-label={tNav('languageAria')}
          >
            <Globe2 className="me-1 h-4 w-4" /> {tNav('language')}
          </Button>
        </div>
      </div>

      {/* Mobile nav row */}
      <div className="mt-2 flex items-center gap-1 overflow-x-auto rounded-full bg-white/70 px-2 py-1.5 text-xs font-bold text-[#5E6646] shadow-sm backdrop-blur-sm no-scrollbar lg:hidden">
        <button onClick={go('home')} className={`flex-shrink-0 rounded-full px-3 py-1.5 ${view === 'home' ? 'bg-[#9EB766] text-white' : ''}`}>{tNav('home')}</button>
        {navItems.map((item) => (
          <button key={item.key} onClick={go(item.key)} className={`flex-shrink-0 rounded-full px-3 py-1.5 ${view === item.key ? 'bg-[#9EB766] text-white' : ''}`}>
            {item.label}
          </button>
        ))}
        <button onClick={go('certificate')} className={`flex-shrink-0 rounded-full px-3 py-1.5 ${view === 'certificate' ? 'bg-[#9EB766] text-white' : ''}`}>
          {tNav('certificate')}
        </button>
      </div>
    </nav>
  );
}
