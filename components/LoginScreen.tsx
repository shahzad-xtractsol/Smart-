import React, { useState, useRef, useEffect } from 'react';
import { MOCK_USERS } from '../constants';
import type { User } from '../types';
import { EnvelopeIcon, KeyIcon, ArrowLeftIcon, CheckCircleIcon, RefreshIcon } from './icons';

interface LoginScreenProps {
  onLogin: (user: User) => void;
}

const AuthLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 p-4 font-sans">
        <div className="w-full max-w-md">
            <div className="flex justify-center mb-8">
                <svg width="80" height="50" viewBox="0 0 125 80" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="62.5" cy="40" r="37.5" stroke="#3B82F6" strokeWidth="5"/>
                    <path d="M36.0156 50.5C36.0156 50.5 44.8164 37.3125 57.2656 37.3125C69.7148 37.3125 75.3281 48.0625 75.3281 48.0625M70.4766 43.8125C70.4766 43.8125 77.0703 30.125 89.8438 30.125C102.617 30.125 106.734 43.8125 106.734 43.8125" stroke="#3B82F6" strokeWidth="5" strokeLinecap="round"/>
                    <path d="M25 43.5156L31.5 40.8906" stroke="#3B82F6" strokeWidth="5" strokeLinecap="round"/>
                </svg>
            </div>
            <div className="p-8 space-y-6 bg-white rounded-2xl shadow-lg">
                {children}
            </div>
        </div>
    </div>
);

const FormInput: React.FC<{ id: string, label: string, type: string, value: string, onChange: (e: React.ChangeEvent<HTMLInputElement>) => void, icon: React.ReactNode, autoComplete?: string }> = 
({ id, label, type, value, onChange, icon, autoComplete }) => (
    <div>
        <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
        <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                {icon}
            </div>
            <input
                id={id}
                name={id}
                type={type}
                value={value}
                onChange={onChange}
                autoComplete={autoComplete}
                required
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
        </div>
    </div>
);

const SubmitButton: React.FC<{ isLoading: boolean, text: string }> = ({ isLoading, text }) => (
    <button
        type="submit"
        disabled={isLoading}
        className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-400 disabled:cursor-not-allowed"
    >
        {isLoading ? <RefreshIcon className="w-5 h-5 animate-spin" /> : text}
    </button>
);

const PinInput: React.FC<{ pin: string[], setPin: React.Dispatch<React.SetStateAction<string[]>>, onPinComplete: (pin: string) => void }> = ({ pin, setPin, onPinComplete }) => {
    const inputsRef = useRef<(HTMLInputElement | null)[]>([]);

    useEffect(() => {
        inputsRef.current[0]?.focus();
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
        const { value } = e.target;
        if (!/^[0-9]$/.test(value) && value !== '') return;

        const newPin = [...pin];
        newPin[index] = value;
        setPin(newPin);

        if (value !== '' && index < pin.length - 1) {
            inputsRef.current[index + 1]?.focus();
        }

        if (newPin.every(digit => digit !== '')) {
            onPinComplete(newPin.join(''));
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
        if (e.key === 'Backspace' && pin[index] === '' && index > 0) {
            inputsRef.current[index - 1]?.focus();
        }
    };
    
    const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
        e.preventDefault();
        const pastedData = e.clipboardData.getData('text').slice(0, pin.length);
        if (/^[0-9]+$/.test(pastedData)) {
            const newPin = [...pin];
            for (let i = 0; i < pastedData.length; i++) {
                newPin[i] = pastedData[i];
            }
            setPin(newPin);
            if (newPin.every(digit => digit !== '')) {
                onPinComplete(newPin.join(''));
            }
        }
    };


    return (
        <div className="flex justify-center space-x-2" onPaste={handlePaste}>
            {pin.map((digit, index) => (
                <input
                    key={index}
                    // FIX: The ref callback should not return a value. Changed to a block body to ensure a void return type.
                    ref={el => { inputsRef.current[index] = el; }}
                    type="tel"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleChange(e, index)}
                    onKeyDown={(e) => handleKeyDown(e, index)}
                    className="w-12 h-14 text-center text-2xl font-semibold border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
            ))}
        </div>
    );
};

