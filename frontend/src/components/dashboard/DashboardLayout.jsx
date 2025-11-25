import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { 
  Leaf, X, House, Smiley, Moon, Target, BookOpen, ChartBar, Gear, 
  SignOut, MagnifyingGlass, Bell, List, Phone, Crown
} from 'phosphor-react';
import CrisisHelp from '../CrisisHelp';

const DashboardLayout = ({ children }) => {
  const { user, signout } = useAuth();
  const { theme, isDark, isGlass, getCardStyle: getCardStyleFromTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleSignout = async () => {
    await signout();
    navigate('/');
  };

  const navItems = [
    { id: 'overview', path: '/dashboard', icon: House, label: 'Overview' },
    { id: 'mood', path: '/dashboard/mood', icon: Smiley, label: 'Mood' },
    { id: 'habits', path: '/dashboard/habits', icon: Target, label: 'Habits' },
    { id: 'journal', path: '/dashboard/journal', icon: BookOpen, label: 'Journal' },
    { id: 'insights', path: '/dashboard/insights', icon: ChartBar, label: 'Insights' },
    { id: 'sleep', path: '/dashboard/sleep', icon: Moon, label: 'Sleep' },
    { id: 'settings', path: '/dashboard/settings', icon: Gear, label: 'Settings' },
  ];

  const [crisisOpen, setCrisisOpen] = useState(false);

  const currentPath = location.pathname;
  const activeNav = navItems.find(item => item.path === currentPath)?.id || 'overview';

  // --- STYLE GENERATOR (THE CORE MAGIC) ---
  // Sử dụng getCardStyle từ ThemeContext để đảm bảo consistency
  const getCardStyle = () => {
    return getCardStyleFromTheme();
  };

  const getSidebarStyle = () => {
    const baseStyle = getCardStyle();
    return {
      ...baseStyle,
      // Sidebar hoàn toàn trong suốt trong glass/liquid mode - loại bỏ solid background
      ...(isGlass ? {
        backgroundColor: 'transparent',
        background: baseStyle.background || 'transparent',
      } : {}),
      borderRight: isGlass ? 'none' : baseStyle.border, // Không có border trong glass
      borderLeft: 'none',
      borderTop: 'none',
      borderBottom: 'none',
      borderRadius: '0', // Sidebar vuông góc
      // Tăng blur cho sidebar để tạo cảm giác trong suốt hơn
      backdropFilter: isGlass 
        ? 'blur(20px) saturate(150%)'
        : baseStyle.backdropFilter,
      WebkitBackdropFilter: isGlass 
        ? 'blur(20px) saturate(150%)'
        : baseStyle.WebkitBackdropFilter,
    };
  };

  const NavItem = ({ item }) => {
    const isActive = currentPath === item.path;
    const finalStyle = isActive
      ? {
          ...getCardStyle(),
          // Loại bỏ solid backgroundColor trong glass/liquid mode - chỉ dùng transparent
          ...(isGlass ? {} : { backgroundColor: 'var(--bg-card)' }),
          color: 'var(--color-sage)',
          fontWeight: 'bold',
          // Chỉ dùng shadow trong solid mode
          ...(isGlass ? {} : { boxShadow: 'var(--shadow-card)' }),
        }
      : { color: 'var(--text-muted)' }; // Non-active

    return (
      <button
        onClick={() => {
          navigate(item.path);
          setSidebarOpen(false);
        }}
        className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-300 relative group hover:bg-white/5"
        style={finalStyle}
      >
        <item.icon 
          size={20} 
          weight={isActive ? 'bold' : 'regular'}
          className={`transition-transform duration-300 ${isActive ? 'scale-110' : 'group-hover:scale-110'}`}
        />
        <span style={{ fontSize: '15px' }}>{item.label}</span>
      </button>
    );
  };

  return (
    <div 
      className="min-h-screen flex transition-all duration-700 ease-in-out relative overflow-hidden"
      data-theme={theme}
      style={{
        backgroundColor: 'var(--bg-page)',
        color: 'var(--text-main)',
      }}
    >
      {/* --- GLASS BACKGROUND BLOBS --- */}
      {/* Khi bật Glass, Blobs sẽ hiện rõ hơn */}
      {isGlass && (
        <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
          <div 
            className="absolute top-[-10%] left-[-10%] rounded-full filter blur-[80px] animate-blob transition-all duration-1000 w-[50vw] h-[50vw] opacity-40"
            style={{
              backgroundColor: 'var(--color-sage)',
              mixBlendMode: isDark ? 'screen' : 'multiply',
            }}
          ></div>
          
          <div 
            className="absolute top-[10%] right-[-10%] rounded-full filter blur-[80px] animate-blob animation-delay-2000 transition-all duration-1000 w-[50vw] h-[50vw] opacity-30"
            style={{
              backgroundColor: 'var(--color-clay)',
              mixBlendMode: isDark ? 'screen' : 'multiply',
            }}
          ></div>
          
          <div 
            className="absolute bottom-[-20%] left-[20%] rounded-full filter blur-[80px] animate-blob animation-delay-4000 transition-all duration-1000 w-[50vw] h-[50vw] opacity-40"
            style={{
              backgroundColor: 'var(--color-indigo)',
              mixBlendMode: isDark ? 'screen' : 'multiply',
            }}
          ></div>
        </div>
      )}

      {/* Sidebar - Glassmorphism */}
      <aside
        className={`fixed lg:sticky top-0 h-screen w-72 p-6 flex flex-col z-50 transition-transform duration-300 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
        style={getSidebarStyle()}
      >
        <button
          onClick={() => setSidebarOpen(false)}
          className="lg:hidden absolute top-4 right-4 p-2 text-secondary hover:text-primary transition-colors"
        >
          <X size={24} />
        </button>

        <div className="flex items-center gap-3 px-2 mb-12 mt-2 lg:mt-0">
          <div 
            className="w-10 h-10 rounded-xl flex items-center justify-center shadow-lg transition-transform hover:rotate-6"
            style={{
              backgroundColor: 'var(--color-sage)',
              color: 'white',
              boxShadow: '0 4px 12px rgba(94, 139, 126, 0.3)',
            }}
          >
            <Leaf size={20} weight="fill" />
          </div>
          <span className="text-2xl font-bold font-serif" style={{ color: 'var(--text-main)' }}>Heal</span>
        </div>

        <nav className="space-y-2 flex-1">
          {navItems.map((item) => (
            <NavItem key={item.id} item={item} />
          ))}
          
          {/* Crisis Help Button */}
          <button
            onClick={() => setCrisisOpen(true)}
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-2xl transition-all"
            style={{ 
              color: '#dc2626',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = isDark ? 'rgba(220, 38, 38, 0.1)' : 'rgba(254, 242, 242, 0.8)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
            }}
          >
            <Phone size={18} weight="regular" />
            <span className="text-sm font-medium">Emergency</span>
          </button>
        </nav>

        <div 
          className="p-4 rounded-2xl flex items-center gap-3"
          style={getCardStyle()}
        >
          {user?.avatarUrl ? (
            <img
              src={user.avatarUrl}
              alt={user?.displayName || user?.username || 'User'}
              className="w-10 h-10 rounded-full object-cover border-2"
              style={{ borderColor: 'var(--border-subtle)' }}
            />
          ) : (
            <div 
              className="w-10 h-10 rounded-full flex items-center justify-center font-bold"
              style={{
                // Loại bỏ solid backgroundColor trong glass/liquid mode - dùng transparent
                backgroundColor: isGlass 
                  ? 'rgba(94, 139, 126, 0.15)'
                  : 'var(--bg-input)',
                backdropFilter: isGlass ? 'blur(8px)' : 'none',
                WebkitBackdropFilter: isGlass ? 'blur(8px)' : 'none',
                border: isGlass ? '1px solid rgba(94, 139, 126, 0.2)' : 'none',
                color: 'var(--color-sage)',
              }}
            >
              {(user?.displayName || user?.username || 'U').charAt(0).toUpperCase()}
            </div>
          )}
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold truncate" style={{ color: 'var(--text-main)' }}>
              {user?.displayName || user?.username || 'User'}
            </p>
            <p className="text-xs truncate" style={{ color: 'var(--text-muted)' }}>Free Plan</p>
          </div>
          <button
            onClick={handleSignout}
            className="transition-colors"
            style={{ color: 'var(--text-muted)' }}
            onMouseEnter={(e) => e.target.style.color = '#ef4444'}
            onMouseLeave={(e) => e.target.style.color = 'var(--text-muted)'}
          >
            <SignOut size={20} />
          </button>
        </div>
      </aside>

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-overlay backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <main className="flex-1 p-6 lg:p-10 relative z-10 overflow-y-auto h-screen max-w-[1600px] transition-all duration-500">
        {/* Mobile Header */}
        <div className="lg:hidden flex justify-between items-center mb-6">
          <div className="flex items-center gap-2 font-bold text-lg text-primary">
            <Leaf size={20} className="text-accent-sage" weight="fill" />
            Heal
          </div>
          <button onClick={() => setSidebarOpen(true)}>
            <List size={24} className="text-secondary" />
          </button>
        </div>

        {children}
      </main>
      
      {/* Crisis Help Modal */}
      <CrisisHelp isOpen={crisisOpen} onClose={() => setCrisisOpen(false)} />
    </div>
  );
};

export default DashboardLayout;

