'use client';

import { useState } from 'react';
import { ShieldCheck, Search, Award, Download, AlertCircle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { useLocale, useTranslations } from '@/lib/i18n';
import { verifyCertificate } from '@/lib/api';

type Result = null | { valid: true; id: string; holderEn: string; holderFa: string; courseEn: string; courseFa: string; issueDate: string; score: number } | { valid: false };

export function CertificatePage() {
  const t = useTranslations('Certificate');
  const locale = useLocale();
  const isRtl = locale === 'fa';
  const [id, setId] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<Result>(null);

  const verify = async () => {
    if (!id.trim()) return;
    setLoading(true);
    setResult(null);
    const data = await verifyCertificate(id.trim());
    setLoading(false);
    if (data) {
      setResult({ valid: true, id: id.trim().toUpperCase(), ...data });
    } else {
      setResult({ valid: false });
    }
  };

  return (
    <div className="animate-fade-in mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
      <header className="text-center">
        <div className="mx-auto grid h-16 w-16 place-items-center rounded-3xl bg-[#F1BD79]/30">
          <ShieldCheck className="h-8 w-8 text-[#5E6646]" />
        </div>
        <h1 className="mt-4 text-3xl font-black text-[#5E6646] sm:text-4xl">{t('title')}</h1>
        <p className="mt-2 text-base font-medium text-[#5E6646]/70">{t('subtitle')}</p>
      </header>

      <Card className="mt-8 rounded-[2rem] border-0 bg-white/85 p-6 shadow-sm">
        <div className="flex flex-col gap-3 sm:flex-row">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute top-1/2 -translate-y-1/2 start-4 h-5 w-5 text-[#5E6646]/40" />
            <Input
              value={id}
              onChange={(e) => setId(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && verify()}
              placeholder={t('placeholder')}
              className="h-14 rounded-2xl border-[#9EB766]/30 bg-[#F2EED9]/40 ps-12 text-base font-mono font-bold uppercase tracking-wider text-[#5E6646]"
            />
          </div>
          <Button
            onClick={verify}
            disabled={loading || !id.trim()}
            className="h-14 rounded-2xl bg-[#9EB766] px-6 font-black text-white shadow-lg shadow-[#9EB766]/25 hover:bg-[#8aa454] disabled:opacity-60"
          >
            {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <ShieldCheck className="me-2 h-5 w-5" />}
            {loading ? '' : t('verify')}
          </Button>
        </div>
        <p className="mt-2 text-center text-xs font-bold text-[#5E6646]/50">
          {isRtl ? 'نمونه: TKP-2026-00123 یا TKP-2026-00045' : 'Try: TKP-2026-00123 or TKP-2026-00045'}
        </p>
      </Card>

      {/* Result */}
      {result && (
        <div className="mt-6 animate-fade-in">
          {result.valid ? (
            <Card className="overflow-hidden rounded-[2rem] border-0 bg-white shadow-lg">
              {/* Header band */}
              <div className="bg-gradient-to-br from-[#9EB766] via-[#9EB766] to-[#5E6646] p-6 text-center text-white">
                <Award className="mx-auto h-12 w-12 text-[#F1BD79]" />
                <h2 className="mt-2 text-2xl font-black">{t('validTitle')}</h2>
              </div>
              <div className="p-6">
                {/* Certificate body */}
                <div className="rounded-2xl border-2 border-dashed border-[#F1BD79] bg-[#F2EED9]/40 p-6 text-center">
                  <p className="text-xs font-black uppercase tracking-[0.3em] text-[#9EB766]">
                    {isRtl ? 'گواهینامه تکمیل دوره' : 'Certificate of Completion'}
                  </p>
                  <p className="mt-2 text-sm font-bold text-[#5E6646]/70">{t('holder')}</p>
                  <p className="mt-1 text-2xl font-black text-[#5E6646]">
                    {isRtl ? result.holderFa : result.holderEn}
                  </p>
                  <p className="mt-4 text-sm font-bold text-[#5E6646]/70">{t('course')}</p>
                  <p className="text-lg font-black text-[#9EB766]">
                    {isRtl ? result.courseFa : result.courseEn}
                  </p>
                  <div className="mt-4 grid grid-cols-3 gap-2 text-xs font-bold">
                    <div>
                      <p className="text-[#5E6646]/60">{t('score')}</p>
                      <p className="text-base font-black text-[#5E6646]">{isRtl ? result.score.toLocaleString('fa-IR') : result.score}/100</p>
                    </div>
                    <div>
                      <p className="text-[#5E6646]/60">{t('issueDate')}</p>
                      <p className="text-base font-black text-[#5E6646]">{result.issueDate}</p>
                    </div>
                    <div>
                      <p className="text-[#5E6646]/60">{t('id')}</p>
                      <p className="text-xs font-black text-[#5E6646]">{result.id}</p>
                    </div>
                  </div>
                </div>
                <div className="mt-4 flex flex-col gap-2 sm:flex-row">
                  <Button className="flex-1 rounded-2xl bg-[#9EB766] font-black text-white hover:bg-[#8aa454]">
                    <Download className="me-2 h-4 w-4" /> {t('downloadPdf')}
                  </Button>
                  <Button
                    onClick={() => {
                      setResult(null);
                      setId('');
                    }}
                    variant="outline"
                    className="flex-1 rounded-2xl border-[#5E6646]/20 font-black text-[#5E6646] hover:bg-[#F2EED9]"
                  >
                    {t('tryAgain')}
                  </Button>
                </div>
              </div>
            </Card>
          ) : (
            <Card className="rounded-[2rem] border-2 border-red-200 bg-red-50/50 p-8 text-center">
              <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-red-100">
                <AlertCircle className="h-8 w-8 text-red-600" />
              </div>
              <h2 className="mt-4 text-2xl font-black text-red-700">{t('invalidTitle')}</h2>
              <p className="mt-2 max-w-md mx-auto font-medium text-red-600/80">{t('invalidBody')}</p>
              <Button
                onClick={() => {
                  setResult(null);
                  setId('');
                }}
                className="mt-4 rounded-full bg-[#9EB766] font-black text-white hover:bg-[#8aa454]"
              >
                {t('tryAgain')}
              </Button>
            </Card>
          )}
        </div>
      )}
    </div>
  );
}
