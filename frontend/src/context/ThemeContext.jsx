import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext(null);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export const ThemeProvider = ({ children }) => {
  // Check localStorage and system preference
  const [theme, setTheme] = useState(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) return savedTheme;
    
    // Check system preference
    if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }
    return 'light';
  });

  // Glass mode state
  const [isGlass, setIsGlass] = useState(() => {
    const saved = localStorage.getItem('glassMode');
    return saved ? saved === 'true' : true; // Default Glass
  });

  useEffect(() => {
    const root = document.documentElement;
    
    if (theme === 'dark') {
      root.classList.add('dark');
      root.setAttribute('data-theme', 'dark');
    } else {
      root.classList.remove('dark');
      root.setAttribute('data-theme', 'light');
    }
    
    localStorage.setItem('theme', theme);
  }, [theme]);

  useEffect(() => {
    localStorage.setItem('glassMode', isGlass.toString());
  }, [isGlass]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  const toggleGlass = () => {
    setIsGlass(prev => !prev);
  };

  // --- STYLE GENERATOR (THE CORE MAGIC) ---
  // Hàm này tạo ra style object đè lên mọi CSS khác
  const getCardStyle = () => {
    const isDark = theme === 'dark';
    
    // 1. Chế độ GLASS (Kính mờ tiêu chuẩn) - Ultra transparent với blur background
    if (isGlass) {
      if (isDark) {
        // DARK GLASS MODE - Cực kỳ trong suốt, background blur rõ ràng
        // Không có gradient riêng - để background hiện qua với blur
        const glassBorder = '1px solid rgba(255, 255, 255, 0.08)';
        const glassBorderTop = '1px solid rgba(94, 139, 126, 0.25)'; // Green highlight từ trên
        const glassBorderLeft = '1px solid rgba(94, 139, 126, 0.3)'; // Green highlight từ trái
        
        // Shadow rất nhẹ để tạo depth, không che background
        const glassShadow = `
          0 8px 32px -2px rgba(0, 0, 0, 0.25),
          0 4px 16px -1px rgba(0, 0, 0, 0.15),
          inset 0 1px 0 0 rgba(255, 255, 255, 0.03)
        `;
        
        return {
          backgroundColor: 'rgba(30, 41, 59, 0.08)', // Cực kỳ trong suốt - chỉ 8% opacity
          backdropFilter: 'blur(24px) saturate(180%) brightness(1.05)',
          WebkitBackdropFilter: 'blur(24px) saturate(180%) brightness(1.05)',
          border: glassBorder,
          borderTop: glassBorderTop,
          borderLeft: glassBorderLeft,
          boxShadow: glassShadow,
          position: 'relative',
          isolation: 'isolate',
        };
      } else {
        // LIGHT GLASS MODE - Cực kỳ trong suốt, background blur rõ ràng
        // Không có gradient riêng - để background hiện qua với blur
        const glassBorder = '1px solid rgba(255, 255, 255, 0.35)';
        const glassBorderTop = '1px solid rgba(255, 255, 255, 0.55)'; // White highlight từ trên
        const glassBorderLeft = '1px solid rgba(255, 255, 255, 0.5)'; // White highlight từ trái
        
        // Shadow rất nhẹ để tách nền, không che background
        const glassShadow = `
          0 4px 24px -1px rgba(0, 0, 0, 0.06),
          inset 0 1px 0 0 rgba(255, 255, 255, 0.4)
        `;
        
        return {
          backgroundColor: 'rgba(255, 255, 255, 0.15)', // Cực kỳ trong suốt - chỉ 15% opacity
          backdropFilter: 'blur(24px) saturate(180%) brightness(1.02)',
          WebkitBackdropFilter: 'blur(24px) saturate(180%) brightness(1.02)',
          border: glassBorder,
          borderTop: glassBorderTop,
          borderLeft: glassBorderLeft,
          boxShadow: glassShadow,
          position: 'relative',
          isolation: 'isolate',
        };
      }
    }

    // 2. Chế độ SOLID (Mặc định)
    return {
      backgroundColor: 'var(--bg-card)',
      border: '1px solid var(--border-subtle)',
      boxShadow: 'var(--shadow-card)',
    };
  };

  const value = {
    theme,
    setTheme,
    toggleTheme,
    isDark: theme === 'dark',
    isGlass,
    setIsGlass,
    toggleGlass,
    getCardStyle, // Export function để các component sử dụng
  };

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

