import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { 
  Heart, X, Home, Smile, Target, BookOpen, Settings, 
  LogOut, Search, Bell, Menu
} from 'lucide-react';

const DashboardLayout = ({ children }) => {
  const { user, signout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleSignout = async () => {
    await signout();
    navigate('/');
  };

  const navItems = [
    { id: 'overview', path: '/dashboard', icon: Home, label: 'Overview' },
    { id: 'mood', path: '/dashboard/mood', icon: Smile, label: 'Mood' },
    { id: 'habits', path: '/dashboard/habits', icon: Target, label: 'Habits' },
    { id: 'journal', path: '/dashboard/journal', icon: BookOpen, label: 'Journal' },
    { id: 'settings', path: '/dashboard/settings', icon: Settings, label: 'Settings' },
  ];

  const currentPath = location.pathname;
  const activeNav = navItems.find(item => item.path === currentPath)?.id || 'overview';

  const NavItem = ({ item }) => {
    const isActive = currentPath === item.path;
    return (
      <button
        onClick={() => {
          navigate(item.path);
          setSidebarOpen(false);
        }}
        className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl transition-all ${
          isActive
            ? 'bg-[#E7F3F0] text-[#5E8B7E] font-bold'
            : 'text-stone-500 hover:bg-stone-100'
        }`}
      >
        <item.icon size={20} strokeWidth={isActive ? 2.5 : 2} />
        {item.label}
      </button>
    );
  };

  return (
    <div className="min-h-screen flex bg-[#FAFAF9]">
      {/* Sidebar */}
      <aside
        className={`fixed lg:sticky top-0 h-screen w-72 p-6 flex flex-col z-50 bg-white/80 backdrop-blur-xl border-r border-stone-100/50 transition-transform duration-300 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <button
          onClick={() => setSidebarOpen(false)}
          className="lg:hidden absolute top-4 right-4 p-2 text-stone-400 hover:text-stone-600"
        >
          <X size={24} />
        </button>

        <div className="flex items-center gap-3 px-2 mb-12 mt-2 lg:mt-0">
          <div className="w-10 h-10 bg-[#5E8B7E] text-white rounded-xl flex items-center justify-center shadow-lg shadow-[#5E8B7E]/20">
            <Heart size={20} fill="currentColor" />
          </div>
          <span className="text-2xl font-bold text-stone-800">Heal</span>
        </div>

        <nav className="space-y-2 flex-1">
          {navItems.map((item) => (
            <NavItem key={item.id} item={item} />
          ))}
        </nav>

        <div className="bg-white border border-stone-100 p-4 rounded-2xl flex items-center gap-3 shadow-sm">
          <div className="w-10 h-10 rounded-full bg-[#E7F3F0] flex items-center justify-center text-[#5E8B7E] font-bold">
            {(user?.displayName || user?.username || 'U').charAt(0).toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold text-stone-900 truncate">
              {user?.displayName || user?.username || 'User'}
            </p>
            <p className="text-xs text-stone-400 truncate">Free Plan</p>
          </div>
          <button
            onClick={handleSignout}
            className="text-stone-400 hover:text-red-500 transition-colors"
          >
            <LogOut size={20} />
          </button>
        </div>
      </aside>

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <main className="flex-1 p-6 lg:p-10 relative z-10 overflow-y-auto h-screen">
        {/* Mobile Header */}
        <div className="lg:hidden flex justify-between items-center mb-6">
          <div className="flex items-center gap-2 font-bold text-lg text-stone-800">
            <Heart size={20} className="text-[#5E8B7E]" fill="currentColor" />
            Heal
          </div>
          <button onClick={() => setSidebarOpen(true)}>
            <Menu size={24} className="text-stone-600" />
          </button>
        </div>

        {children}
      </main>
    </div>
  );
};

export default DashboardLayout;

