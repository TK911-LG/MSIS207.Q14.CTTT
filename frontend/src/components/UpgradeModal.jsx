import React, { useEffect, useRef } from 'react';
import { X, Sparkle, Check, Crown } from 'phosphor-react';
import { useTheme } from '../context/ThemeContext';
import { useModal } from '../hooks/useModal';

const UpgradeModal = ({ isOpen, onClose, anchorRef = null }) => {
  const { getCardStyle, isDark } = useTheme();
  const { modalRef } = useModal(isOpen, { anchorRef, restoreScroll: true, preventBodyScroll: true });
  const closeButtonRef = useRef(null);

  // Handle Escape key
  useEffect(() => {
    if (!isOpen) return;

    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  // Focus trap: keep focus within modal
  useEffect(() => {
    if (!isOpen || !modalRef.current) return;

    const modal = modalRef.current;
    const focusableElements = modal.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    const handleTab = (e) => {
      if (e.key !== 'Tab') return;

      if (e.shiftKey) {
        // Shift + Tab
        if (document.activeElement === firstElement) {
          e.preventDefault();
          lastElement?.focus();
        }
      } else {
        // Tab
        if (document.activeElement === lastElement) {
          e.preventDefault();
          firstElement?.focus();
        }
      }
    };

    modal.addEventListener('keydown', handleTab);
    return () => modal.removeEventListener('keydown', handleTab);
  }, [isOpen, modalRef]);

  if (!isOpen) return null;

  const features = [
    'Unlimited notifications & reminders',
    'Advanced analytics & insights',
    'Priority customer support',
    'Export your data anytime',
    'Custom themes & personalization',
    'Early access to new features',
  ];

  // Determine positioning based on viewport
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ 
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        // Smooth backdrop
        backdropFilter: 'blur(4px)',
        WebkitBackdropFilter: 'blur(4px)',
      }}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="upgrade-modal-title"
    >
      <div
        ref={modalRef}
        className={`relative w-full max-w-md rounded-[32px] p-6 md:p-8 max-h-[90vh] overflow-y-auto ${
          isMobile ? 'mb-auto mt-auto max-h-[85vh]' : ''
        }`}
        style={{
          ...getCardStyle(),
          position: 'relative',
          overscrollBehavior: 'contain',
          // Smooth scroll
          scrollBehavior: 'smooth',
        }}
        onClick={(e) => e.stopPropagation()}
        tabIndex={-1}
      >
        <button
          ref={closeButtonRef}
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full hover:bg-elevated transition-colors z-10 focus:outline-none focus:ring-2 focus:ring-accent-sage focus:ring-offset-2"
          style={{ color: 'var(--text-secondary)' }}
          aria-label="Close modal"
        >
          <X size={20} />
        </button>

        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-4"
            style={{
              background: isDark 
                ? 'linear-gradient(135deg, rgba(251, 146, 60, 0.2) 0%, rgba(94, 139, 126, 0.2) 100%)'
                : 'linear-gradient(135deg, rgba(251, 146, 60, 0.15) 0%, rgba(94, 139, 126, 0.15) 100%)',
            }}
          >
            <Crown size={32} weight="fill" style={{ color: 'var(--accent-sage)' }} />
          </div>
          <h2 id="upgrade-modal-title" className="text-2xl font-bold text-primary mb-2">Upgrade to Pro</h2>
          <p className="text-sm text-secondary">
            Unlock powerful features to enhance your wellness journey
          </p>
        </div>

        <div className="space-y-3 mb-6">
          {features.map((feature, index) => (
            <div key={index} className="flex items-start gap-3">
              <div className="mt-0.5 flex-shrink-0">
                <Check 
                  size={18} 
                  weight="bold" 
                  style={{ color: 'var(--accent-sage)' }} 
                />
              </div>
              <p className="text-sm text-primary flex-1">{feature}</p>
            </div>
          ))}
        </div>

        <div className="space-y-3">
          <button
            onClick={() => {
              // Navigate to checkout page (default to monthly plan)
              onClose();
              window.location.href = '/dashboard/checkout?plan=monthly';
            }}
            className="w-full py-3 px-4 rounded-2xl font-bold text-white transition-all hover:scale-105 active:scale-95"
            style={{
              background: 'linear-gradient(135deg, var(--accent-sage) 0%, var(--accent-clay) 100%)',
              boxShadow: '0 4px 16px rgba(94, 139, 126, 0.3)',
            }}
          >
            Upgrade Now
          </button>
          <button
            onClick={onClose}
            className="w-full py-2 px-4 rounded-2xl font-medium transition-colors"
            style={{
              color: 'var(--text-secondary)',
              backgroundColor: 'transparent',
            }}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.03)';
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = 'transparent';
            }}
          >
            Maybe Later
          </button>
        </div>

        <div className="mt-6 pt-6 border-t" style={{ borderColor: 'var(--border-subtle)' }}>
          <p className="text-xs text-secondary text-center">
            <Sparkle size={12} className="inline mr-1" weight="duotone" />
            Pro members get exclusive access to premium features
          </p>
        </div>
      </div>
    </div>
  );
};

export default UpgradeModal;

