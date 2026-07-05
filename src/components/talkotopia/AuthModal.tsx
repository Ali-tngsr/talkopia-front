'use client';

import { useState } from 'react';
import { X, Mail, Lock, User, GraduationCap, Shield, ArrowRight, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { useLocale, useTranslations } from '@/lib/i18n';
import { useAppStore } from '@/lib/store';
import { OTPInput } from '@/components/talkotopia/OTPInput';
import { TakoMascot } from '@/components/talkotopia/TakoMascot';

export function AuthModal() {
  const t = useTranslations('Auth');
  const locale = useLocale();
  const isRtl = locale === 'fa';
  const { authOpen, authMode, setAuthMode, closeAuth, setRole, navigate } = useAppStore();
  const [submitting, setSubmitting] = useState(false);

  // Local login form
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [role, setLocalRole] = useState<'student' | 'teacher'>('student');

  const close = () => closeAuth();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    await new Promise((r) => setTimeout(r, 600));
    setSubmitting(false);
    setRole(role === 'teacher' ? 'teacher' : 'student');
    close();
    navigate(role === 'teacher' ? 'teacher' : 'student');
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    await new Promise((r) => setTimeout(r, 800));
    setSubmitting(false);
    setAuthMode('otp');
  };

  const handleOtpComplete = async () => {
    setSubmitting(true);
    await new Promise((r) => setTimeout(r, 500));
    setSubmitting(false);
    setRole(role);
    close();
    navigate(role === 'teacher' ? 'teacher' : 'student');
  };

  const handleForgot = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    await new Promise((r) => setTimeout(r, 600));
    setSubmitting(false);
    setAuthMode('otp');
  };

  const mode = authMode;

  return (
    <Dialog open={authOpen} onOpenChange={(o) => !o && close()}>
      <DialogContent className="max-w-md overflow-hidden rounded-[2rem] border-0 p-0 shadow-2xl">
        {/* Top banner */}
        <div className="relative flex justify-center bg-gradient-to-br from-[#F1BD79]/40 via-[#F2EED9] to-[#9EB766]/30 px-6 pb-4 pt-8">
          <button
            onClick={close}
            className="absolute top-4 end-4 grid h-8 w-8 place-items-center rounded-full bg-white/70 text-[#5E6646] transition hover:bg-white"
            aria-label="Close"
          >
            <X className="h-4 w-4" />
          </button>
          <TakoMascot size={88} animated={false} />
        </div>

        <div className="px-6 pb-6 pt-2">
          <DialogHeader className="text-center">
            <DialogTitle className="text-2xl font-black text-[#5E6646]">
              {mode === 'login' && t('login.title')}
              {mode === 'register' && t('register.title')}
              {mode === 'otp' && t('otp.title')}
              {mode === 'forgot' && t('forgot.title')}
            </DialogTitle>
            <DialogDescription className="text-sm font-medium text-[#5E6646]/70">
              {mode === 'login' && t('login.subtitle')}
              {mode === 'register' && t('register.subtitle')}
              {mode === 'otp' && t('otp.subtitle')}
              {mode === 'forgot' && t('forgot.subtitle')}
            </DialogDescription>
          </DialogHeader>

          <div className="mt-5">
            {mode === 'login' && (
              <form onSubmit={handleLogin} className="space-y-3">
                <div className="relative">
                  <Mail className="pointer-events-none absolute top-1/2 -translate-y-1/2 start-3 h-4 w-4 text-[#5E6646]/40" />
                  <Input
                    type="text"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={t('login.emailPlaceholder')}
                    className="h-12 rounded-2xl border-[#9EB766]/30 bg-[#F2EED9]/40 ps-10 font-bold text-[#5E6646]"
                    required
                  />
                </div>
                <div className="relative">
                  <Lock className="pointer-events-none absolute top-1/2 -translate-y-1/2 start-3 h-4 w-4 text-[#5E6646]/40" />
                  <Input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder={t('login.passwordPlaceholder')}
                    className="h-12 rounded-2xl border-[#9EB766]/30 bg-[#F2EED9]/40 ps-10 font-bold text-[#5E6646]"
                    required
                  />
                </div>
                <div className="flex items-center justify-between">
                  <label className="flex cursor-pointer items-center gap-2 text-xs font-bold text-[#5E6646]">
                    <Checkbox className="border-[#9EB766] data-[state=checked]:bg-[#9EB766]" />
                    {t('login.rememberMe')}
                  </label>
                  <button type="button" onClick={() => setAuthMode('forgot')} className="text-xs font-black text-[#9EB766] hover:underline">
                    {t('login.forgotPassword')}
                  </button>
                </div>
                <Button type="submit" disabled={submitting} className="h-12 w-full rounded-2xl bg-[#9EB766] font-black text-white shadow-lg shadow-[#9EB766]/25 hover:bg-[#8aa454]">
                  {t('login.submit')}
                  <ArrowRight className={`ms-2 h-4 w-4 ${isRtl ? 'rotate-180' : ''}`} />
                </Button>
                <p className="pt-2 text-center text-sm font-bold text-[#5E6646]/70">
                  {t('login.noAccount')}{' '}
                  <button type="button" onClick={() => setAuthMode('register')} className="font-black text-[#9EB766] hover:underline">
                    {t('login.signupLink')}
                  </button>
                </p>
              </form>
            )}

            {mode === 'register' && (
              <form onSubmit={handleRegister} className="space-y-3">
                <div className="relative">
                  <User className="pointer-events-none absolute top-1/2 -translate-y-1/2 start-3 h-4 w-4 text-[#5E6646]/40" />
                  <Input
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder={t('register.fullNamePlaceholder')}
                    className="h-12 rounded-2xl border-[#9EB766]/30 bg-[#F2EED9]/40 ps-10 font-bold text-[#5E6646]"
                    required
                  />
                </div>
                <div className="relative">
                  <Mail className="pointer-events-none absolute top-1/2 -translate-y-1/2 start-3 h-4 w-4 text-[#5E6646]/40" />
                  <Input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={t('register.emailPlaceholder')}
                    className="h-12 rounded-2xl border-[#9EB766]/30 bg-[#F2EED9]/40 ps-10 font-bold text-[#5E6646]"
                    required
                  />
                </div>
                <div className="relative">
                  <Lock className="pointer-events-none absolute top-1/2 -translate-y-1/2 start-3 h-4 w-4 text-[#5E6646]/40" />
                  <Input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder={t('register.passwordPlaceholder')}
                    className="h-12 rounded-2xl border-[#9EB766]/30 bg-[#F2EED9]/40 ps-10 font-bold text-[#5E6646]"
                    required
                  />
                </div>
                <div>
                  <p className="mb-2 text-xs font-black uppercase tracking-wider text-[#5E6646]/60">{t('register.role')}</p>
                  <div className="grid grid-cols-2 gap-2">
                    {([
                      { id: 'student' as const, label: t('register.roleStudent'), icon: GraduationCap },
                      { id: 'teacher' as const, label: t('register.roleTeacher'), icon: Shield },
                    ]).map((r) => {
                      const Icon = r.icon;
                      return (
                        <button
                          key={r.id}
                          type="button"
                          onClick={() => setLocalRole(r.id)}
                          className={`flex items-center gap-2 rounded-2xl border-2 px-4 py-3 text-start text-xs font-black transition ${
                            role === r.id ? 'border-[#9EB766] bg-[#9EB766]/10 text-[#5E6646]' : 'border-[#5E6646]/10 bg-white text-[#5E6646]/70'
                          }`}
                        >
                          <Icon className="h-4 w-4" /> {r.label}
                        </button>
                      );
                    })}
                  </div>
                </div>
                <label className="flex cursor-pointer items-start gap-2 text-xs font-bold text-[#5E6646]">
                  <Checkbox className="mt-0.5 border-[#9EB766] data-[state=checked]:bg-[#9EB766]" required />
                  <span>{t('register.agree')}</span>
                </label>
                <Button type="submit" disabled={submitting} className="h-12 w-full rounded-2xl bg-[#9EB766] font-black text-white shadow-lg shadow-[#9EB766]/25 hover:bg-[#8aa454]">
                  {t('register.submit')}
                  <ArrowRight className={`ms-2 h-4 w-4 ${isRtl ? 'rotate-180' : ''}`} />
                </Button>
                <p className="pt-2 text-center text-sm font-bold text-[#5E6646]/70">
                  {t('register.haveAccount')}{' '}
                  <button type="button" onClick={() => setAuthMode('login')} className="font-black text-[#9EB766] hover:underline">
                    {t('register.loginLink')}
                  </button>
                </p>
              </form>
            )}

            {mode === 'otp' && (
              <div className="space-y-6">
                <OTPInput length={5} onComplete={handleOtpComplete} />
                <Button
                  onClick={handleOtpComplete}
                  disabled={submitting}
                  className="h-12 w-full rounded-2xl bg-[#9EB766] font-black text-white shadow-lg shadow-[#9EB766]/25 hover:bg-[#8aa454]"
                >
                  {submitting ? '...' : (
                    <>
                      <Send className="me-2 h-4 w-4" />
                      {t('otp.verify')}
                    </>
                  )}
                </Button>
                <button onClick={() => setAuthMode('login')} className="block w-full text-center text-xs font-bold text-[#5E6646]/60 hover:text-[#9EB766]">
                  {t('otp.back')}
                </button>
              </div>
            )}

            {mode === 'forgot' && (
              <form onSubmit={handleForgot} className="space-y-3">
                <div className="relative">
                  <Mail className="pointer-events-none absolute top-1/2 -translate-y-1/2 start-3 h-4 w-4 text-[#5E6646]/40" />
                  <Input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="h-12 rounded-2xl border-[#9EB766]/30 bg-[#F2EED9]/40 ps-10 font-bold text-[#5E6646]"
                    required
                  />
                </div>
                <Button type="submit" disabled={submitting} className="h-12 w-full rounded-2xl bg-[#9EB766] font-black text-white shadow-lg shadow-[#9EB766]/25 hover:bg-[#8aa454]">
                  {t('forgot.submit')}
                </Button>
                <button type="button" onClick={() => setAuthMode('login')} className="block w-full text-center text-xs font-bold text-[#5E6646]/60 hover:text-[#9EB766]">
                  {t('forgot.back')}
                </button>
              </form>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
