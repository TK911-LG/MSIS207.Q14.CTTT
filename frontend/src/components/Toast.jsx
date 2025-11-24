import React, { useEffect, useState } from 'react';
import { CheckCircle, XCircle, X, Info, Warning } from 'phosphor-react';

const Toast = ({ toast, onClose }) => {
  const [isExiting, setIsExiting] = useState(false);

  const handleClose = () => {
    setIsExiting(true);
    setTimeout(() => {
      onClose(toast.id);
    }, 200);
  };

  useEffect(() => {
    if (toast.autoClose) {
      const timer = setTimeout(() => {
        handleClose();
      }, toast.duration || 3000);
      return () => clearTimeout(timer);
    }
  }, [toast, onClose]);

  const icons = {
    success: CheckCircle,
    error: XCircle,
    info: Info,
    warning: Warning,
  };

  const colors = {
    success: {
      bg: 'bg-white',
      border: 'border-emerald-200/60',
      text: 'text-stone-900',
      icon: 'text-emerald-600',
      iconBg: 'bg-emerald-50',
    },
    error: {
      bg: 'bg-white',
      border: 'border-red-200/60',
      text: 'text-stone-900',
      icon: 'text-red-600',
      iconBg: 'bg-red-50',
    },
    info: {
      bg: 'bg-white',
      border: 'border-blue-200/60',
      text: 'text-stone-900',
      icon: 'text-blue-600',
      iconBg: 'bg-blue-50',
    },
    warning: {
      bg: 'bg-white',
      border: 'border-amber-200/60',
      text: 'text-stone-900',
      icon: 'text-amber-600',
      iconBg: 'bg-amber-50',
    },
  };

  const Icon = icons[toast.type] || Info;
  const colorScheme = colors[toast.type] || colors.info;

  return (
    <div
      className={`
        relative flex items-start gap-3 p-4 rounded-lg border shadow-[0_10px_40px_rgba(0,0,0,0.1)]
        ${colorScheme.bg} ${colorScheme.border} ${colorScheme.text}
        min-w-[320px] max-w-[420px]
        transition-all duration-200
        ${isExiting ? 'opacity-0 translate-x-4 scale-95' : 'opacity-100 translate-x-0 scale-100'}
      `}
      role="alert"
      style={{
        animation: isExiting 
          ? 'slideOutToRight 0.2s cubic-bezier(0.4, 0, 1, 1) forwards'
          : 'slideInFromTop 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards',
      }}
    >
      <div className={`${colorScheme.iconBg} rounded-lg p-2 flex-shrink-0`}>
        <Icon className={colorScheme.icon} size={18} weight="fill" />
      </div>
      <div className="flex-1 min-w-0 pt-0.5">
        {toast.title && (
          <p className="font-semibold text-sm mb-0.5 text-stone-900">{toast.title}</p>
        )}
        <p className="text-sm leading-relaxed text-stone-600">{toast.message}</p>
      </div>
      <button
        onClick={handleClose}
        className="
          flex-shrink-0 p-1.5 rounded-md transition-all
          text-stone-400 hover:text-stone-600 hover:bg-stone-100
          active:bg-stone-200
        "
        aria-label="Close"
      >
        <X size={14} weight="bold" />
      </button>
    </div>
  );
};

export default Toast;

