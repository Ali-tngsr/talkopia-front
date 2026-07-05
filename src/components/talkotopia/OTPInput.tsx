'use client';

import { useRef, useState, useEffect } from 'react';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';

interface OTPInputProps {
  length?: number;
  onComplete?: (code: string) => void;
}

export function OTPInput({ length = 5, onComplete }: OTPInputProps) {
  const [code, setCode] = useState('');
  const [secondsLeft, setSecondsLeft] = useState(60);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setSecondsLeft((s) => (s > 0 ? s - 1 : 0));
    }, 1000);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  useEffect(() => {
    if (code.length === length) {
      onComplete?.(code);
    }
  }, [code, length, onComplete]);

  const resend = () => {
    setSecondsLeft(60);
    setCode('');
  };

  return (
    <div className="flex flex-col items-center gap-6">
      <InputOTP
        value={code}
        maxLength={length}
        onChange={(v) => setCode(v)}
        className="gap-3"
      >
        <InputOTPGroup className="gap-3">
          {Array.from({ length }).map((_, i) => (
            <InputOTPSlot
              key={i}
              index={i}
              className="grid h-14 w-12 place-items-center rounded-2xl border-2 border-[#9EB766]/40 bg-white text-2xl font-black text-[#5E6646] shadow-sm focus:border-[#9EB766]"
            />
          ))}
        </InputOTPGroup>
      </InputOTP>

      <div className="text-sm font-bold text-[#5E6646]/70">
        {secondsLeft > 0 ? (
          <span>
            Didn&apos;t receive it? Resend in{' '}
            <span className="font-black text-[#9EB766]">{secondsLeft}s</span>
          </span>
        ) : (
          <button onClick={resend} className="font-black text-[#9EB766] hover:underline">
            Resend now
          </button>
        )}
      </div>
    </div>
  );
}
