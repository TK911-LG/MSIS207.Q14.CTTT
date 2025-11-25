import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { User, Bell, CreditCard, Sliders, Image, ShieldCheck, Lock, Eye, EyeSlash, PaintBrush, Drop, Sparkle, Moon, Sun, Crown, ChartLine, Brain, FileText, Export, Download, Microphone, Camera, Target, TrendUp, Heart, Users, Calendar, CheckCircle, Star, Phone } from 'phosphor-react';
import { userAPI } from '../../services/api';
import { useToast } from '../../context/ToastContext';
import AvatarSelector from '../../components/AvatarSelector';
import UpgradeModal from '../../components/UpgradeModal';

const SettingToggle = ({ label, checked, onChange, disabled = false, onUpgradeClick }) => (
  <div className="setting-item relative">
    <span className="text-sm font-medium text-primary">{label}</span>
    {disabled ? (
      <div
        onClick={onUpgradeClick}
        className="toggle-switch bg-tertiary opacity-50 cursor-pointer relative group"
        data-checked={false}
        title="Upgrade to Pro to enable"
      >
        <div className="toggle-thumb translate-x-0.5" />
        <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-accent-sage flex items-center justify-center">
          <Crown size={10} weight="fill" className="text-white" />
        </div>
      </div>
    ) : (
      <div
        onClick={onChange}
        className={`toggle-switch ${checked ? 'bg-accent-sage' : 'bg-tertiary'}`}
        data-checked={checked}
      >
        <div
          className={`toggle-thumb ${checked ? 'translate-x-5' : 'translate-x-0.5'}`}
        />
      </div>
    )}
  </div>
);

