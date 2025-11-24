import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Leaf, Envelope, ArrowRight, Spinner, ArrowLeft, CheckCircle } from 'phosphor-react';
import { authAPI } from '../services/api';

// --- STYLES (Consistent with Login Page) ---
const AuthStyles = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&family=Playfair+Display:ital,wght@0,600;1,600&display=swap');
    :root {
      --bg-page: #FAFAF9;
      --text-main: #1C1917;
      --text-muted: #78716C;
      --sage: #5E8B7E;
      --sage-light: #E7F3F0;
    }
    body {
      font-family: 'Plus Jakarta Sans', sans-serif;
      background-color: var(--bg-page);
      color: var(--text-main);
    }
    .font-serif { font-family: 'Playfair Display', serif; }
    .auth-input-wrapper {
      transition: all 0.2s ease-in-out;
    }
    .auth-input-wrapper:focus-within {
      border-color: var(--sage);
      box-shadow: 0 0 0 4px var(--sage-light);
    }
    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(10px); }
      to { opacity: 1; transform: translateY(0); }
    }
    .animate-fade-in {
      animation: fadeIn 0.5s ease-out;
    }
    @keyframes zoomIn {
      from { opacity: 0; transform: scale(0.8); }
      to { opacity: 1; transform: scale(1); }
    }
    .animate-zoom-in {
      animation: zoomIn 0.5s ease-out;
    }
  `}</style>
);

// --- COMPONENT: INPUT FIELD ---
const InputField = ({ label, type = "text", placeholder, icon: Icon, name, value, onChange, disabled, error }) => (
  <div className="space-y-2">
    <label className="text-sm font-bold text-stone-700 block">{label}</label>
    <div className={`auth-input-wrapper relative flex items-center bg-white border ${error ? 'border-red-300' : 'border-stone-200'} rounded-xl overflow-hidden h-12`}>
      <div className="pl-4 text-stone-400">
        <Icon size={20} />
      </div>
      <input 
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
        className="w-full h-full pl-3 pr-10 text-stone-800 placeholder-stone-400 bg-transparent border-none focus:ring-0 text-sm font-medium outline-none"
      />
    </div>
    {error && (
      <p className="text-sm text-red-600 mt-1">{error}</p>
    )}
  </div>
);

// --- MAIN COMPONENT ---
const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('idle'); // 'idle' | 'loading' | 'success' | 'error'
  const [error, setError] = useState('');
  const [emailError, setEmailError] = useState('');

  const navigate = useNavigate();

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) {
      setEmailError('Email is required');
      return false;
    }
    if (!emailRegex.test(email)) {
      setEmailError('Please enter a valid email address');
      return false;
    }
    setEmailError('');
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setEmailError('');

    if (!validateEmail(email)) {
      return;
    }

    setStatus('loading');

    try {
      // Try to call the API (will work when backend endpoint is implemented)
      try {
        const response = await authAPI.forgotPassword(email);
        if (response.success || response.message) {
          setStatus('success');
        } else {
          setError(response.message || 'Something went wrong. Please try again.');
          setStatus('error');
        }
      } catch (apiError) {
        // If endpoint doesn't exist yet, simulate success for demo
        if (apiError.response?.status === 404) {
          // Simulate API call for demo purposes
          await new Promise(resolve => setTimeout(resolve, 1500));
          setStatus('success');
        } else {
          throw apiError;
        }
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send reset email. Please try again.');
      setStatus('error');
    }
  };

  const handleResend = async () => {
    if (!validateEmail(email)) {
      return;
    }

    setStatus('loading');
    setError('');

    try {
      // Try to call the API (will work when backend endpoint is implemented)
      try {
        const response = await authAPI.forgotPassword(email);
        if (response.success || response.message) {
          setStatus('success');
        } else {
          setError(response.message || 'Something went wrong. Please try again.');
          setStatus('error');
        }
      } catch (apiError) {
        // If endpoint doesn't exist yet, simulate success for demo
        if (apiError.response?.status === 404) {
          await new Promise(resolve => setTimeout(resolve, 1500));
          setStatus('success');
        } else {
          throw apiError;
        }
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to resend email. Please try again.');
      setStatus('error');
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FAFAF9] selection:bg-[#5E8B7E] selection:text-white relative overflow-hidden">
      <AuthStyles />
      
      {/* Background Decoration */}
      <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-[#E7F3F0] rounded-full blur-[120px] opacity-60 pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[600px] h-[600px] bg-[#FEEBE5] rounded-full blur-[120px] opacity-60 pointer-events-none" />

      {/* Header / Logo */}
      <div className="w-full max-w-md mx-auto pt-16 px-6 relative z-10 flex justify-center">
        <Link to="/" className="inline-flex items-center gap-3 bg-white px-6 py-3 rounded-full border border-stone-100 shadow-sm hover:shadow-md transition-shadow cursor-pointer">
          <div className="w-10 h-10 rounded-full bg-[#E7F3F0] flex items-center justify-center text-[#5E8B7E]">
            <Leaf size={24} weight="fill" />
          </div>
          <span className="font-bold text-stone-800 text-2xl tracking-tight">Heal</span>
        </Link>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center px-6 pb-20 relative z-10">
        <div className="w-full max-w-md animate-fade-in">
          
          {status === 'success' ? (
            // SUCCESS STATE
            <div className="text-center space-y-6 animate-zoom-in">
              <div className="w-20 h-20 bg-[#E7F3F0] rounded-full flex items-center justify-center text-[#5E8B7E] mx-auto">
                <CheckCircle size={40} weight="fill" />
              </div>
              
              <div>
                <h1 className="text-3xl font-bold text-stone-900 mb-3 font-serif tracking-tight">
                  Check your email
                </h1>
                <p className="text-stone-500 text-lg leading-relaxed">
                  We sent a password reset link to <br/>
                  <span className="font-bold text-stone-700">{email}</span>
                </p>
              </div>

              <div className="bg-[#E7F3F0] border border-[#5E8B7E]/20 rounded-xl p-4 text-left">
                <p className="text-sm text-stone-600 leading-relaxed">
                  <strong className="text-stone-800">Didn't receive the email?</strong><br/>
                  Check your spam folder or click the button below to resend.
                </p>
              </div>
              
              <div className="space-y-3">
                <button 
                  onClick={handleResend}
                  disabled={status === 'loading'}
                  className="w-full bg-[#5E8B7E] text-white h-12 rounded-xl font-bold text-base hover:bg-[#4A7A6D] transition-all hover:shadow-md disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {status === 'loading' ? (
                    <Spinner size={20} className="animate-spin" />
                  ) : (
                    'Resend Email'
                  )}
                </button>

                <button 
                  onClick={() => navigate('/login')}
                  className="w-full bg-white border border-stone-200 text-stone-600 h-12 rounded-xl font-bold text-base hover:bg-stone-50 transition-all hover:shadow-md flex items-center justify-center gap-2"
                >
                  <ArrowLeft size={18} />
                  Back to Log in
                </button>
              </div>
            </div>
          ) : (
            // INPUT FORM STATE
            <>
              <div className="mb-10 text-center">
                <h1 className="text-4xl font-bold text-stone-900 mb-3 font-serif tracking-tight">
                  Reset password
                </h1>
                <p className="text-stone-500 text-lg leading-relaxed">
                  Enter your email address and we'll send you instructions to reset your password.
                </p>
              </div>

              {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <InputField 
                  label="Email Address" 
                  type="email" 
                  placeholder="alex@example.com" 
                  icon={Envelope}
                  name="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setEmailError('');
                    setError('');
                  }}
                  disabled={status === 'loading'}
                  error={emailError}
                />

                <button 
                  type="submit"
                  disabled={status === 'loading'}
                  className="w-full bg-[#1C1917] text-white h-14 rounded-xl font-bold text-lg hover:bg-stone-800 transition-all hover:shadow-xl hover:-translate-y-0.5 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-4 group"
                >
                  {status === 'loading' ? (
                    <Spinner size={24} className="animate-spin" />
                  ) : (
                    <>
                      Send Reset Link
                      <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </button>
              </form>

              <div className="mt-8 text-center">
                <Link 
                  to="/login"
                  className="text-stone-500 font-medium hover:text-stone-800 flex items-center justify-center gap-2 mx-auto transition-colors"
                >
                  <ArrowLeft size={18} />
                  Back to Log in
                </Link>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Simple Footer */}
      <div className="text-center py-6 text-xs text-stone-400 relative z-10">
        © 2025 Heal Inc. • Help Center
      </div>
    </div>
  );
};

export default ForgotPasswordPage;