export const LoginScreen: React.FC<LoginScreenProps> = ({ onLogin }) => {
    const [view, setView] = useState<'login' | 'forgotPassword' | 'emailSent' | 'pinCode'>('login');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [pin, setPin] = useState<string[]>(Array(6).fill(''));
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleLoginSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');
        // Simulate API call
        setTimeout(() => {
            const user = MOCK_USERS.find(u => u.email?.toLowerCase() === email.toLowerCase());
            // Using a mock password for demonstration purposes
            if (user && password === 'password123') {
                onLogin(user);
            } else {
                setError('Invalid email or password. Please try again.');
                setIsLoading(false);
            }
        }, 1000);
    };

    const handleForgotPasswordSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');
        setTimeout(() => {
            const userExists = MOCK_USERS.some(u => u.email?.toLowerCase() === email.toLowerCase());
            if (userExists) {
                setView('emailSent');
            } else {
                setError('No account found with that email address.');
            }
            setIsLoading(false);
        }, 1000);
    };

    const handleVerifyPin = (finalPin: string) => {
        setIsLoading(true);
        setError('');
        setTimeout(() => {
            // Using a mock PIN for demonstration
            if (finalPin === '123456') {
                const user = MOCK_USERS.find(u => u.email?.toLowerCase() === email.toLowerCase());
                if(user) {
                    // In a real app, you'd navigate to a 'reset password' screen.
                    // For this demo, we'll log them in.
                    onLogin(user);
                } else {
                     setError('An unexpected error occurred. Please try again.');
                     setIsLoading(false);
                }
            } else {
                setError('Invalid security code. Please try again.');
                setPin(Array(6).fill(''));
                setIsLoading(false);
            }
        }, 1000);
    };

    const handleBackToLogin = () => {
        setView('login');
        setError('');
        setEmail('');
        setPassword('');
    };
    
    const renderLogin = () => (
        <>
            <div className="text-center">
                <h1 className="text-2xl font-bold text-gray-900">Welcome Back</h1>
                <p className="mt-2 text-sm text-gray-600">Please enter your details to sign in.</p>
            </div>
            <form onSubmit={handleLoginSubmit} className="space-y-4">
                <FormInput id="email" label="Email" type="email" value={email} onChange={e => setEmail(e.target.value)} icon={<EnvelopeIcon className="w-5 h-5 text-gray-400" />} autoComplete="email" />
                <div>
                    <FormInput id="password" label="Password" type="password" value={password} onChange={e => setPassword(e.target.value)} icon={<KeyIcon className="w-5 h-5 text-gray-400" />} autoComplete="current-password" />
                    <div className="text-right mt-1">
                        <button type="button" onClick={() => setView('forgotPassword')} className="text-sm font-medium text-blue-600 hover:text-blue-500">Forgot Password?</button>
                    </div>
                </div>
                {error && <p className="text-sm text-red-600 bg-red-50 p-3 rounded-md">{error}</p>}
                <SubmitButton isLoading={isLoading} text="Sign In" />
            </form>
        </>
    );

    const renderForgotPassword = () => (
        <>
            <div className="text-center">
                 <button onClick={handleBackToLogin} className="flex items-center text-sm text-gray-600 hover:text-gray-900 mb-4">
                    <ArrowLeftIcon className="w-4 h-4 mr-2" />
                    Back to login
                </button>
                <h1 className="text-2xl font-bold text-gray-900">Forgot Password?</h1>
                <p className="mt-2 text-sm text-gray-600">Enter your email and we'll send you instructions to reset your password.</p>
            </div>
            <form onSubmit={handleForgotPasswordSubmit} className="space-y-4">
                <FormInput id="email-forgot" label="Email" type="email" value={email} onChange={e => setEmail(e.target.value)} icon={<EnvelopeIcon className="w-5 h-5 text-gray-400" />} autoComplete="email" />
                {error && <p className="text-sm text-red-600 bg-red-50 p-3 rounded-md">{error}</p>}
                <SubmitButton isLoading={isLoading} text="Send Instructions" />
            </form>
        </>
    );

    const renderEmailSent = () => (
        <div className="text-center">
            <CheckCircleIcon className="w-16 h-16 text-teal-500 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-gray-900">Check your email</h1>
            <p className="mt-2 text-sm text-gray-600">We've sent a password reset link to <span className="font-semibold text-gray-800">{email}</span>.</p>
             <p className="mt-2 text-xs text-gray-500">For this demo, click below to proceed.</p>
            <div className="mt-6 space-y-3">
                 <button onClick={() => setView('pinCode')} className="w-full py-2.5 px-4 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700">
                    Enter Verification Code
                </button>
                <button onClick={handleBackToLogin} className="text-sm font-medium text-gray-600 hover:text-gray-900">
                    Back to login
                </button>
            </div>
        </div>
    );

    const renderPinCode = () => (
         <>
            <div className="text-center">
                 <button onClick={() => setView('forgotPassword')} className="flex items-center text-sm text-gray-600 hover:text-gray-900 mb-4">
                    <ArrowLeftIcon className="w-4 h-4 mr-2" />
                    Back
                </button>
                <h1 className="text-2xl font-bold text-gray-900">Enter Security Code</h1>
                <p className="mt-2 text-sm text-gray-600">Please check <span className="font-semibold text-gray-800">{email}</span> for a message with your code.</p>
            </div>
            <div className="space-y-6">
                <PinInput pin={pin} setPin={setPin} onPinComplete={handleVerifyPin} />
                {error && <p className="text-sm text-center text-red-600 bg-red-50 p-3 rounded-md">{error}</p>}
                 <div className="text-center">
                    {isLoading ? (
                        <div className="flex justify-center items-center text-gray-600">
                             <RefreshIcon className="w-5 h-5 animate-spin mr-2" />
                             <span>Verifying...</span>
                        </div>
                    ) : (
                         <p className="text-sm text-gray-500">Didn't receive a code? <button className="font-medium text-blue-600 hover:text-blue-500">Resend</button></p>
                    )}
                </div>
            </div>
        </>
    );

    const renderContent = () => {
        switch (view) {
            case 'login': return renderLogin();
            case 'forgotPassword': return renderForgotPassword();
            case 'emailSent': return renderEmailSent();
            case 'pinCode': return renderPinCode();
            default: return renderLogin();
        }
    };
    
    return <AuthLayout>{renderContent()}</AuthLayout>;
};