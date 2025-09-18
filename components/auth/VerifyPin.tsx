import React, { useRef, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { authService } from '../../lib/services/auth.service';

type Props = { email?: string };

// Small, dependency-free 4-digit OTP input component
function OtpInputs({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const inputsRef = useRef<Array<HTMLInputElement | null>>([]);

  const handleChange = (index: number, v: string) => {
    const sanitized = v.replace(/[^0-9]/g, '').slice(0, 1);
    const chars = value.split('');
    // ensure length
    while (chars.length < 4) chars.push('');
    chars[index] = sanitized;
    const next = chars.join('');
    onChange(next);
    if (sanitized && inputsRef.current[index + 1]) {
      inputsRef.current[index + 1]!.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === 'Backspace') {
      const chars = value.split('');
      while (chars.length < 4) chars.push('');
      if (chars[index]) {
        chars[index] = '';
        onChange(chars.join(''));
      } else if (inputsRef.current[index - 1]) {
        inputsRef.current[index - 1]!.focus();
      }
    }
  };

  const digits = Array.from({ length: 4 }).map((_, i) => value[i] ?? '');

  return (
  <div className="grid grid-cols-4 gap-6">
      {digits.map((d, i) => (
        <input
          key={i}
          ref={(el) => { inputsRef.current[i] = el; }}
          inputMode="numeric"
          pattern="[0-9]*"
          maxLength={1}
          value={d}
          onChange={(e) => handleChange(i, e.target.value)}
          onKeyDown={(e) => handleKeyDown(e, i)}
          className="w-full h-20 text-center border bg-gray-100 text-2xl font-semibold py-2 rounded-lg shadow-inner placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:bg-white"
        />
      ))}
    </div>
  );
}

export default function VerifyPin(props: Props) {
  // useSearchParams/useNavigate from react-router-dom; fall back to window.search if not available
  let searchParams: URLSearchParams;
  try {
    const sp = useSearchParams();
    // useSearchParams returns an object with get() in react-router-dom v6 hooks; adapt if needed
    // We'll convert to URLSearchParams-like object
    // @ts-ignore
    searchParams = sp instanceof URLSearchParams ? sp : new URLSearchParams(window.location.search);
  } catch {
    searchParams = new URLSearchParams(window.location.search);
  }

  let navigate: (to: string) => void = (to) => (window.location.href = to);
  try {
    // @ts-ignore
    const n = useNavigate();
    navigate = n;
  } catch {
    // noop, fallback already set
  }

  // Resolve email from (in order): props, query param, localStorage 'emailForVerification', decoded user object in localStorage
  const emailFromQuery = searchParams.get('email');
  let email = props.email ?? emailFromQuery ?? '';
  if (!email) {
    try {
      const stored = localStorage.getItem('emailForVerification');
      if (stored) email = stored;
      else {
        const userRaw = localStorage.getItem('user');
        if (userRaw) {
          const userObj = JSON.parse(userRaw);
          email = userObj?.email ?? '';
        }
      }
    } catch {
      // ignore parse errors
    }
  }
  const source = searchParams.get('source') ?? undefined;

  const [otp, setOtp] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [resendSent, setResendSent] = useState(false);

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const code = otp.replace(/[^0-9]/g, '');
    if (code.length !== 4) {
      setError('Please enter the 4-digit code');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      if (source === 'forgot') {
        await authService.verifyPin(code, email);
         localStorage.setItem('resetPIN',code);
        navigate(`/reset-password`);
      } else {
        await authService.verifyEmail(code);
        navigate('/login');
      }
    } catch (err: any) {
      setError(err?.message ?? 'Verification failed');
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setLoading(true);
    setError(null);
    try {
      // use available resend endpoint on authService
      if (authService.resendPin) {
        await authService.resendPin(email);
      } else if (authService.forgetPassword) {
        await authService.forgetPassword(email);
      }
      setResendSent(true);
    } catch (err: any) {
      setError(err?.message ?? 'Failed to resend code');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main
      className="w-full min-h-screen flex flex-col items-center justify-center sm:px-4"
      style={{
        background: 'linear-gradient(270deg, #004ea8, #62c7c7)',
        backgroundRepeat: 'no-repeat',
        backgroundAttachment: 'fixed',
        minHeight: '100vh',
      }}
    >
      <div className="w-full max-w-md mx-auto bg-white p-6 rounded-lg shadow">
        <div className="text-center mb-6">
          <img src="/assets/images/logo.png" width={130} className="mx-auto" />
          <h2 className="text-2xl font-semibold mt-4">Enter Verification Code</h2>
          <p className="text-sm text-gray-500 mt-2">We sent a 4-digit verification code to <strong>{email || 'your email'}</strong>.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex justify-center">
            <div className="w-full max-w-md">
              <OtpInputs value={otp} onChange={(v) => setOtp((prev) => {
                // ensure length 4
                const chars = (prev || '').split('');
                const newChars = v.split('');
                for (let i = 0; i < 4; i++) chars[i] = newChars[i] ?? '';
                return chars.join('').slice(0, 4);
              })} />
            </div>
          </div>

          {error && <div className="text-sm text-red-600 mb-2 text-center">{error}</div>}

          <div className="space-y-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full px-4 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-md font-semibold disabled:opacity-60 transition-colors"
            >
              {loading ? 'Verifying...' : 'Verify Account'}
            </button>

            <div className="text-center">
              <button
                type="button"
                onClick={handleResend}
                disabled={loading}
                className="text-sm text-indigo-600 hover:underline"
              >
                {resendSent ? 'Code sent' : "Didn't receive code? Resend"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </main>
  );
}
