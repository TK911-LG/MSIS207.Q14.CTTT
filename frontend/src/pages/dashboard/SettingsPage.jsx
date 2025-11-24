import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { User, Bell, CreditCard, Sliders, Image, ShieldCheck, Lock, Eye, EyeSlash } from 'phosphor-react';
import { userAPI } from '../../services/api';
import { useToast } from '../../context/ToastContext';
import AvatarSelector from '../../components/AvatarSelector';

const SettingToggle = ({ label, checked, onChange }) => (
  <div className="setting-item">
    <span className="text-sm font-medium text-stone-800">{label}</span>
    <div
      onClick={onChange}
      className={`toggle-switch ${checked ? 'bg-[#5E8B7E]' : 'bg-stone-200'}`}
      data-checked={checked}
    >
      <div
        className={`toggle-thumb ${checked ? 'translate-x-5' : 'translate-x-0.5'}`}
      />
    </div>
  </div>
);

const SettingsPage = () => {
  const { user, setUser } = useAuth();
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
    email: true,
    push: false,
    weekly: true,
  });

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
        // Update user in auth context
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
    { id: 'privacy', label: 'Privacy & Trust', icon: ShieldCheck },
    { id: 'billing', label: 'Billing', icon: CreditCard },
    { id: 'preferences', label: 'Preferences', icon: Sliders },
  ];

  return (
    <div className="flex h-full gap-8 fade-in max-w-6xl mx-auto">
      <div className="w-64 flex-shrink-0">
        <h2 className="text-2xl font-bold text-stone-800 mb-6">Settings</h2>
        <div className="space-y-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                activeTab === tab.id
                  ? 'bg-stone-100 text-stone-900'
                  : 'text-stone-500 hover:text-stone-700 hover:bg-stone-50'
              }`}
            >
              <tab.icon size={18} />
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 max-w-2xl">
        <div className="bg-white border border-stone-200 rounded-xl p-8 shadow-sm">
          {activeTab === 'general' && (
            <div className="space-y-6 fade-in-up">
              <h3 className="text-lg font-bold text-stone-900 border-b border-stone-100 pb-4">
                General
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-stone-500 uppercase mb-1">
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
                  <label className="block text-xs font-bold text-stone-500 uppercase mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    disabled
                    className="settings-input bg-stone-100 cursor-not-allowed"
                    title="Email cannot be changed"
                  />
                </div>
              </div>
              <div className="pt-4 border-t border-stone-100 flex justify-end">
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

          {activeTab === 'avatar' && (
            <div className="space-y-6 fade-in-up">
              <h3 className="text-lg font-bold text-stone-900 border-b border-stone-100 pb-4">
                Avatar
              </h3>
              <AvatarSelector
                currentAvatar={user?.avatarUrl || ''}
                onSelect={handleAvatarSelect}
              />
              <div className="pt-4 border-t border-stone-100 flex justify-end">
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
              <h3 className="text-lg font-bold text-stone-900 border-b border-stone-100 pb-4">
                Notifications
              </h3>
              <div className="space-y-0">
                <SettingToggle
                  label="Email Notifications"
                  checked={notifications.email}
                  onChange={() =>
                    setNotifications({ ...notifications, email: !notifications.email })
                  }
                />
                <SettingToggle
                  label="Push Notifications"
                  checked={notifications.push}
                  onChange={() =>
                    setNotifications({ ...notifications, push: !notifications.push })
                  }
                />
                <SettingToggle
                  label="Weekly Reports"
                  checked={notifications.weekly}
                  onChange={() =>
                    setNotifications({ ...notifications, weekly: !notifications.weekly })
                  }
                />
              </div>
            </div>
          )}

          {activeTab === 'billing' && (
            <div className="space-y-6 fade-in-up">
              <h3 className="text-lg font-bold text-stone-900 border-b border-stone-100 pb-4">
                Billing
              </h3>
              <div className="text-center py-12">
                <p className="text-stone-500">You're on the Free Plan</p>
                <button className="btn-primary mt-4">Upgrade to Pro</button>
              </div>
            </div>
          )}

          {activeTab === 'privacy' && (
            <div className="space-y-6 fade-in-up">
              <div className="border-b border-stone-100 pb-4">
                <h3 className="text-lg font-bold text-stone-900 mb-2">Privacy & Trust</h3>
                <p className="text-sm text-stone-500">Your data is safe with us. We're committed to your privacy.</p>
              </div>
              
              <div className="space-y-6">
                {/* Data Security */}
                <div className="p-6 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl border border-green-200">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center shrink-0">
                      <Lock size={24} className="text-green-600" weight="fill" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-bold text-stone-900 mb-1">End-to-End Encryption</h4>
                      <p className="text-sm text-stone-600 leading-relaxed">
                        All your journal entries, mood logs, and personal data are encrypted. Only you can access your information.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Privacy Controls */}
                <div className="p-6 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl border border-blue-200">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
                      <EyeSlash size={24} className="text-blue-600" weight="fill" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-bold text-stone-900 mb-1">Your Data, Your Control</h4>
                      <p className="text-sm text-stone-600 leading-relaxed mb-3">
                        We never share your data with third parties. You can export or delete your data anytime.
                      </p>
                      <div className="flex gap-2">
                        <button className="px-4 py-2 bg-white border border-blue-200 rounded-lg text-sm font-medium text-blue-700 hover:bg-blue-50 transition-colors">
                          Export Data
                        </button>
                        <button className="px-4 py-2 bg-white border border-red-200 rounded-lg text-sm font-medium text-red-700 hover:bg-red-50 transition-colors">
                          Delete Account
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Trust Signals */}
                <div className="space-y-4">
                  <h4 className="font-bold text-stone-900">Trust & Safety</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 bg-stone-50 rounded-xl border border-stone-200">
                      <div className="flex items-center gap-2 mb-2">
                        <ShieldCheck size={20} className="text-[#5E8B7E]" weight="fill" />
                        <span className="font-semibold text-stone-900 text-sm">HIPAA Compliant</span>
                      </div>
                      <p className="text-xs text-stone-600">We follow healthcare data protection standards.</p>
                    </div>
                    <div className="p-4 bg-stone-50 rounded-xl border border-stone-200">
                      <div className="flex items-center gap-2 mb-2">
                        <Lock size={20} className="text-[#5E8B7E]" weight="fill" />
                        <span className="font-semibold text-stone-900 text-sm">Zero Tracking</span>
                      </div>
                      <p className="text-xs text-stone-600">We don't track you across the web or sell your data.</p>
                    </div>
                    <div className="p-4 bg-stone-50 rounded-xl border border-stone-200">
                      <div className="flex items-center gap-2 mb-2">
                        <Eye size={20} className="text-[#5E8B7E]" weight="fill" />
                        <span className="font-semibold text-stone-900 text-sm">Transparent Privacy</span>
                      </div>
                      <p className="text-xs text-stone-600">Clear privacy policy. No hidden terms.</p>
                    </div>
                    <div className="p-4 bg-stone-50 rounded-xl border border-stone-200">
                      <div className="flex items-center gap-2 mb-2">
                        <ShieldCheck size={20} className="text-[#5E8B7E]" weight="fill" />
                        <span className="font-semibold text-stone-900 text-sm">Secure Storage</span>
                      </div>
                      <p className="text-xs text-stone-600">Your data is stored securely with industry-standard encryption.</p>
                    </div>
                  </div>
                </div>

                {/* Crisis Support Note */}
                <div className="p-4 bg-red-50 rounded-xl border border-red-200">
                  <p className="text-sm text-red-800 leading-relaxed">
                    <strong>💙 Crisis Support:</strong> If you're in immediate danger, please call emergency services (115) or use the crisis help button in the sidebar. Your safety comes first.
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'preferences' && (
            <div className="space-y-6 fade-in-up">
              <h3 className="text-lg font-bold text-stone-900 border-b border-stone-100 pb-4">
                Preferences
              </h3>
              <p className="text-stone-500">Preferences settings coming soon.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;

