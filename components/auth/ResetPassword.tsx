import React, { useEffect, useState, SyntheticEvent } from 'react';
import { useNavigate, useSearchParams, useLocation } from 'react-router-dom';
import { authService } from '../../lib/services/auth.service';
import { strengthIndicator, strengthColor } from '../../lib/password-strength';
import DialogModelTemplate from '../DialogModelTemplate';

export default function ResetPassword({ email: propEmail, resetPIN: propPin }: { email?: string; resetPIN?: string } = {}) {
  const navigate = (() => {
    try {
      // @ts-ignore
      return useNavigate();
    } catch {
      return (to: string) => (window.location.href = to);
    }
  })();

  let searchParams: URLSearchParams;
  try {
    const sp = useSearchParams();
    // @ts-ignore
    searchParams = sp instanceof URLSearchParams ? sp : new URLSearchParams(window.location.search);
  } catch {
    searchParams = new URLSearchParams(window.location.search);
  }

  const location = useLocation();
  const locState: any = (location && (location.state as any)) ?? {};

  // try resolution order: props -> query params -> location.state -> localStorage -> undefined
  const storedEmail = typeof window !== 'undefined' ? (localStorage.getItem('emailForVerification') ?? localStorage.getItem('emailForReset') ?? undefined) : undefined;
  const storedPin = typeof window !== 'undefined' ? (localStorage.getItem('resetPIN') ?? localStorage.getItem('resetPin') ?? undefined) : undefined;

  const email = propEmail ?? (searchParams.get('email') ?? locState?.email ?? storedEmail ?? undefined);
  const resetPIN = propPin ?? (searchParams.get('pin') ?? locState?.resetPIN ?? storedPin ?? undefined);

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [level, setLevel] = useState<{ label?: string; color?: string }>();
  const [rules, setRules] = useState({
    minLength: false,
    uppercase: false,
    lowercase: false,
    number: false,
    special: false
  });

  const rulesPassed = Object.values(rules).every(Boolean);

  useEffect(() => {
    try {
      const lvl = strengthIndicator(password);
      setLevel(strengthColor(lvl));
    } catch {
      setLevel(undefined);
    }
    // update strict rule checks
    setRules({
      minLength: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /[0-9]/.test(password),
      special: /[!@#$%^&*(),.?":{}|<>_+=\-\[\]\\;/~`]/.test(password)
    });
  }, [password]);

  const validate = () => {
  if (!password) return 'Password is required';
  if (!rules.minLength) return 'Password must be at least 8 characters';
  if (!rules.uppercase) return 'Password must contain an uppercase letter';
  if (!rules.lowercase) return 'Password must contain a lowercase letter';
  if (!rules.number) return 'Password must contain a number';
  if (!rules.special) return 'Password must contain a special character';
  if (password !== confirmPassword) return 'Passwords do not match';
  return null;
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setError(null);
    const v = validate();
    if (v) {
      setError(v);
      return;
    }
    setLoading(true);
    try {
      await authService.newPassword(email, password, resetPIN);
      setShowSuccessDialog(true);
    } catch (err: any) {
      setError(err?.message ?? 'Failed to reset password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main
      className="w-full min-h-screen flex items-center justify-center sm:px-4"
      style={{
        background: 'linear-gradient(270deg, #004ea8, #62c7c7)',
        backgroundRepeat: 'no-repeat',
        backgroundAttachment: 'fixed',
        minHeight: '100vh',
      }}
    >
      <div className="max-w-4xl w-full bg-white rounded-lg shadow-md overflow-hidden grid grid-cols-1 md:grid-cols-2">
        {/* Left: Form */}
        <div className="p-8">
          <h2 className="text-2xl font-semibold mb-2">Reset Password</h2>
          <p className="text-sm text-gray-600 mb-6">Please choose a new password{email ? ` for ${email}` : ''}.</p>

          <form onSubmit={handleSubmit} noValidate>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">New password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-300"
                  placeholder="Create a strong password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((s) => !s)}
                  className="absolute right-3 top-3 text-sm text-slate-600 hover:text-slate-800"
                >
                  {showPassword ? 'Hide' : 'Show'}
                </button>
              </div>

              {level && (
                <div className="mt-3">
                  <div style={{ background: level.color }} className="w-28 h-2 rounded" />
                </div>
              )}
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Confirm password</label>
              <input
                type={showPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-300"
                placeholder="Repeat your password"
              />
            </div>

            {error && <div className="text-sm text-red-600 mb-3">{error}</div>}

            <div className="mt-4 grid gap-3">
              <button
                type="submit"
                disabled={loading || !rulesPassed || password !== confirmPassword}
                className="w-full px-4 py-3 bg-blue-600 text-white rounded-lg disabled:opacity-60"
              >
                {loading ? 'Saving...' : 'Reset password'}
              </button>
              <button type="button" onClick={() => navigate('/login')} className="w-full px-4 py-3 border rounded-lg text-sm">
                Cancel
              </button>
            </div>
          </form>
        </div>

        {/* Right: Checklist */}
        <div className="p-8 bg-slate-50">
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="text-lg font-medium mb-4">Password requirements</h3>
            <p className="text-sm text-slate-600 mb-4">Your password should meet the following rules to make it stronger.</p>

            <ul className="space-y-3">
            <li className="flex items-start gap-3">
              <div className={`mt-1 w-4 h-4 rounded-full ${rules.minLength ? 'bg-green-600' : 'bg-gray-300'}`} />
              <div>
                <div className={`text-sm ${rules.minLength ? 'text-slate-800' : 'text-slate-500'}`}>At least 8 characters</div>
              </div>
            </li>

            <li className="flex items-start gap-3">
              <div className={`mt-1 w-4 h-4 rounded-full ${rules.uppercase ? 'bg-green-600' : 'bg-gray-300'}`} />
              <div>
                <div className={`text-sm ${rules.uppercase ? 'text-slate-800' : 'text-slate-500'}`}>An uppercase letter (A-Z)</div>
              </div>
            </li>

            <li className="flex items-start gap-3">
              <div className={`mt-1 w-4 h-4 rounded-full ${rules.lowercase ? 'bg-green-600' : 'bg-gray-300'}`} />
              <div>
                <div className={`text-sm ${rules.lowercase ? 'text-slate-800' : 'text-slate-500'}`}>A lowercase letter (a-z)</div>
              </div>
            </li>

            <li className="flex items-start gap-3">
              <div className={`mt-1 w-4 h-4 rounded-full ${rules.number ? 'bg-green-600' : 'bg-gray-300'}`} />
              <div>
                <div className={`text-sm ${rules.number ? 'text-slate-800' : 'text-slate-500'}`}>A number (0-9)</div>
              </div>
            </li>

            <li className="flex items-start gap-3">
              <div className={`mt-1 w-4 h-4 rounded-full ${rules.special ? 'bg-green-600' : 'bg-gray-300'}`} />
              <div>
                <div className={`text-sm ${rules.special ? 'text-slate-800' : 'text-slate-500'}`}>A special character (e.g., !@#$%)</div>
              </div>
            </li>
            </ul>

            <div className="mt-6 text-xs text-slate-600">Progress: {Math.round((Object.values(rules).filter(Boolean).length / 5) * 100)}%</div>
          </div>
        </div>
      </div>
      {showSuccessDialog && (
        <DialogModelTemplate
          isOpen={showSuccessDialog}
          onClose={() => {
            setShowSuccessDialog(false);
            navigate('/login');
          }}
        >
          <div className="p-6">
            <h3 className="text-lg font-medium text-gray-900">Password Reset Successfully</h3>
            <div className="mt-2">
              <p className="text-sm text-gray-500">Your password has been reset. You can now log in with your new password.</p>
            </div>
            <div className="mt-4">
              <button
                type="button"
                className="inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                onClick={() => {
                  setShowSuccessDialog(false);
                  navigate('/login');
                }}
              >
                Go to Login
              </button>
            </div>
          </div>
        </DialogModelTemplate>
      )}
    </main>
  );
}