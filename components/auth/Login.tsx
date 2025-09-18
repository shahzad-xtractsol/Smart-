import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { authService } from '../../lib/services/auth.service';

type LoginProps = {
    handleLogin?: () => void;
}

const Login: React.FC<LoginProps> = ({ handleLogin }) => {
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
            <div className="w-full space-y-6 text-gray-600 sm:max-w-md">
                <div className="bg-white shadow p-4 py-6 space-y-8 sm:p-6 sm:rounded-lg">
                <div className="text-center">
                    <img src="/assets/images/logo.png" width={200} className="mx-auto" />
                    <div className="mt-5 space-y-2">
                        <h3 className="text-gray-800 text-2xl font-bold sm:text-3xl">Welcome Back to Smart</h3>
                        <p className="">Log in to your account</p>
                    </div>
                </div>
                <div className="p-4 py-6 space-y-8 sm:p-6 sm:rounded-lg">
                <div className='flex justify-between mb-4'>
                    <div>Don't have an account</div>
                    <div><a href="/register" className="text-blue-800 underline hover:text-indigo-600">Register</a></div>
                </div>
                    <LoginForm onSuccess={handleLogin} />
                </div>
                <div className="text-center">
                    <a href="/forgot-password" className="hover:text-indigo-600">Forgot password?</a>
                </div>
            </div>
            </div>
        </main>
  )
}

export default Login

type LoginFormProps = {
    onSuccess?: () => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ onSuccess }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [fieldErrors, setFieldErrors] = useState<{ email?: string; password?: string }>({});
    const navigate = useNavigate();

    const validateEmail = (value: string) => {
        if (!value || !value.trim()) return 'Email is required';
        // Simple RFC 2822-ish regex
        const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@(([^<>()[\]\\.,;:\s@"]+\.)+[^<>()[\]\\.,;:\s@"]{2,})$/i;
        return re.test(value) ? undefined : 'Enter a valid email address';
    };

    const validatePassword = (value: string) => {
        if (!value) return 'Password is required';
        if (value.length < 8) return 'Password must be at least 8 characters';
        return undefined;
    };

    const runValidation = () => {
        const eErr = validateEmail(email);
        const pErr = validatePassword(password);
        setFieldErrors({ email: eErr, password: pErr });
        return !eErr && !pErr;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        if (!runValidation()) return;
        setSubmitting(true);
        try {
            const result = await authService.login(email.trim(), password);
            if (result) {
                setSubmitting(false);
                console.log('login success, navigating to /');
                if (onSuccess) onSuccess();
                navigate('/');
            }
        } catch (err: any) {
            setError(err?.message || 'Login failed');
            setSubmitting(false);
        }
    };

    const isFormValid = () => {
        return !!email && !!password && !fieldErrors.email && !fieldErrors.password;
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-5" noValidate>
            {error && <div className="text-sm text-red-600">{error}</div>}
            <div>
                <label className="font-medium">Email</label>
                <input
                    type="email"
                    value={email}
                    onChange={e => {
                        setEmail(e.target.value);
                        if (fieldErrors.email) setFieldErrors(fe => ({ ...fe, email: undefined }));
                    }}
                    onBlur={() => setFieldErrors(fe => ({ ...fe, email: validateEmail(email) }))}
                    required
                    className={`w-full mt-2 px-3 py-2 text-gray-500 bg-transparent outline-none border focus:border-indigo-600 shadow-sm rounded-lg ${fieldErrors.email ? 'border-red-300' : ''}`}
                />
                {fieldErrors.email && <div className="mt-1 text-xs text-red-600">{fieldErrors.email}</div>}
            </div>
            <div>
                <label className="font-medium">Password</label>
                <input
                    type="password"
                    value={password}
                    onChange={e => {
                        setPassword(e.target.value);
                        if (fieldErrors.password) setFieldErrors(fe => ({ ...fe, password: undefined }));
                    }}
                    onBlur={() => setFieldErrors(fe => ({ ...fe, password: validatePassword(password) }))}
                    required
                    className={`w-full mt-2 px-3 py-2 text-gray-500 bg-transparent outline-none border focus:border-indigo-600 shadow-sm rounded-lg ${fieldErrors.password ? 'border-red-300' : ''}`}
                />
                {fieldErrors.password && <div className="mt-1 text-xs text-red-600">{fieldErrors.password}</div>}
            </div>
            <button disabled={submitting || !isFormValid()} className="w-full px-4 py-2 text-white font-medium bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-600 rounded-lg duration-150 disabled:opacity-60">
                {submitting ? 'Signing in...' : 'Sign in'}
            </button>
        </form>
    );
};