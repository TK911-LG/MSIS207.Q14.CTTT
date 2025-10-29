function scrollToSection(id) {
  document.getElementById(id).scrollIntoView({ behavior: 'smooth' });
}

document.querySelectorAll('.nav-links a').forEach(link => {
  link.addEventListener('click', function(e) {
    e.preventDefault();
    const targetId = this.getAttribute('href').substring(1);
    document.getElementById(targetId).scrollIntoView({ behavior: 'smooth' });
  });
});

window.addEventListener('scroll', () => {
  const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
  const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
  const scrolled = (winScroll / height) * 100;
  document.getElementById('progressBar').style.width = scrolled + '%';
});

let breathingActive = false;
const breathingCircle = document.getElementById('breathingCircle');
const breathingText = document.getElementById('breathingText');
const breathingInstruction = document.getElementById('breathingInstruction');

breathingCircle.addEventListener('click', () => {
  if (!breathingActive) {
    breathingActive = true;
    breathingCircle.classList.add('active');
    runBreathingExercise();
  } else {
    breathingActive = false;
    breathingCircle.classList.remove('active');
    breathingText.textContent = 'Start';
    breathingInstruction.textContent = 'Click the circle to begin a calming breathing exercise';
  }
});

function runBreathingExercise() {
  if (!breathingActive) return;
  breathingText.textContent = 'Breathe In';
  breathingInstruction.textContent = 'Inhale slowly through your nose...';

  setTimeout(() => {
    if (!breathingActive) return;
    breathingText.textContent = 'Hold';
    breathingInstruction.textContent = 'Hold your breath gently...';
  }, 4000);

  setTimeout(() => {
    if (!breathingActive) return;
    breathingText.textContent = 'Breathe Out';
    breathingInstruction.textContent = 'Exhale slowly through your mouth...';
  }, 6000);

  setTimeout(() => {
    if (breathingActive) {
      runBreathingExercise();
    }
  }, 8000);
}

const moodEmojis = document.querySelectorAll('.mood-emoji');
moodEmojis.forEach(emoji => {
  emoji.addEventListener('click', function() {
    moodEmojis.forEach(e => e.classList.remove('selected'));
    this.classList.add('selected');
    const mood = this.dataset.mood;
    const moodTitle = this.title;
    showNotification(`Mood tracked: ${moodTitle}. Keep taking care of yourself! 💜`);
    console.log('Mood tracked:', mood);
  });
});

const cards = document.querySelectorAll('.card');
cards.forEach(card => {
  card.addEventListener('mouseenter', function() {
    this.style.transform = 'translateY(-10px) rotate(2deg)';
  });

  card.addEventListener('mouseleave', function() {
    this.style.transform = 'translateY(0) rotate(0deg)';
  });
});

document.getElementById('contactForm').addEventListener('submit', (e) => {
  e.preventDefault();
  const formData = new FormData(e.target);
  showNotification('Thank you for reaching out. We\'ll get back to you soon! 💚');
  e.target.reset();
  console.log('Form submitted');
});

function showNotification(message) {
  const notification = document.getElementById('notification');
  const notificationText = document.getElementById('notificationText');

  notificationText.textContent = message;
  notification.classList.add('show');

  setTimeout(() => {
    notification.classList.remove('show');
  }, 3000);
}

const observerOptions = {
  threshold: 0.1,
  rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = '1';
      entry.target.style.transform = 'translateY(0)';
    }
  });
}, observerOptions);

document.querySelectorAll('.card, .resource-card').forEach(el => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(30px)';
  el.style.transition = 'all 0.6s ease';
  observer.observe(el);
});

window.addEventListener('scroll', () => {
  const scrolled = window.pageYOffset;
  const hero = document.querySelector('.hero-content');
  if (hero) {
    hero.style.transform = `translateY(${scrolled * 0.5}px)`;
  }
});

document.querySelectorAll('.resource-link').forEach(link => {
  link.addEventListener('click', (e) => {
    e.preventDefault();
    const cardTitle = e.target.closest('.resource-card').querySelector('h4').textContent;
    showNotification(`Opening ${cardTitle}...`);
  });
});

moodEmojis.forEach((emoji, index) => {
  emoji.setAttribute('tabindex', '0');
  emoji.addEventListener('keypress', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      emoji.click();
    }
  });
});

window.addEventListener('load', () => {
  document.body.style.opacity = '0';
  setTimeout(() => {
    document.body.style.transition = 'opacity 0.5s';
    document.body.style.opacity = '1';
  }, 100);
});

console.log('%cMindWell 💜', 'color: #667eea; font-size: 24px; font-weight: bold;');
console.log('%cYour mental health matters. Take care of yourself!', 'color: #764ba2; font-size: 14px;');
