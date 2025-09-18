import React, { useState } from 'react';
import { authService } from '../../lib/services/auth.service';
import { useNavigate } from 'react-router-dom';

const isValidEmail = (email: string) => {
  const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(".+"))@(([^<>()[\]\\.,;:\s@\"]+\.)+[^<>()[\]\\.,;:\s@\"]{2,})$/i;
  return re.test(email);
};

const ForgetPassword: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!email || !isValidEmail(email)) {
      setError('Please enter a valid email address');
      return;
    }
    setSubmitting(true);
    try {
      await authService.forgetPassword(email);
      setSubmitting(false);
       localStorage.setItem('emailForVerification',email);

      navigate(`/code-verification?source=forgot`);
    } catch (err: any) {
      setError(err?.message || 'Failed to send reset link');
      setSubmitting(false);
    }
  };

  return (
    <main
      className="w-full min-h-screen flex flex-col items-center justify-center sm:px-4"
      style={{
        background: 'linear-gradient(270deg, #004ea8, #62c7c7)',
        backgroundRepeat: 'no-repeat',
        backgroundAttachment: 'fixed',
        minHeight: '100vh'
      }}
    >
      <div className="w-full max-w-md mx-auto bg-white p-6 rounded-lg shadow">
        <div className="text-center  mb-10">
                    <img src="/assets/images/logo.png" width={200} className="mx-auto" />
                    <div className="mt-5 space-y-2">
                        <h3 className="text-gray-800 text-2xl font-bold sm:text-3xl">Forgot Password</h3>
                    </div>
                </div>
        <p className="text-sm text-gray-500 mb-4">Enter your email and we'll send a password reset link.</p>

        <form noValidate onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Email Address</label>
            <input
              id="email"
              name="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter email address"
              className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${error ? 'border-red-300' : 'border-gray-200'}`}
            />
            {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
          </div>

          <div className="text-sm text-gray-500">Do not forget to check SPAM box.</div>

          <div>
            <button type="submit" disabled={submitting} className="w-full inline-flex justify-center items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-60">
              {submitting ? 'Sending...' : 'Send Password Reset Email'}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
};

export default ForgetPassword;



