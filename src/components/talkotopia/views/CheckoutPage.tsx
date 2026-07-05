'use client';

import { useState } from 'react';
import { Trash2, ShoppingBag, ShieldCheck, Tag, CheckCircle2, Loader2, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { useLocale, useTranslations } from '@/lib/i18n';
import { useAppStore } from '@/lib/store';
import { createOrder, requestPayment, verifyPayment } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';

export function CheckoutPage() {
  const t = useTranslations('Checkout');
  const tCommon = useTranslations('Common');
  const locale = useLocale();
  const isRtl = locale === 'fa';
  const { cart, removeFromCart, clearCart, navigate, role, openAuth } = useAppStore();
  const { toast } = useToast();

  const [coupon, setCoupon] = useState('');
  const [discountApplied, setDiscountApplied] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'zarinpal' | 'wallet'>('zarinpal');
  const [processing, setProcessing] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const subtotal = cart.reduce((acc, item) => acc + item.price, 0);
  const discount = discountApplied ? Math.round(subtotal * 0.1) : 0;
  const fee = Math.round((subtotal - discount) * 0.02);
  const total = subtotal - discount + fee;

  const applyCoupon = () => {
    if (coupon.trim().toUpperCase() === 'TAKO10') {
      setDiscountApplied(true);
      setError(null);
    } else {
      setError(isRtl ? 'کد تخفیف نامعتبر است.' : 'Invalid coupon code.');
    }
  };

  const pay = async () => {
    // Require login
    if (role === 'guest') {
      openAuth('login');
      return;
    }
    // Need course IDs — cart items may have id from backend or fallback to slug
    const courseIds = cart.map((item) => item.id).filter(Boolean) as string[];
    if (courseIds.length === 0) {
      setError(isRtl
        ? 'سبد شما قدیمی است. لطفاً دوره‌ها را دوباره اضافه کنید.'
        : 'Your cart is stale. Please re-add courses.');
      return;
    }

    setProcessing(true);
    setError(null);
    try {
      // Step 1: create order
      const order = await createOrder({ course_ids: courseIds });

      // Step 2: request payment (Zarinpal)
      const payment = await requestPayment(order.id);

      // Step 3: in a real Zarinpal flow, redirect user to payment_url.
      // For MVP/dev the backend has a manual verify endpoint — we call it directly.
      if (payment.payment_url && !payment.payment_url.includes('localhost')) {
        // Real gateway — redirect
        window.location.href = payment.payment_url;
        return;
      }

      // Dev mode: call verify manually with the returned authority
      const result = await verifyPayment({
        authority: payment.authority,
        status: 'OK',
      });

      setSuccess(true);
      clearCart();
      toast({
        title: isRtl ? 'پرداخت موفق!' : 'Payment Successful!',
        description: isRtl ? `سفارش #${result.order.id.slice(0, 8)}` : `Order #${result.order.id.slice(0, 8)}`,
      });
      setTimeout(() => {
        setSuccess(false);
        navigate('student');
      }, 1800);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'پرداخت ناموفق بود.');
    } finally {
      setProcessing(false);
    }
  };

  if (success) {
    return (
      <div className="animate-fade-in grid min-h-[60vh] place-items-center px-4">
        <div className="text-center">
          <div className="mx-auto grid h-24 w-24 place-items-center rounded-full bg-[#9EB766]/20">
            <CheckCircle2 className="h-12 w-12 text-[#9EB766]" />
          </div>
          <h2 className="mt-6 text-3xl font-black text-[#5E6646]">
            {isRtl ? 'پرداخت موفق!' : 'Payment Successful!'}
          </h2>
          <p className="mt-2 font-medium text-[#5E6646]/70">
            {isRtl ? 'در حال انتقال به پنل دانش‌آموز...' : 'Redirecting to your student panel...'}
          </p>
        </div>
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div className="animate-fade-in grid min-h-[60vh] place-items-center px-4">
        <div className="text-center">
          <div className="mx-auto grid h-24 w-24 place-items-center rounded-full bg-[#F2EED9]">
            <ShoppingBag className="h-10 w-10 text-[#5E6646]/40" />
          </div>
          <h2 className="mt-6 text-2xl font-black text-[#5E6646]">{t('empty')}</h2>
          <p className="mt-2 max-w-sm font-medium text-[#5E6646]/70">{t('emptyDescription')}</p>
          <Button
            onClick={() => navigate('courses')}
            className="mt-6 rounded-full bg-[#9EB766] px-6 font-black text-white hover:bg-[#8aa454]"
          >
            {t('browseCourses')}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-fade-in mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
      <header className={isRtl ? 'text-right' : 'text-left'}>
        <h1 className="text-2xl font-black text-[#5E6646] sm:text-3xl lg:text-4xl">{t('title')}</h1>
      </header>

      {role === 'guest' && (
        <div className="mt-4 flex items-start gap-2 rounded-2xl border border-[#F1BD79]/40 bg-[#F1BD79]/10 p-3 text-sm font-bold text-[#5E6646]">
          <AlertCircle className="mt-0.5 h-4 w-4 flex-shrink-0" />
          <span>
            {isRtl
              ? 'برای تکمیل خرید باید وارد حساب کاربری شوید.'
              : 'Please sign in to complete your purchase.'}
          </span>
        </div>
      )}

      {error && (
        <div className="mt-4 flex items-start gap-2 rounded-2xl border border-red-200 bg-red-50 p-3 text-sm font-bold text-red-700">
          <AlertCircle className="mt-0.5 h-4 w-4 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <div className="mt-4 grid gap-4 sm:mt-6 sm:gap-6 lg:grid-cols-[1.5fr_1fr]">
        {/* Cart items */}
        <div className="space-y-3">
          {cart.map((item) => (
            <Card key={item.slug} className="flex items-center gap-3 rounded-[1.5rem] border-0 bg-white/80 p-3 shadow-sm sm:gap-4 sm:p-4">
              <div className="grid h-16 w-16 flex-shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-[#F1BD79]/40 to-[#9EB766]/40 text-3xl sm:h-20 sm:w-20 sm:text-4xl">
                {item.emoji}
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-black text-[#5E6646]">{item.title}</p>
                <p className="text-xs font-bold text-[#5E6646]/60">
                  {tCommon('teacher')}: {item.instructor} · {item.tag}
                </p>
                <p className="mt-1 text-sm font-black text-[#9EB766]">
                  {isRtl ? item.priceLabel.replace(/,/g, '٬') : item.priceLabel} {tCommon('toman')}
                </p>
              </div>
              <button
                onClick={() => removeFromCart(item.slug)}
                className="grid h-10 w-10 place-items-center rounded-full bg-[#F2EED9] text-[#5E6646]/60 transition hover:bg-red-100 hover:text-red-600"
                aria-label={t('remove')}
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </Card>
          ))}
        </div>

        {/* Order summary */}
        <div className="space-y-4">
          <Card className="rounded-[2rem] border-0 bg-white/90 p-6 shadow-sm">
            <h2 className="text-lg font-black text-[#5E6646]">{t('orderSummary')}</h2>

            {/* Coupon */}
            <div className="mt-4 flex gap-2">
              <div className="relative flex-1">
                <Tag className="pointer-events-none absolute top-1/2 -translate-y-1/2 start-3 h-4 w-4 text-[#5E6646]/40" />
                <Input
                  value={coupon}
                  onChange={(e) => setCoupon(e.target.value)}
                  placeholder={t('couponCode')}
                  className="rounded-xl border-[#9EB766]/30 bg-[#F2EED9]/40 ps-9 font-bold text-[#5E6646]"
                  disabled={discountApplied}
                />
              </div>
              <Button
                onClick={applyCoupon}
                disabled={discountApplied}
                className="rounded-xl bg-[#5E6646] font-black text-white hover:bg-[#4a5038]"
              >
                {discountApplied ? <CheckCircle2 className="h-4 w-4" /> : t('applyCoupon')}
              </Button>
            </div>
            {discountApplied && (
              <p className="mt-2 text-xs font-bold text-[#9EB766]">
                ✓ {isRtl ? 'کد «TAKO10» اعمال شد — ۱۰٪ تخفیف' : 'Code "TAKO10" applied — 10% off'}
              </p>
            )}

            {/* Totals */}
            <div className="mt-4 space-y-2 border-t border-dashed border-[#5E6646]/15 pt-4 text-sm font-bold">
              <div className="flex justify-between text-[#5E6646]/70">
                <span>{t('subtotal')}</span>
                <span>{isRtl ? subtotal.toLocaleString('fa-IR') : subtotal.toLocaleString()} {tCommon('toman')}</span>
              </div>
              {discountApplied && (
                <div className="flex justify-between text-[#9EB766]">
                  <span>{t('discount')} (10%)</span>
                  <span>- {isRtl ? discount.toLocaleString('fa-IR') : discount.toLocaleString()} {tCommon('toman')}</span>
                </div>
              )}
              <div className="flex justify-between text-[#5E6646]/70">
                <span>{t('tax')} (2%)</span>
                <span>+ {isRtl ? fee.toLocaleString('fa-IR') : fee.toLocaleString()} {tCommon('toman')}</span>
              </div>
              <div className="flex justify-between border-t border-[#5E6646]/15 pt-3 text-base font-black text-[#5E6646]">
                <span>{t('total')}</span>
                <span>{isRtl ? total.toLocaleString('fa-IR') : total.toLocaleString()} {tCommon('toman')}</span>
              </div>
            </div>
          </Card>

          {/* Payment method */}
          <Card className="rounded-[2rem] border-0 bg-white/90 p-6 shadow-sm">
            <h3 className="mb-3 text-sm font-black uppercase tracking-wider text-[#5E6646]/60">{t('paymentMethod')}</h3>
            <div className="space-y-2">
              {([
                { id: 'zarinpal' as const, label: t('zarinpal'), emoji: '💳' },
                { id: 'wallet' as const, label: t('wallet'), emoji: '👛' },
              ]).map((m) => (
                <button
                  key={m.id}
                  onClick={() => setPaymentMethod(m.id)}
                  className={`flex w-full items-center justify-between rounded-2xl border-2 px-4 py-3 text-start transition ${
                    paymentMethod === m.id
                      ? 'border-[#9EB766] bg-[#9EB766]/10'
                      : 'border-[#5E6646]/10 bg-white'
                  }`}
                >
                  <span className="flex items-center gap-2 font-black text-[#5E6646]">
                    <span className="text-xl">{m.emoji}</span>
                    {m.label}
                  </span>
                  <span className={`grid h-5 w-5 place-items-center rounded-full border-2 ${
                    paymentMethod === m.id ? 'border-[#9EB766] bg-[#9EB766]' : 'border-[#5E6646]/20'
                  }`}>
                    {paymentMethod === m.id && <CheckCircle2 className="h-3 w-3 text-white" />}
                  </span>
                </button>
              ))}
            </div>

            <Button
              onClick={pay}
              disabled={processing || role === 'guest'}
              className="mt-4 w-full rounded-2xl bg-[#9EB766] py-3 font-black text-white shadow-lg shadow-[#9EB766]/25 hover:bg-[#8aa454] disabled:opacity-70"
            >
              {processing ? (
                <>
                  <Loader2 className="me-2 h-4 w-4 animate-spin" />
                  {tCommon('loading')}
                </>
              ) : (
                <>
                  <ShieldCheck className="me-2 h-4 w-4" />
                  {t('completePayment')}
                </>
              )}
            </Button>
            <p className="mt-3 flex items-center justify-center gap-1 text-xs font-bold text-[#5E6646]/50">
              <ShieldCheck className="h-3 w-3" /> {t('securePayment')}
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
}
