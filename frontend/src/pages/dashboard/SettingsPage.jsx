import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { User, Bell, CreditCard, Sliders } from 'lucide-react';

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
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('general');
  const [notifications, setNotifications] = useState({
    email: true,
    push: false,
    weekly: true,
  });

  const tabs = [
    { id: 'general', label: 'General', icon: User },
    { id: 'notifications', label: 'Notifications', icon: Bell },
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
                    defaultValue={user?.displayName || user?.username || ''}
                    className="settings-input"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-stone-500 uppercase mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    defaultValue={user?.email || ''}
                    className="settings-input"
                  />
                </div>
              </div>
              <div className="pt-4 border-t border-stone-100 flex justify-end">
                <button className="btn-primary text-sm px-6 py-2">Save Changes</button>
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

