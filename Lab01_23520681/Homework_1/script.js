document.addEventListener('DOMContentLoaded', function() {
  // Get all navigation items and sections
  const navItems = document.querySelectorAll('.nav-item');
  const sections = document.querySelectorAll('.section');

  // Variable to store current section (instead of sessionStorage)
  let currentSection = '#profile';

  // Function to show a specific section
  function showSection(targetId) {
    // Hide all sections
    sections.forEach(section => {
      section.classList.remove('active');
    });

    // Remove active class from all nav items
    navItems.forEach(item => {
      item.classList.remove('active');
    });

    // Show target section
    const targetSection = document.querySelector(targetId);
    if (targetSection) {
      targetSection.classList.add('active');
    }

    // Add active class to clicked nav item
    const activeNav = document.querySelector(`a[href="${targetId}"]`);
    if (activeNav) {
      activeNav.classList.add('active');
    }

    // Store current section in memory
    currentSection = targetId;

    // Scroll to top smoothly
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }

  // Add click event listeners to navigation items
  navItems.forEach(item => {
    item.addEventListener('click', function(e) {
      e.preventDefault();
      const targetId = this.getAttribute('href');
      showSection(targetId);
    });
  });

  // Animate skill dots on abilities section load
  function animateSkills() {
    const dots = document.querySelectorAll('.dot.filled');
    dots.forEach((dot, index) => {
      setTimeout(() => {
        dot.style.transform = 'scale(1)';
        dot.style.opacity = '1';
      }, index * 30);
    });
  }

  // Initialize dots with animation-ready state
  const allDots = document.querySelectorAll('.dot.filled');
  allDots.forEach(dot => {
    dot.style.transform = 'scale(0)';
    dot.style.opacity = '0';
    dot.style.transition = 'transform 0.3s ease, opacity 0.3s ease';
  });

  // Observe when abilities section becomes active
  const observer = new MutationObserver(function(mutations) {
    mutations.forEach(function(mutation) {
      if (mutation.target.classList.contains('active') &&
        mutation.target.id === 'abilities') {
        setTimeout(animateSkills, 100);
      }
    });
  });

  // Observe each section for class changes
  sections.forEach(section => {
    observer.observe(section, {
      attributes: true,
      attributeFilter: ['class']
    });
  });

  // Trigger animation if abilities is already active on load
  const abilitiesSection = document.querySelector('#abilities');
  if (abilitiesSection && abilitiesSection.classList.contains('active')) {
    setTimeout(animateSkills, 100);
  }

  // Add hover effects to experience items
  const experienceItems = document.querySelectorAll('.experience-item');
  experienceItems.forEach(item => {
    item.addEventListener('mouseenter', function() {
      this.style.transform = 'translateX(10px)';
      this.style.transition = 'transform 0.3s ease';
    });

    item.addEventListener('mouseleave', function() {
      this.style.transform = 'translateX(0)';
    });
  });

  // Add smooth hover effect to buttons
  const buttons = document.querySelectorAll('.github-button, .github-link');
  buttons.forEach(button => {
    button.addEventListener('mouseenter', function() {
      this.style.transform = 'translateY(-2px)';
      this.style.transition = 'transform 0.2s ease';
    });

    button.addEventListener('mouseleave', function() {
      this.style.transform = 'translateY(0)';
    });
  });

  // Handle keyboard navigation
  document.addEventListener('keydown', function(e) {
    const currentActive = document.querySelector('.nav-item.active');
    const navItemsArray = Array.from(navItems);
    const currentIndex = navItemsArray.indexOf(currentActive);

    if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
      e.preventDefault();
      const nextIndex = (currentIndex + 1) % navItemsArray.length;
      navItemsArray[nextIndex].click();
    } else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
      e.preventDefault();
      const prevIndex = (currentIndex - 1 + navItemsArray.length) % navItemsArray.length;
      navItemsArray[prevIndex].click();
    }
  });

  // Print functionality
  document.addEventListener('keydown', function(e) {
    if ((e.ctrlKey || e.metaKey) && e.key === 'p') {
      e.preventDefault();

      // Show all sections for printing
      sections.forEach(section => {
        section.style.display = 'block';
      });

      // Print
      window.print();

      // Restore original state after print
      setTimeout(() => {
        sections.forEach(section => {
          section.style.display = '';
        });
        showSection(currentSection);
      }, 100);
    }
  });

  // Console message
  console.log('%c✨ Trinh Xuan Khai - Interactive CV', 'color: #26a69a; font-size: 18px; font-weight: bold;');
  console.log('%cNavigate using the sidebar or arrow keys!', 'color: #666; font-size: 12px;');
});