const SettingsPage = () => {
  const navigate = useNavigate();
  const { user, setUser } = useAuth();
  const { theme, toggleTheme, isDark, isGlass, toggleGlass, getCardStyle } = useTheme();
  const toast = useToast();
  const [activeTab, setActiveTab] = useState('general');
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    displayName: '',
    email: '',
    avatarUrl: '',
  });
  const [avatarLoading, setAvatarLoading] = useState(false);
  const [notifications, setNotifications] = useState({
    email: false, // Disabled by default for free plan
    push: false,
    weekly: false,
  });
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const upgradeModalAnchorRef = useRef(null); // Ref to track which button opened the modal

  useEffect(() => {
    if (user) {
      setFormData({
        displayName: user.displayName || user.username || '',
        email: user.email || '',
        avatarUrl: user.avatarUrl || '',
      });
    }
  }, [user]);

  const handleSave = async () => {
    if (!formData.displayName.trim()) {
      toast.warning('Display name cannot be empty', {
        title: 'Validation Error',
      });
      return;
    }

    try {
      setLoading(true);
      const updateData = {
        displayName: formData.displayName.trim(),
      };
      
      if (formData.avatarUrl !== (user?.avatarUrl || '')) {
        updateData.avatarUrl = formData.avatarUrl;
      }

      const response = await userAPI.updateMe(updateData);

      if (response.user) {
        if (setUser) {
          setUser(response.user);
        }
        toast.success('Profile updated successfully', {
          title: 'Saved',
        });
      }
    } catch (error) {
      console.error('Error updating user:', error);
      toast.error(error.response?.data?.message || 'Failed to update profile', {
        title: 'Error',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAvatarSave = async () => {
    try {
      setAvatarLoading(true);
      const response = await userAPI.updateMe({
        avatarUrl: formData.avatarUrl,
      });

      if (response.user) {
        if (setUser) {
          setUser(response.user);
        }
        toast.success('Avatar updated successfully', {
          title: 'Saved',
        });
      }
    } catch (error) {
      console.error('Error updating avatar:', error);
      toast.error(error.response?.data?.message || 'Failed to update avatar', {
        title: 'Error',
      });
    } finally {
      setAvatarLoading(false);
    }
  };

  const handleAvatarSelect = (avatarUrl) => {
    setFormData({ ...formData, avatarUrl: avatarUrl || '' });
  };

  const tabs = [
    { id: 'general', label: 'General', icon: User },
    { id: 'avatar', label: 'Avatar', icon: Image },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'pro-features', label: 'Pro Features', icon: Crown },
    { id: 'billing', label: 'Billing', icon: CreditCard },
    { id: 'privacy', label: 'Privacy & Trust', icon: ShieldCheck },
    { id: 'preferences', label: 'Preferences', icon: Sliders },
  ];

  return (
    <div className="flex h-full gap-8 fade-in max-w-6xl mx-auto">
      <div className="w-64 flex-shrink-0">
        <h2 className="text-2xl font-bold text-primary mb-6">Settings</h2>
        <div className="space-y-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                activeTab === tab.id
                  ? 'bg-tertiary text-primary'
                  : 'text-secondary hover:text-primary hover:bg-tertiary'
              }`}
            >
              <tab.icon size={18} />
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 max-w-2xl">
        <div className="border border-primary rounded-xl p-8 shadow-sm" style={getCardStyle()}>
          {activeTab === 'general' && (
            <div className="space-y-6 fade-in-up">
              <h3 className="text-lg font-bold text-primary border-b border-primary pb-4">
                General
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-secondary uppercase mb-1">
                    Display Name
                  </label>
                  <input
                    type="text"
                    value={formData.displayName}
                    onChange={(e) => setFormData({ ...formData, displayName: e.target.value })}
                    className="settings-input"
                    placeholder="Enter your display name"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-secondary uppercase mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    disabled
                    className="settings-input bg-tertiary cursor-not-allowed"
                    title="Email cannot be changed"
                  />
                </div>
              </div>
              <div className="pt-4 border-t border-primary flex justify-end">
                <button
                  onClick={handleSave}
                  disabled={loading}
                  className="btn-primary text-sm px-6 py-2 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {loading ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </div>
          )}

          {activeTab === 'preferences' && (
            <div className="space-y-6 fade-in-up">
              <h3 className="text-lg font-bold text-primary border-b border-primary pb-4 flex items-center gap-2">
                <PaintBrush size={20} weight="fill" className="text-accent-sage" />
                Appearance
              </h3>
              
              {/* Dark Mode */}
              <div className="flex items-center justify-between py-4 border-b border-primary">
                <div>
                  <h4 className="font-bold text-primary text-base flex items-center gap-2">
                    <Moon size={18} weight={isDark ? 'fill' : 'regular'} />
                    Dark Mode
                  </h4>
                  <p className="text-sm text-secondary">Deep colors for focus.</p>
                </div>
                <button 
                  onClick={toggleTheme}
                  className={`w-14 h-8 rounded-full p-1 transition-colors duration-300 flex items-center ${
                    isDark ? 'bg-accent-sage' : 'bg-tertiary'
                  }`}
                >
                  <div className={`w-6 h-6 rounded-full bg-white shadow-sm transform transition-transform duration-300 flex items-center justify-center ${
                    isDark ? 'translate-x-6' : 'translate-x-0'
                  }`}>
                    {isDark ? (
                      <Moon size={12} weight="fill" className="text-accent-sage" />
                    ) : (
                      <Sun size={12} weight="fill" className="text-orange-400" />
                    )}
                  </div>
                </button>
              </div>

              {/* Glass Mode */}
              <div className="flex items-center justify-between py-4 border-b border-primary">
                <div>
                  <h4 className="font-bold text-primary text-base flex items-center gap-2">
                    <Drop size={18} weight="regular" />
                    Glass Mode
                  </h4>
                  <p className="text-sm text-secondary">Standard transparency.</p>
                </div>
                <button 
                  onClick={toggleGlass}
                  className={`w-14 h-8 rounded-full p-1 transition-colors duration-300 flex items-center ${
                    isGlass ? 'bg-accent-sage' : 'bg-tertiary'
                  }`}
                >
                  <div className={`w-6 h-6 rounded-full bg-white shadow-sm transform transition-transform duration-300 flex items-center justify-center ${
                    isGlass ? 'translate-x-6' : 'translate-x-0'
                  }`}>
                    <Drop size={12} weight="regular" />
                  </div>
                </button>
              </div>

            </div>
          )}

          {activeTab === 'avatar' && (
            <div className="space-y-6 fade-in-up">
              <h3 className="text-lg font-bold text-primary border-b border-primary pb-4">
                Avatar
              </h3>
              <AvatarSelector
                currentAvatar={user?.avatarUrl || ''}
                onSelect={handleAvatarSelect}
              />
              <div className="pt-4 border-t border-primary flex justify-end">
                <button
                  onClick={handleAvatarSave}
                  disabled={avatarLoading || formData.avatarUrl === (user?.avatarUrl || '')}
                  className="btn-primary text-sm px-6 py-2 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {avatarLoading ? 'Saving...' : 'Save Avatar'}
                </button>
              </div>
            </div>
          )}

          {activeTab === 'notifications' && (
            <div className="space-y-6 fade-in-up">
              <div className="flex items-center justify-between border-b border-primary pb-4">
                <h3 className="text-lg font-bold text-primary">
                  Notifications
                </h3>
                <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-accent-sage-light">
                  <Crown size={14} weight="fill" style={{ color: 'var(--accent-sage)' }} />
                  <span className="text-xs font-bold" style={{ color: 'var(--accent-sage)' }}>
                    Pro Feature
                  </span>
                </div>
              </div>
              <div className="p-4 rounded-2xl mb-4" style={{ 
                backgroundColor: 'var(--bg-tertiary)',
                border: '1px dashed var(--border-subtle)',
              }}>
                <p className="text-sm text-secondary text-center mb-2">
                  Notifications are available for Pro members only
                </p>
                <button
                  ref={upgradeModalAnchorRef}
                  onClick={(e) => {
                    upgradeModalAnchorRef.current = e.currentTarget;
                    setShowUpgradeModal(true);
                  }}
                  className="w-full py-2 px-4 rounded-xl font-medium text-white transition-all hover:scale-105"
                  style={{
                    background: 'linear-gradient(135deg, var(--accent-sage) 0%, var(--accent-clay) 100%)',
                  }}
                >
                  Upgrade to Pro
                </button>
              </div>
              <div className="space-y-0 opacity-50">
                <SettingToggle
                  label="Email Notifications"
                  checked={false}
                  disabled={true}
                  onUpgradeClick={(e) => {
                    upgradeModalAnchorRef.current = e?.currentTarget || e?.target?.closest('.setting-item');
                    setShowUpgradeModal(true);
                  }}
                />
                <SettingToggle
                  label="Push Notifications"
                  checked={false}
                  disabled={true}
                  onUpgradeClick={(e) => {
                    upgradeModalAnchorRef.current = e?.currentTarget || e?.target?.closest('.setting-item');
                    setShowUpgradeModal(true);
                  }}
                />
                <SettingToggle
                  label="Weekly Reports"
                  checked={false}
                  disabled={true}
                  onUpgradeClick={(e) => {
                    upgradeModalAnchorRef.current = e?.currentTarget || e?.target?.closest('.setting-item');
                    setShowUpgradeModal(true);
                  }}
                />
              </div>
            </div>
          )}

          {activeTab === 'pro-features' && (
            <div className="space-y-6 fade-in-up">
              <div className="flex items-center justify-between border-b border-primary pb-4">
                <div>
                  <h3 className="text-lg font-semibold text-primary mb-1">Pro Features</h3>
                  <p className="text-sm text-secondary">Unlock powerful tools to enhance your wellness journey</p>
                </div>
                <div className="flex items-center gap-2 px-3 py-1 rounded-full" style={{ backgroundColor: 'var(--accent-sage-light)' }}>
                  <Crown size={16} weight="fill" style={{ color: 'var(--accent-sage)' }} />
                  <span className="text-xs font-medium" style={{ color: 'var(--accent-sage)' }}>Pro</span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { icon: ChartLine, title: 'Advanced Analytics', desc: 'Deep insights with exportable reports' },
                  { icon: Brain, title: 'AI-Powered Insights', desc: 'Personalized recommendations based on your data' },
                  { icon: FileText, title: 'Multiple Journal Templates', desc: 'Guided prompts for different moods' },
                  { icon: Export, title: 'Data Export & Backup', desc: 'Export PDF reports and backup your data' },
                  { icon: Microphone, title: 'Voice Journaling', desc: 'Record your thoughts with voice notes' },
                  { icon: Camera, title: 'Photo Journaling', desc: 'Add photos to your journal entries' },
                  { icon: Target, title: 'Goal Setting & Tracking', desc: 'Set and track wellness goals' },
                  { icon: TrendUp, title: 'Mood Pattern Recognition', desc: 'Identify triggers and patterns' },
                  { icon: Heart, title: 'Habit Suggestions', desc: 'AI suggests habits based on your goals' },
                  { icon: Download, title: 'Progress Reports', desc: 'Weekly & monthly detailed reports' },
                  { icon: Users, title: 'Community Support', desc: 'Join support groups and share (optional)' },
                  { icon: Calendar, title: 'Custom Reminders', desc: 'Personalized notification schedules' },
                  { icon: CheckCircle, title: 'Habit Streak Challenges', desc: 'Compete with yourself and friends' },
                  { icon: Star, title: 'Sleep Quality Analysis', desc: 'Advanced sleep insights & recommendations' },
                  { icon: Phone, title: 'Crisis Support Resources', desc: '24/7 access to crisis resources' },
                  { icon: Sparkle, title: 'Custom Themes', desc: 'Premium themes and personalization' },
                ].map((feature, index) => (
                  <div
                    key={index}
                    className="p-4 rounded-2xl transition-all hover:opacity-90 cursor-pointer group"
                    style={{
                      ...getCardStyle(),
                      border: '1px solid var(--border-subtle)',
                    }}
                    onClick={(e) => {
                      upgradeModalAnchorRef.current = e.currentTarget;
                      setShowUpgradeModal(true);
                    }}
                  >
                    <div className="flex items-start gap-3">
                      <div 
                        className="p-2 rounded-xl flex-shrink-0"
                        style={{
                          backgroundColor: 'var(--accent-sage-light)',
                          color: 'var(--accent-sage)',
                        }}
                      >
                        <feature.icon size={18} weight="duotone" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-medium text-primary mb-1 group-hover:text-accent-sage transition-colors">
                          {feature.title}
                        </h4>
                        <p className="text-xs text-secondary leading-relaxed">
                          {feature.desc}
                        </p>
                      </div>
                      <Crown 
                        size={14} 
                        weight="fill" 
                        className="flex-shrink-0 opacity-40"
                        style={{ color: 'var(--accent-sage)' }}
                      />
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 p-6 rounded-2xl text-center" style={{
                backgroundColor: 'var(--accent-sage-light)',
                border: '1px solid var(--accent-sage)',
              }}>
                <Crown size={32} weight="duotone" style={{ color: 'var(--accent-sage)' }} className="mx-auto mb-3" />
                <h4 className="text-base font-semibold text-primary mb-2">Ready to unlock all Pro Features?</h4>
                <p className="text-sm text-secondary mb-4">
                  Get access to all premium tools and take your wellness journey to the next level
                </p>
                <button
                  onClick={() => {
                    setActiveTab('billing');
                  }}
                  className="px-6 py-2.5 rounded-xl text-sm font-medium text-white transition-all hover:opacity-90"
                  style={{
                    backgroundColor: 'var(--accent-sage)',
                  }}
                >
                  View Pricing Plans
                </button>
              </div>
            </div>
          )}

          {activeTab === 'billing' && (
            <div className="space-y-6 fade-in-up">
              <div className="flex items-center justify-between border-b border-primary pb-4">
                <div>
                  <h3 className="text-lg font-semibold text-primary mb-1">Billing & Subscription</h3>
                  <p className="text-sm text-secondary">Manage your subscription and payment methods</p>
                </div>
              </div>

              {/* Current Plan - Soft Minimalism */}
              <div className="p-8 rounded-3xl mb-6" style={{ ...getCardStyle() }}>
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h4 className="text-sm font-medium text-primary mb-1">Current Plan</h4>
                    <p className="text-xs text-secondary">Free Plan</p>
                  </div>
                  <div className="px-3 py-1 rounded-full" style={{ backgroundColor: 'var(--bg-tertiary)' }}>
                    <span className="text-xs font-medium text-secondary">Active</span>
                  </div>
                </div>
                <div className="pt-6 border-t" style={{ borderColor: 'var(--border-subtle)' }}>
                  <p className="text-xs text-secondary mb-4">What's included:</p>
                  <div className="space-y-2.5">
                    {['Basic mood tracking', 'Habit tracking', 'Journal entries', 'Sleep logging', 'Basic insights'].map((feature, i) => (
                      <div key={i} className="flex items-center gap-2">
                        <CheckCircle size={12} weight="fill" style={{ color: 'var(--accent-sage)' }} />
                        <span className="text-xs text-secondary">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Pricing Plans - Soft Minimalism */}
              <div>
                <h4 className="text-sm font-medium text-primary mb-6">Upgrade to Pro</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Monthly Plan */}
                  <div
                    className="p-6 rounded-3xl relative transition-all hover:opacity-90 cursor-pointer"
                    style={{
                      ...getCardStyle(),
                    }}
                    onClick={() => {
                      navigate('/dashboard/checkout?plan=monthly');
                    }}
                  >
                    <div className="text-center mb-5">
                      <h5 className="text-base font-medium text-primary mb-2">Monthly</h5>
                      <div className="flex items-baseline justify-center gap-1 mb-1">
                        <span className="text-2xl font-semibold text-primary">$9.99</span>
                        <span className="text-xs text-secondary">/month</span>
                      </div>
                    </div>
                    <button
                      className="w-full py-2.5 px-4 rounded-xl text-sm font-medium text-white transition-all hover:opacity-90"
                      style={{
                        backgroundColor: 'var(--accent-sage)',
                      }}
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate('/dashboard/checkout?plan=monthly');
                      }}
                    >
                      Choose Monthly
                    </button>
                  </div>

                  {/* Yearly Plan - Soft Minimalism */}
                  <div
                    className="p-6 rounded-3xl relative transition-all hover:opacity-90 cursor-pointer"
                    style={{
                      ...getCardStyle(),
                      border: '1.5px solid var(--accent-sage)',
                    }}
                    onClick={() => {
                      navigate('/dashboard/checkout?plan=yearly');
                    }}
                  >
                    <div className="absolute -top-2.5 left-1/2 -translate-x-1/2 px-2.5 py-0.5 rounded-full text-xs font-medium text-white"
                      style={{
                        backgroundColor: 'var(--accent-sage)',
                      }}
                    >
                      BEST VALUE
                    </div>
                    <div className="text-center mb-5 mt-2">
                      <h5 className="text-base font-medium text-primary mb-2">Yearly</h5>
                      <div className="flex items-baseline justify-center gap-1 mb-1">
                        <span className="text-2xl font-semibold text-primary">$79.99</span>
                        <span className="text-xs text-secondary">/year</span>
                      </div>
                      <p className="text-xs text-accent-sage mt-1">
                        Save 33% vs monthly
                      </p>
                    </div>
                    <button
                      className="w-full py-2.5 px-4 rounded-xl text-sm font-medium text-white transition-all hover:opacity-90"
                      style={{
                        backgroundColor: 'var(--accent-sage)',
                      }}
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate('/dashboard/checkout?plan=yearly');
                      }}
                    >
                      Choose Yearly
                    </button>
                  </div>
                </div>

                <div className="mt-6 p-4 rounded-2xl" style={{ backgroundColor: 'var(--bg-tertiary)' }}>
                  <p className="text-xs text-secondary text-center">
                    <Lock size={12} className="inline mr-1" />
                    Secure payment via PayPal • Cancel anytime
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'privacy' && (
            <div className="space-y-6 fade-in-up">
              <div className="border-b border-primary pb-4">
                <h3 className="text-lg font-bold text-primary mb-2">Privacy & Trust</h3>
                <p className="text-sm text-secondary">Your data is safe with us. We're committed to your privacy.</p>
              </div>
              
              <div className="space-y-6">
                {/* Data Security */}
                <div 
                  className="p-6 rounded-xl border border-green-200 dark:border-green-800"
                  style={getCardStyle()}
                >
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center shrink-0">
                      <Lock size={24} className="text-green-600 dark:text-green-400" weight="fill" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-bold text-primary mb-1">End-to-End Encryption</h4>
                      <p className="text-sm text-secondary leading-relaxed">
                        All your journal entries, mood logs, and personal data are encrypted. Only you can access your information.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Privacy Controls */}
                <div 
                  className="p-6 rounded-xl border border-blue-200 dark:border-blue-800"
                  style={getCardStyle()}
                >
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center shrink-0">
                      <EyeSlash size={24} className="text-blue-600 dark:text-blue-400" weight="fill" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-bold text-primary mb-1">Your Data, Your Control</h4>
                      <p className="text-sm text-secondary leading-relaxed mb-3">
                        We never share your data with third parties. You can export or delete your data anytime.
                      </p>
                      <div className="flex gap-2">
                        <button 
                          className="px-4 py-2 rounded-lg text-sm font-medium text-blue-700 dark:text-blue-400 transition-colors"
                          style={{
                            ...getCardStyle(),
                            border: '1px solid var(--border-subtle)',
                          }}
                        >
                          Export Data
                        </button>
                        <button 
                          className="px-4 py-2 rounded-lg text-sm font-medium text-red-700 dark:text-red-400 transition-colors"
                          style={{
                            ...getCardStyle(),
                            border: '1px solid var(--border-subtle)',
                          }}
                        >
                          Delete Account
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Trust Signals */}
                <div className="space-y-4">
                  <h4 className="font-bold text-primary">Trust & Safety</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div 
                      className="p-4 rounded-xl border border-primary"
                      style={getCardStyle()}
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <ShieldCheck size={20} className="text-accent-sage" weight="fill" />
                        <span className="font-semibold text-primary text-sm">HIPAA Compliant</span>
                      </div>
                      <p className="text-xs text-secondary">We follow healthcare data protection standards.</p>
                    </div>
                    <div 
                      className="p-4 rounded-xl border border-primary"
                      style={getCardStyle()}
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <Lock size={20} className="text-accent-sage" weight="fill" />
                        <span className="font-semibold text-primary text-sm">Zero Tracking</span>
                      </div>
                      <p className="text-xs text-secondary">We don't track you across the web or sell your data.</p>
                    </div>
                    <div 
                      className="p-4 rounded-xl border border-primary"
                      style={getCardStyle()}
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <Eye size={20} className="text-accent-sage" weight="fill" />
                        <span className="font-semibold text-primary text-sm">Transparent Privacy</span>
                      </div>
                      <p className="text-xs text-secondary">Clear privacy policy. No hidden terms.</p>
                    </div>
                    <div 
                      className="p-4 rounded-xl border border-primary"
                      style={getCardStyle()}
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <ShieldCheck size={20} className="text-accent-sage" weight="fill" />
                        <span className="font-semibold text-primary text-sm">Secure Storage</span>
                      </div>
                      <p className="text-xs text-secondary">Your data is stored securely with industry-standard encryption.</p>
                    </div>
                  </div>
                </div>

                {/* Crisis Support Note */}
                <div 
                  className="p-4 rounded-xl border border-red-200 dark:border-red-800"
                  style={getCardStyle()}
                >
                  <p className="text-sm text-red-800 dark:text-red-300 leading-relaxed">
                    <strong>💙 Crisis Support:</strong> If you're in immediate danger, please call emergency services (115) or use the crisis help button in the sidebar. Your safety comes first.
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'preferences' && (
            <div className="space-y-6 fade-in-up">
              <h3 className="text-lg font-bold text-primary border-b border-primary pb-4">
                Preferences
              </h3>
              <p className="text-secondary">Preferences settings coming soon.</p>
            </div>
          )}
        </div>
      </div>

      <UpgradeModal 
        isOpen={showUpgradeModal} 
        onClose={() => {
          setShowUpgradeModal(false);
          upgradeModalAnchorRef.current = null;
        }}
        anchorRef={upgradeModalAnchorRef}
      />
    </div>
  );
};

export default SettingsPage;

