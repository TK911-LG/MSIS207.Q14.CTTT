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
    <label className="text-sm font-bold text-primary block">{label}</label>
    <div className={`auth-input-wrapper relative flex items-center bg-elevated border ${error ? 'border-red-300' : 'border-primary'} rounded-xl overflow-hidden h-12`}>
      <div className="pl-4 pr-3 flex-shrink-0 text-secondary">
        <Icon size={20} />
      </div>
      <input 
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
        className="flex-1 h-full pr-4 text-primary placeholder-secondary bg-transparent border-none focus:ring-0 text-sm font-medium outline-none"
      />
    </div>
    {error && (
      <p className="text-sm text-red-600 mt-1">{error}</p>
    )}
  </div>
);

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
      try {
        const response = await authAPI.forgotPassword(email);
        if (response.success || response.message) {
          setStatus('success');
        } else {
          setError(response.message || 'Something went wrong. Please try again.');
          setStatus('error');
        }
      } catch (apiError) {
        if (apiError.response?.status === 404) {
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
      try {
        const response = await authAPI.forgotPassword(email);
        if (response.success || response.message) {
          setStatus('success');
        } else {
          setError(response.message || 'Something went wrong. Please try again.');
          setStatus('error');
        }
      } catch (apiError) {
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
    <div className="min-h-screen flex flex-col bg-primary selection:bg-accent-sage selection:text-inverse relative overflow-hidden" data-theme="light" style={{ backgroundColor: '#FAFAF9' }}>
      <AuthStyles />
      
      {/* Background Decoration */}
      <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-accent-sage-light rounded-full blur-[120px] opacity-60 pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[600px] h-[600px] bg-accent-clay-light rounded-full blur-[120px] opacity-60 pointer-events-none" />

      {/* Header / Logo */}
      <div className="w-full max-w-md mx-auto pt-16 px-6 relative z-10 flex justify-center">
        <Link to="/" className="inline-flex items-center gap-3 bg-white px-6 py-3 rounded-full shadow-sm hover:shadow-md transition-shadow cursor-pointer border border-stone-100">
          <div className="w-10 h-10 rounded-full bg-accent-sage-light flex items-center justify-center text-accent-sage">
            <Leaf size={24} weight="fill" />
          </div>
          <span className="font-bold text-primary text-2xl tracking-tight">Heal</span>
        </Link>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center px-6 pb-20 relative z-10">
        <div className="w-full max-w-md animate-fade-in">
          
          {status === 'success' ? (
            // SUCCESS STATE
            <div className="text-center space-y-6 animate-zoom-in">
              <div className="w-20 h-20 bg-accent-sage-light rounded-full flex items-center justify-center text-accent-sage mx-auto">
                <CheckCircle size={40} weight="fill" />
              </div>
              
              <div>
                <h1 className="text-3xl font-bold text-primary mb-3 font-serif tracking-tight">
                  Check your email
                </h1>
                <p className="text-secondary text-lg leading-relaxed">
                  We sent a password reset link to <br/>
                  <span className="font-bold text-primary">{email}</span>
                </p>
              </div>

              <div className="bg-accent-sage-light border border-accent-sage/20 rounded-xl p-4 text-left">
                <p className="text-sm text-secondary leading-relaxed">
                  <strong className="text-primary">Didn't receive the email?</strong><br/>
                  Check your spam folder or click the button below to resend.
                </p>
              </div>
              
              <div className="space-y-3">
                <button 
                  onClick={handleResend}
                  disabled={status === 'loading'}
                  className="w-full bg-accent-sage text-inverse h-12 rounded-xl font-bold text-base hover:opacity-90 transition-all hover:shadow-md disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {status === 'loading' ? (
                    <Spinner size={20} className="animate-spin" />
                  ) : (
                    'Resend Email'
                  )}
                </button>

                <button 
                  onClick={() => navigate('/login')}
                  className="w-full bg-elevated border border-primary text-secondary h-12 rounded-xl font-bold text-base hover:bg-tertiary transition-all hover:shadow-md flex items-center justify-center gap-2"
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
                <h1 className="text-4xl font-bold text-primary mb-3 font-serif tracking-tight">
                  Reset password
                </h1>
                <p className="text-secondary text-lg leading-relaxed">
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
                  className="w-full bg-primary text-inverse h-14 rounded-xl font-bold text-lg hover:opacity-90 transition-all hover:shadow-xl hover:-translate-y-0.5 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-4 group"
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
                  className="text-secondary font-medium hover:text-primary flex items-center justify-center gap-2 mx-auto transition-colors"
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
      <div className="text-center py-6 text-xs text-secondary relative z-10">
        © 2025 Heal Inc. • Help Center
      </div>
    </div>
  );
};

export default ForgotPasswordPage;

