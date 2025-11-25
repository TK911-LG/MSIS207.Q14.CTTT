import { useEffect, useRef } from 'react';

/**
 * Custom hook for managing modal UX:
 * - Saves/restores scroll position
 * - Auto focuses modal
 * - Smart positioning
 * - Accessibility support
 */
export const useModal = (isOpen, options = {}) => {
  const {
    anchorRef = null, // Ref to the element that triggered the modal
    restoreScroll = true, // Whether to restore scroll position on close
    preventBodyScroll = true, // Prevent body scroll when modal is open
  } = options;

  const modalRef = useRef(null);
  const scrollPositionRef = useRef(0);
  const previousActiveElementRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      // Save current scroll position
      scrollPositionRef.current = window.scrollY || document.documentElement.scrollTop;
      
      // Save previous active element for focus restoration
      previousActiveElementRef.current = document.activeElement;

      // Prevent body scroll
      if (preventBodyScroll) {
        document.body.style.overflow = 'hidden';
      }

      // Small delay to ensure modal is rendered
      setTimeout(() => {
        if (modalRef.current) {
          // Scroll modal into view if needed
          const modalRect = modalRef.current.getBoundingClientRect();
          const viewportHeight = window.innerHeight;
          const viewportWidth = window.innerWidth;

          // Check if modal is outside viewport
          const isOutOfView = 
            modalRect.top < 0 || 
            modalRect.bottom > viewportHeight ||
            modalRect.left < 0 ||
            modalRect.right > viewportWidth;

          // Always ensure modal is in viewport
          if (isOutOfView) {
            // Scroll modal into viewport smoothly
            modalRef.current.scrollIntoView({ 
              behavior: 'smooth', 
              block: 'center',
              inline: 'nearest'
            });
          }
          
          // If we have anchor, try to keep context visible (but don't jump too far)
          if (anchorRef?.current && !isOutOfView) {
            const anchorRect = anchorRef.current.getBoundingClientRect();
            const isAnchorVisible = 
              anchorRect.top >= 0 && 
              anchorRect.bottom <= viewportHeight &&
              anchorRect.left >= 0 &&
              anchorRect.right <= viewportWidth;
            
            // Only scroll anchor if it's reasonably close (within 1.5 viewport heights)
            if (!isAnchorVisible) {
              const distanceFromViewport = Math.min(
                Math.abs(anchorRect.top - viewportHeight),
                Math.abs(anchorRect.bottom),
                Math.abs(anchorRect.top),
                Math.abs(anchorRect.bottom - viewportHeight)
              );
              
              // Only scroll if anchor is within reasonable distance
              if (distanceFromViewport < viewportHeight * 1.5) {
                anchorRef.current.scrollIntoView({ 
                  behavior: 'smooth', 
                  block: 'nearest',
                  inline: 'nearest'
                });
              }
            }
          }

          // Focus modal for accessibility
          const focusableElement = modalRef.current.querySelector(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
          );
          if (focusableElement) {
            focusableElement.focus();
          } else {
            modalRef.current.focus();
          }
        }
      }, 50);
    } else {
      // Restore body scroll
      if (preventBodyScroll) {
        document.body.style.overflow = '';
      }

      // Restore scroll position
      if (restoreScroll) {
        window.scrollTo({
          top: scrollPositionRef.current,
          behavior: 'auto', // Instant restore, no animation
        });
      }

      // Restore focus to previous element
      if (previousActiveElementRef.current) {
        try {
          previousActiveElementRef.current.focus();
        } catch (e) {
          // Element might not be focusable anymore
        }
      }
    }

    return () => {
      // Cleanup on unmount
      if (preventBodyScroll) {
        document.body.style.overflow = '';
      }
    };
  }, [isOpen, anchorRef, restoreScroll, preventBodyScroll]);

  // Handle Escape key
  useEffect(() => {
    if (!isOpen) return;

    const handleEscape = (e) => {
      if (e.key === 'Escape') {
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen]);

  return { modalRef };
};

