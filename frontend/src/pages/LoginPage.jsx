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
      <label className="text-sm font-bold text-primary block">{label}</label>
      <div className="auth-input-wrapper relative flex items-center bg-elevated border border-primary rounded-xl overflow-hidden h-12">
        <div className="pl-4 pr-3 flex-shrink-0 text-secondary">
          <Icon size={20} />
        </div>
        <input 
          type={inputType}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          disabled={disabled}
          className="flex-1 h-full pr-4 text-primary placeholder-secondary bg-transparent border-none focus:ring-0 text-sm font-medium outline-none"
        />
        {isPassword && (
          <button 
            type="button"
            onClick={onTogglePassword}
            className="absolute right-4 flex-shrink-0 text-secondary hover:text-primary transition-colors"
            disabled={disabled}
          >
            {showPassword ? <EyeSlash size={18} /> : <Eye size={18} />}
          </button>
        )}
      </div>
    </div>
  );
};

const LoginPage = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [localError, setLocalError] = useState('');

  const { signin, loading, error } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setLocalError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError('');

    if (!formData.username || !formData.password) {
      setLocalError('Please fill in all fields');
      return;
    }

    const result = await signin(formData);
    if (result.success) {
      navigate('/dashboard');
    } else {
      setLocalError(result.error);
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
        <div className="w-full max-w-md animate-in fade-in slide-in-from-bottom-4 duration-700">
          
          {/* Text Header */}
          <div className="mb-10 text-center">
            <h1 className="text-4xl font-bold text-primary mb-3 font-serif tracking-tight">
              Welcome back
            </h1>
            <p className="text-secondary text-lg leading-relaxed">
              Enter your details to access your sanctuary.
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
              label="Username" 
              placeholder="Enter your username" 
              icon={User}
              name="username"
              value={formData.username}
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
              <div className="flex justify-end mt-2">
                <Link to="/forgot-password" className="text-sm font-medium text-accent-sage hover:opacity-80 hover:underline transition-all">
                  Forgot password?
                </Link>
              </div>
            </div>

            <button 
              type="submit"
              disabled={loading}
              className="w-full bg-primary text-inverse h-14 rounded-xl font-bold text-lg hover:opacity-90 transition-all hover:shadow-xl hover:-translate-y-0.5 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-4 group"
            >
              {loading ? (
                <Spinner size={24} className="animate-spin" />
              ) : (
                <>
                  Sign In
                  <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          {/* Footer Switch */}
          <div className="mt-10 text-center">
            <p className="text-secondary">
              Don't have an account?{' '}
              <Link 
                to="/signup" 
                className="font-bold text-accent-sage hover:opacity-80 hover:underline transition-colors"
              >
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* Simple Footer */}
      <div className="text-center py-6 text-xs text-secondary relative z-10">
        © 2025 Heal Inc. • Privacy • Terms
      </div>
    </div>
  );
};

export default LoginPage;
