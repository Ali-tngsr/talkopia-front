'use client';

import { useState } from 'react';
import { Globe2, BookOpen, GraduationCap, Shield, LogOut, Home, Menu, X, Award } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { useTranslations } from '@/lib/i18n';
import { useAppStore, type ViewKey } from '@/lib/store';
import { TakoMascot } from './TakoMascot';

export function Navbar() {
  const tNav = useTranslations('Nav');
  const tCommon = useTranslations('Common');
  const { locale, toggleLocale, navigate, view, openAuth, role, setRole } = useAppStore();
  const isRtl = locale === 'fa';
  const [mobileOpen, setMobileOpen] = useState(false);

  const go = (v: ViewKey) => () => {
    navigate(v);
    setMobileOpen(false);
  };

  const navItems: { key: ViewKey; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { key: 'courses', label: tNav('courses'), icon: BookOpen },
    { key: 'student', label: tNav('student'), icon: GraduationCap },
    { key: 'teacher', label: tNav('teacher'), icon: Shield },
    { key: 'admin', label: tNav('admin'), icon: Shield },
    { key: 'certificate', label: tNav('certificate'), icon: Award },
  ];

  return (
    <nav className="sticky top-0 z-30 mx-auto max-w-7xl px-3 pt-3 sm:px-6 sm:pt-4 lg:px-8">
      <div className="flex items-center justify-between gap-2 rounded-[1.5rem] border border-[#5E6646]/10 bg-white/85 px-3 py-2.5 shadow-sm backdrop-blur-md sm:rounded-[2rem] sm:px-4 sm:py-3 md:px-6">
        {/* Logo */}
        <button
          onClick={go('home')}
          className="flex flex-shrink-0 items-center gap-2 transition hover:opacity-80 sm:gap-3"
          aria-label={tNav('home')}
        >
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-[#F1BD79] shadow-sm sm:h-11 sm:w-11 sm:rounded-2xl">
            <TakoMascot size={26} animated={false} />
          </span>
          <span className="hidden flex-col leading-none sm:flex">
            <span className="text-base font-black tracking-tight text-[#5E6646] lg:text-lg">{tCommon('appName')}</span>
            <span className="text-[9px] font-bold uppercase tracking-[0.22em] text-[#9EB766] lg:text-[10px]">
              {tCommon('appTagline')}
            </span>
          </span>
        </button>

        {/* Desktop nav */}
        <div className="hidden flex-1 items-center justify-center gap-1 rounded-full bg-[#F2EED9]/75 px-2 py-1 text-sm font-bold text-[#5E6646]/80 lg:flex">
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
        </div>

        {/* Right side actions */}
        <div className="flex flex-shrink-0 items-center gap-1.5 sm:gap-2">
          {role !== 'guest' ? (
            <Button
              onClick={() => {
                setRole('guest');
                navigate('home');
              }}
              variant="ghost"
              className="hidden rounded-full px-4 font-bold text-[#5E6646] hover:bg-[#F2EED9] md:inline-flex"
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
                className="rounded-full bg-[#9EB766] px-4 text-sm font-black text-white shadow-sm hover:bg-[#8aa454] sm:px-5"
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
            <Globe2 className="h-4 w-4 sm:me-1 sm:w-4" />
            <span className="hidden sm:inline">{tNav('language')}</span>
          </Button>

          {/* Mobile hamburger */}
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild>
              <Button
                variant="outline"
                className="rounded-full border-[#9EB766]/40 bg-white/80 p-2.5 text-[#5E6646] hover:bg-[#F1BD79]/30 lg:hidden"
                aria-label="Menu"
              >
                {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </Button>
            </SheetTrigger>
            <SheetContent side={isRtl ? 'right' : 'left'} className="w-[280px] border-0 bg-[#F2EED9] p-0">
              <SheetHeader className="p-0">
                <SheetTitle className="sr-only">{tNav('home')}</SheetTitle>
              </SheetHeader>
              <div className="flex flex-col gap-2 p-5 pt-8">
                {/* Logo in sheet */}
                <div className="mb-4 flex items-center gap-3 border-b border-[#5E6646]/10 pb-4">
                  <span className="grid h-11 w-11 place-items-center rounded-2xl bg-[#F1BD79] shadow-sm">
                    <TakoMascot size={32} animated={false} />
                  </span>
                  <div className="flex flex-col leading-none">
                    <span className="text-lg font-black tracking-tight text-[#5E6646]">{tCommon('appName')}</span>
                    <span className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#9EB766]">
                      {tCommon('appTagline')}
                    </span>
                  </div>
                </div>

                {/* Nav items */}
                <button
                  onClick={go('home')}
                  className={`flex items-center gap-3 rounded-2xl px-4 py-3.5 text-start font-black transition ${
                    view === 'home' ? 'bg-[#9EB766] text-white shadow-sm' : 'text-[#5E6646] hover:bg-white/60'
                  }`}
                >
                  <Home className="h-5 w-5" /> {tNav('home')}
                </button>
                {navItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.key}
                      onClick={go(item.key)}
                      className={`flex items-center gap-3 rounded-2xl px-4 py-3.5 text-start font-black transition ${
                        view === item.key ? 'bg-[#9EB766] text-white shadow-sm' : 'text-[#5E6646] hover:bg-white/60'
                      }`}
                    >
                      <Icon className="h-5 w-5" /> {item.label}
                    </button>
                  );
                })}

                {/* Auth actions in sheet */}
                <div className="mt-4 border-t border-[#5E6646]/10 pt-4">
                  {role !== 'guest' ? (
                    <button
                      onClick={() => {
                        setRole('guest');
                        navigate('home');
                        setMobileOpen(false);
                      }}
                      className="flex w-full items-center gap-3 rounded-2xl px-4 py-3.5 text-start font-black text-[#5E6646] transition hover:bg-white/60"
                    >
                      <LogOut className="h-5 w-5" /> {tNav('logout')}
                    </button>
                  ) : (
                    <div className="flex flex-col gap-2">
                      <Button
                        onClick={() => {
                          openAuth('login');
                          setMobileOpen(false);
                        }}
                        variant="outline"
                        className="rounded-2xl border-[#9EB766]/40 py-3 font-black text-[#5E6646] hover:bg-[#F1BD79]/30"
                      >
                        {tNav('login')}
                      </Button>
                      <Button
                        onClick={() => {
                          openAuth('register');
                          setMobileOpen(false);
                        }}
                        className="rounded-2xl bg-[#9EB766] py-3 font-black text-white hover:bg-[#8aa454]"
                      >
                        {tNav('signup')}
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
}
