import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Leaf, Envelope, Lock, User, ArrowRight, Eye, EyeSlash, Spinner } from 'phosphor-react';

// --- STYLES ---
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
  `}</style>
);

// --- COMPONENTS ---
const InputField = ({ label, type = "text", placeholder, icon: Icon, name, value, onChange, disabled, showPassword, onTogglePassword }) => {
  const isPassword = type === "password";
  const inputType = isPassword ? (showPassword ? "text" : "password") : type;

  return (
    <div className="space-y-2">
      <label className="text-sm font-bold text-stone-700 block">{label}</label>
      <div className="auth-input-wrapper relative flex items-center bg-white border border-stone-200 rounded-xl overflow-hidden h-12">
        <div className="pl-4 text-stone-400">
          <Icon size={20} />
        </div>
        <input 
          type={inputType}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          disabled={disabled}
          className="w-full h-full pl-3 pr-10 text-stone-800 placeholder-stone-400 bg-transparent border-none focus:ring-0 text-sm font-medium outline-none"
        />
        {isPassword && (
          <button 
            type="button"
            onClick={onTogglePassword}
            className="absolute right-4 text-stone-400 hover:text-stone-600 transition-colors"
            disabled={disabled}
          >
            {showPassword ? <EyeSlash size={18} /> : <Eye size={18} />}
          </button>
        )}
      </div>
    </div>
  );
};

const SignupPage = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    displayName: '',
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [localError, setLocalError] = useState('');

  const { signup, loading, error } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setLocalError('');
  };

  const validateForm = () => {
    if (!formData.username || !formData.email || !formData.displayName || !formData.password) {
      setLocalError('Please fill in all fields');
      return false;
    }

    if (formData.password !== formData.confirmPassword) {
      setLocalError('Passwords do not match');
      return false;
    }

    if (formData.password.length < 6) {
      setLocalError('Password must be at least 6 characters');
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setLocalError('Please enter a valid email address');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError('');

    if (!validateForm()) {
      return;
    }

    const { confirmPassword, ...signupData } = formData;
    const result = await signup(signupData);
    
    if (result.success) {
      navigate('/dashboard');
    } else {
      setLocalError(result.error);
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
        <div className="w-full max-w-md animate-in fade-in slide-in-from-bottom-4 duration-700">
          
          {/* Text Header */}
          <div className="mb-10 text-center">
            <h1 className="text-4xl font-bold text-stone-900 mb-3 font-serif tracking-tight">
              Create account
            </h1>
            <p className="text-stone-500 text-lg leading-relaxed">
              Begin your journey to a balanced mind today.
            </p>
          </div>

          {/* Error Message */}
          {(error || localError) && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">
              {error || localError}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <InputField 
              label="Full Name" 
              placeholder="Alex Morgan" 
              icon={User}
              name="displayName"
              value={formData.displayName}
              onChange={handleChange}
              disabled={loading}
            />
            
            <InputField 
              label="Username" 
              placeholder="alexmorgan" 
              icon={User}
              name="username"
              value={formData.username}
              onChange={handleChange}
              disabled={loading}
            />
            
            <InputField 
              label="Email" 
              type="email" 
              placeholder="alex@example.com" 
              icon={Envelope}
              name="email"
              value={formData.email}
              onChange={handleChange}
              disabled={loading}
            />
            
            <div>
              <InputField 
                label="Password" 
                type="password" 
                placeholder="••••••••" 
                icon={Lock}
                name="password"
                value={formData.password}
                onChange={handleChange}
                disabled={loading}
                showPassword={showPassword}
                onTogglePassword={() => setShowPassword(!showPassword)}
              />
            </div>

            <div>
              <InputField 
                label="Confirm Password" 
                type="password" 
                placeholder="••••••••" 
                icon={Lock}
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                disabled={loading}
                showPassword={showConfirmPassword}
                onTogglePassword={() => setShowConfirmPassword(!showConfirmPassword)}
              />
            </div>

            <button 
              type="submit"
              disabled={loading}
              className="w-full bg-[#1C1917] text-white h-14 rounded-xl font-bold text-lg hover:bg-stone-800 transition-all hover:shadow-xl hover:-translate-y-0.5 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-4 group"
            >
              {loading ? (
                <Spinner size={24} className="animate-spin" />
              ) : (
                <>
                  Create Account
                  <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          {/* Footer Switch */}
          <div className="mt-10 text-center">
            <p className="text-stone-500">
              Already have an account?{' '}
              <Link 
                to="/login" 
                className="font-bold text-[#5E8B7E] hover:text-[#4A7A6D] hover:underline transition-colors"
              >
                Log in
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* Simple Footer */}
      <div className="text-center py-6 text-xs text-stone-400 relative z-10">
        © 2025 Heal Inc. • Privacy • Terms
      </div>
    </div>
  );
};

export default SignupPage;
