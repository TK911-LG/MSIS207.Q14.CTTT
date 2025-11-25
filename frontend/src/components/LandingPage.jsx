import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowRight, Leaf, Brain, Activity, Lightning, Sparkle
} from 'phosphor-react';

// --- HOOKS ---
const useScrollPosition = () => {
  const [scrollPosition, setScrollPosition] = useState(0);
  useEffect(() => {
    const updatePosition = () => {
      setScrollPosition(window.scrollY);
    };
    window.addEventListener("scroll", updatePosition, { passive: true });
    updatePosition();
    return () => window.removeEventListener("scroll", updatePosition);
  }, []);
  return scrollPosition;
};

const useParallax = (speed = 0.5) => {
  const [offset, setOffset] = useState(0);
  useEffect(() => {
    const handleScroll = () => {
      setOffset(window.scrollY * speed);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [speed]);
  return offset;
};

const FadeIn = ({ children, delay = 0, className = "", direction = "up" }) => {
  const [isVisible, setVisible] = useState(false);
  const ref = useRef(null);
  
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
        }
      },
      { 
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
      }
    );
    if (ref.current) observer.observe(ref.current);
    return () => { 
      if (ref.current) observer.unobserve(ref.current); 
    };
  }, []);

  const directions = {
    up: isVisible ? 'translate-y-0' : 'translate-y-8',
    down: isVisible ? 'translate-y-0' : '-translate-y-8',
    left: isVisible ? 'translate-x-0' : 'translate-x-8',
    right: isVisible ? 'translate-x-0' : '-translate-x-8',
  };

  return (
    <div
      ref={ref}
      style={{ transitionDelay: `${delay}ms` }}
      className={`transition-all duration-500 ease-out transform ${
        isVisible ? `opacity-100 ${directions[direction]}` : `opacity-0 ${directions[direction]}`
      } ${className}`}
    >
      {children}
    </div>
  );
};

// --- STYLES ---
const CustomStyles = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
    :root {
      --bg-page: #FAFAF9;
      --text-main: #0A0A0A;
      --text-muted: #737373;
      --text-subtle: #A3A3A3;
      --sage: #5E8B7E;
      --clay: #D97757;
      --spacing-xs: 0.5rem;
      --spacing-sm: 1rem;
      --spacing-md: 1.5rem;
      --spacing-lg: 2rem;
      --spacing-xl: 3rem;
      --spacing-2xl: 4rem;
      --spacing-3xl: 6rem;
    }
    
    * {
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
      text-rendering: optimizeLegibility;
    }
    
    html {
      scroll-behavior: smooth;
    }
    
    body {
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      background-color: var(--bg-page);
      color: var(--text-main);
      overflow-x: hidden;
      letter-spacing: -0.01em;
    }
    
    .bg-grid-pattern {
      background-size: 40px 40px;
      background-image: linear-gradient(to right, rgba(28, 25, 23, 0.03) 1px, transparent 1px),
                        linear-gradient(to bottom, rgba(28, 25, 23, 0.03) 1px, transparent 1px);
      mask-image: radial-gradient(circle at center, black 40%, transparent 100%); 
      animation: gridMove 20s linear infinite;
    }
    
    @keyframes gridMove {
      0% { transform: translate(0, 0); }
      100% { transform: translate(40px, 40px); }
    }
    
    .aura-glow {
      background: radial-gradient(circle, rgba(94, 139, 126, 0.15) 0%, transparent 70%);
      filter: blur(60px);
      animation: pulseGlow 8s ease-in-out infinite;
    }
    
    @keyframes pulseGlow {
      0%, 100% { opacity: 0.6; transform: scale(1); }
      50% { opacity: 0.8; transform: scale(1.05); }
    }
    
    .bento-card {
      background: rgba(255, 255, 255, 1);
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      will-change: transform, box-shadow;
    }
    
    .bento-card:hover {
      border-color: rgba(94, 139, 126, 0.3);
      box-shadow: 0 8px 24px -4px rgba(0, 0, 0, 0.08);
      transform: translateY(-2px);
    }
    
    @keyframes float { 
      0%, 100% { transform: translateY(0px) rotate(0deg); } 
      50% { transform: translateY(-20px) rotate(1deg); } 
    }
    
    .animate-float { 
      animation: float 12s ease-in-out infinite;
    }
    
    
    
    .glass-effect {
      background: rgba(255, 255, 255, 0.6);
      backdrop-filter: blur(20px);
      -webkit-backdrop-filter: blur(20px);
      border: 1px solid rgba(255, 255, 255, 0.3);
    }
    
    .parallax-slow {
      transform: translateZ(0);
      will-change: transform;
    }
  `}</style>
);

// --- COMPONENTS ---
const Navbar = ({ onLogin, onSignup }) => {
  const scrollPos = useScrollPosition();
  const [isScrolled, setIsScrolled] = useState(false);
  
  useEffect(() => {
    setIsScrolled(scrollPos > 20);
  }, [scrollPos]);
  
  return (
    <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ease-out ${
      isScrolled 
        ? 'bg-white/80 backdrop-blur-xl border-b border-stone-200/50 shadow-[0_1px_0_0_rgba(0,0,0,0.05)]' 
        : 'bg-transparent'
    }`}>
      <div className="max-w-7xl mx-auto px-6 md:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2.5 cursor-pointer group" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
          <div className="w-8 h-8 rounded-lg bg-[#5E8B7E] flex items-center justify-center text-white transition-transform duration-200 group-hover:scale-105">
            <Leaf size={18} weight="fill" />
          </div>
          <span className="font-semibold text-stone-900 text-base tracking-tight">Heal</span>
        </div>
        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-stone-600">
          {['Features', 'How it works', 'Pricing'].map(item => (
            <a 
              key={item} 
              href={`#${item.toLowerCase().replace(/\s+/g, '-')}`}
              onClick={(e) => {
                e.preventDefault();
                const id = item.toLowerCase().replace(/\s+/g, '-');
                document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="hover:text-stone-900 transition-colors duration-200 relative group"
            >
              {item}
              <span className="absolute -bottom-1 left-0 w-0 h-[1.5px] bg-stone-900 transition-all duration-200 group-hover:w-full"></span>
            </a>
          ))}
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={onLogin} 
            className="text-sm font-medium text-stone-600 hover:text-stone-900 px-4 py-2 transition-colors duration-200"
          >
            Log in
          </button>
          <button 
            onClick={onSignup} 
            className="text-sm font-semibold bg-stone-900 text-white px-4 py-2 rounded-lg hover:bg-stone-800 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
          >
            Start Free
          </button>
        </div>
      </div>
    </nav>
  );
};

const BentoItem = ({ title, desc, icon: Icon, children, className, delay }) => (
  <FadeIn delay={delay} className={`bento-card rounded-[32px] p-8 relative overflow-hidden group ${className}`}>
    <div className="relative z-10 h-full flex flex-col">
      <div className="w-12 h-12 rounded-2xl bg-white border border-stone-100 flex items-center justify-center mb-6 text-stone-700 shadow-sm group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 group-hover:bg-[#E7F3F0] group-hover:text-[#5E8B7E]">
        <Icon size={24} weight="regular" />
      </div>
      <h3 className="text-xl font-bold text-stone-800 mb-2 group-hover:text-[#5E8B7E] transition-colors duration-300">{title}</h3>
      <p className="text-stone-500 text-sm leading-relaxed mb-8 max-w-[90%]">{desc}</p>
      <div className="mt-auto w-full flex items-center justify-center">
        {children}
      </div>
    </div>
    <div className="absolute inset-0 bg-gradient-to-br from-white/0 via-[#5E8B7E]/0 to-[#5E8B7E]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
  </FadeIn>
);

const MoodVisual = () => (
  <div className="w-full h-32 bg-stone-50 rounded-xl border border-stone-100 relative overflow-hidden flex items-end px-2 gap-1 group-hover:bg-stone-100 transition-colors duration-500">
    {[40, 65, 45, 80, 55, 90, 70].map((h, i) => (
      <div 
        key={i} 
        className="flex-1 bg-[#5E8B7E] opacity-20 rounded-t-md transition-all duration-700 group-hover:opacity-50 group-hover:scale-105" 
        style={{
          height: `${h}%`,
          transitionDelay: `${i * 50}ms`
        }} 
      />
    ))}
    <div className="absolute top-4 left-4 bg-white px-3 py-1 rounded-full text-[10px] font-bold text-[#5E8B7E] shadow-sm border border-[#5E8B7E]/20 group-hover:scale-105 transition-transform duration-300">
      Weekly Flow
    </div>
  </div>
);

const FocusVisual = () => (
  <div className="w-full aspect-square max-w-[180px] bg-stone-900 rounded-full flex items-center justify-center relative shadow-xl group-hover:scale-110 transition-transform duration-700 mx-auto">
    <div className="absolute inset-0 border-2 border-stone-700 rounded-full opacity-30 animate-spin-slow" style={{ animationDuration: '20s' }} />
    <div className="text-white text-center">
      <div className="text-3xl font-mono font-bold tracking-tighter">25:00</div>
      <div className="text-[10px] text-stone-400 uppercase tracking-widest mt-1">Focus</div>
    </div>
    <div className="absolute -bottom-2 bg-[#D97757] w-2 h-2 rounded-full animate-ping" />
  </div>
);

const JournalVisual = () => (
  <div className="w-full bg-white rounded-xl border border-stone-100 p-4 shadow-sm relative group-hover:-translate-y-3 group-hover:shadow-lg transition-all duration-500">
    <div className="h-2 w-1/3 bg-stone-200 rounded mb-3 group-hover:bg-[#5E8B7E]/20 transition-colors duration-300" />
    <div className="h-1.5 w-full bg-stone-100 rounded mb-1.5 group-hover:bg-stone-200 transition-colors duration-300" />
    <div className="h-1.5 w-5/6 bg-stone-100 rounded mb-1.5 group-hover:bg-stone-200 transition-colors duration-300" />
    <div className="h-1.5 w-4/6 bg-stone-100 rounded group-hover:bg-stone-200 transition-colors duration-300" />
    <div className="absolute top-4 right-4 text-[#5E8B7E] group-hover:scale-125 group-hover:rotate-12 transition-all duration-300">
      <Sparkle size={16} />
    </div>
  </div>
);

const LandingContent = ({ onSignup }) => {
  const heroRef = useRef(null);
  const parallaxOffset = useParallax(0.3);
  
  return (
    <div className="pt-32 pb-20 px-6">
      {/* Hero Section */}
      <section className="max-w-5xl mx-auto text-center mb-32 relative" ref={heroRef}>
        <div 
          className="aura-glow absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] -z-10"
          style={{ transform: `translate(-50%, -50%) translateY(${parallaxOffset * 0.5}px)` }}
        />
        
        <FadeIn delay={100}>
          <h1 className="text-6xl md:text-8xl font-bold tracking-[-0.02em] text-stone-900 leading-[1.05] mb-6 md:mb-8">
            Your journey to <br className="hidden md:block" />
            <span className="text-[#5E8B7E]">healing starts here.</span>
          </h1>
        </FadeIn>
        
        <FadeIn delay={200}>
          <p className="text-xl md:text-2xl text-stone-600 max-w-3xl mx-auto mb-12 md:mb-16 leading-[1.6] font-normal">
            A compassionate space to track your emotions, nurture your wellbeing, and heal from within. Designed with care for your mental health journey.
          </p>
        </FadeIn>
        
        <FadeIn delay={300}>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button 
              onClick={onSignup} 
              className="h-14 px-8 rounded-lg bg-stone-900 text-white text-base font-semibold flex items-center gap-2 group relative hover:bg-stone-800 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
            >
              <span className="relative z-10">Start healing today</span>
              <ArrowRight size={18} className="group-hover:translate-x-0.5 transition-transform duration-200 relative z-10" />
            </button>
            <button 
              onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}
              className="h-14 px-8 rounded-lg border border-stone-300 text-stone-700 text-base font-semibold hover:bg-stone-50 transition-all duration-200"
            >
              Learn more
            </button>
          </div>
        </FadeIn>
        
        <FadeIn delay={500} className="mt-24 relative">
          <div 
            className="relative rounded-2xl border border-stone-200/80 glass-effect shadow-2xl overflow-hidden aspect-[16/10] group animate-float"
            style={{ transform: `translateY(${parallaxOffset * 0.2}px)` }}
          >
            <div className="absolute left-0 top-0 bottom-0 w-64 border-r border-stone-100 bg-stone-50/50 p-6 hidden md:block text-left">
              <div className="flex gap-2 mb-8">
                <div className="w-3 h-3 rounded-full bg-red-400 animate-pulse" style={{ animationDelay: '0s' }} />
                <div className="w-3 h-3 rounded-full bg-yellow-400 animate-pulse" style={{ animationDelay: '0.2s' }} />
                <div className="w-3 h-3 rounded-full bg-green-400 animate-pulse" style={{ animationDelay: '0.4s' }} />
              </div>
              <div className="space-y-3">
                {[1,2,3,4].map(i => (
                  <div 
                    key={i} 
                    className="h-8 w-full bg-stone-200/50 rounded-lg group-hover:bg-stone-300/50 transition-colors duration-300"
                    style={{ transitionDelay: `${i * 50}ms` }}
                  />
                ))}
              </div>
            </div>
            <div className="ml-0 md:ml-64 p-8 text-left">
              <div className="h-10 w-1/3 bg-stone-200 rounded-lg mb-8 group-hover:bg-stone-300 transition-colors duration-300" />
              <div className="grid grid-cols-3 gap-6">
                {[1,2,3].map(i => (
                  <div 
                    key={i} 
                    className="h-32 bg-stone-100 rounded-2xl border border-stone-200 group-hover:border-[#5E8B7E]/30 transition-all duration-500 group-hover:scale-105"
                    style={{ transitionDelay: `${i * 100}ms` }}
                  />
                ))}
              </div>
              <div className="mt-8 h-48 bg-stone-50 rounded-2xl border border-stone-200 flex items-center justify-center text-stone-300 font-mono text-sm group-hover:bg-stone-100 transition-colors duration-300">
                Interactive Dashboard Preview
              </div>
            </div>
          </div>
          <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 w-[90%] h-20 bg-[#5E8B7E] opacity-20 blur-[100px] -z-10" />
        </FadeIn>
      </section>

      {/* Social Proof */}
      <FadeIn delay={100}>
        <section className="py-12 md:py-16 border-y border-stone-200/60 bg-white/80 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto text-center">
            <p className="text-xs text-stone-500 font-medium tracking-wider mb-8 uppercase">Trusted by teams at</p>
            <div className="flex flex-wrap justify-center gap-12 md:gap-16 items-center">
              {['Vogue', 'HEADSPACE', 'Linear', 'CALM'].map((brand, i) => (
                <div 
                  key={brand} 
                  className="text-lg md:text-xl font-semibold text-stone-400 hover:text-stone-600 transition-colors duration-200 cursor-default"
                >
                  {brand}
                </div>
              ))}
            </div>
          </div>
        </section>
      </FadeIn>

      {/* Features Bento Grid */}
      <section id="features" className="py-24 md:py-32 max-w-7xl mx-auto">
        <FadeIn>
          <div className="mb-16 md:mb-20 max-w-3xl">
            <h2 className="text-4xl md:text-5xl font-bold text-stone-900 mb-5 tracking-[-0.02em] leading-[1.1]">
              Designed for <span className="text-[#5E8B7E]">flow state</span>.
            </h2>
            <p className="text-lg md:text-xl text-stone-600 leading-[1.6]">Every interaction is optimized to reduce cognitive load. You just focus on yourself.</p>
          </div>
        </FadeIn>
        <div className="grid grid-cols-1 md:grid-cols-3 grid-rows-2 gap-4 md:gap-6">
          <BentoItem 
            className="md:col-span-2 md:row-span-2 bg-white border border-stone-200/60"
            title="Intelligent Mood Tracking"
            desc="Log your emotional state in seconds. The system automatically analyzes and visualizes your emotional flow over weeks and months."
            icon={Activity}
            delay={100}
          >
            <MoodVisual />
          </BentoItem>
          <BentoItem 
            className="bg-white border border-stone-200/60"
            title="Deep Focus Mode"
            desc="Integrated Pomodoro Timer and ambient sounds to help you enter the flow state."
            icon={Lightning}
            delay={200}
          >
            <FocusVisual />
          </BentoItem>
          <BentoItem 
            className="bg-white border border-stone-200/60"
            title="Gratitude Journal"
            desc="A safe, private space with daily writing prompts to overcome writer's block."
            icon={Brain}
            delay={300}
          >
            <JournalVisual />
          </BentoItem>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-24 md:py-32 border-t border-stone-200/60">
        <div className="max-w-7xl mx-auto">
          <FadeIn>
            <div className="mb-16 md:mb-20 max-w-3xl">
              <h2 className="text-4xl md:text-5xl font-bold text-stone-900 mb-5 tracking-[-0.02em] leading-[1.1]">
                How it works
              </h2>
              <p className="text-lg md:text-xl text-stone-600 leading-[1.6]">Get started in minutes. Simple, intuitive, and designed for your wellbeing.</p>
            </div>
          </FadeIn>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-16 relative">
            <div className="hidden md:block absolute top-12 left-0 w-full h-px bg-gradient-to-r from-stone-200 via-stone-300 to-stone-200 -z-10" />
            {[
              { step: "01", title: "Set up your space", desc: "Customize your interface and choose the habits you want to cultivate." },
              { step: "02", title: "Daily check-in", desc: "Spend 2 minutes each morning and evening to log emotions and thoughts." },
              { step: "03", title: "View Insights", desc: "Receive weekly analysis reports to understand yourself better." }
            ].map((item, i) => (
              <FadeIn key={i} delay={i * 100} direction="up">
                <div className="bg-white w-14 h-14 rounded-xl border border-stone-200 flex items-center justify-center text-lg font-semibold text-stone-700 mb-6 hover:border-[#5E8B7E] hover:bg-[#5E8B7E]/5 transition-all duration-200">
                  {item.step}
                </div>
                <h3 className="text-xl md:text-2xl font-semibold text-stone-900 mb-3 tracking-tight">{item.title}</h3>
                <p className="text-base text-stone-600 leading-[1.6]">{item.desc}</p>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section id="pricing" className="py-24 md:py-32 px-6">
        <FadeIn>
          <div className="max-w-4xl mx-auto bg-stone-900 rounded-2xl p-12 md:p-20 text-center relative overflow-hidden">
            <div className="relative z-10">
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-5 tracking-[-0.02em] leading-[1.1]">
                Begin your healing journey today.
              </h2>
              <p className="text-stone-400 text-lg md:text-xl mb-10 max-w-xl mx-auto leading-[1.6]">
                Join thousands of people who are taking steps toward better mental health and emotional wellbeing.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <button 
                  onClick={onSignup} 
                  className="bg-white text-stone-900 px-8 py-3.5 rounded-lg text-base font-semibold hover:bg-stone-100 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
                >
                  Start your free trial
                </button>
                <button 
                  onClick={() => document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' })}
                  className="text-white/80 text-base font-medium hover:text-white transition-colors duration-200"
                >
                  Learn more →
                </button>
              </div>
              <p className="mt-8 text-sm text-stone-500">No credit card required • Cancel anytime</p>
            </div>
            <div className="absolute top-0 right-0 w-96 h-96 bg-[#5E8B7E]/20 rounded-full blur-[120px] -z-10" />
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#D97757]/20 rounded-full blur-[120px] -z-10" />
          </div>
        </FadeIn>
      </section>

      {/* Footer */}
      <footer className="border-t border-stone-200/60 py-12 md:py-16 bg-white">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6 md:gap-8 px-6 md:px-8">
          <div className="flex items-center gap-2.5 cursor-pointer group" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <div className="w-7 h-7 rounded-lg bg-[#5E8B7E] flex items-center justify-center text-white transition-transform duration-200 group-hover:scale-105">
              <Leaf size={16} weight="fill" />
            </div>
            <span className="font-semibold text-stone-900">Heal</span>
          </div>
          <div className="flex gap-6 md:gap-8 text-sm text-stone-600 font-medium">
            {['About', 'Terms', 'Privacy', 'Twitter'].map(link => (
              <a 
                key={link} 
                href="#" 
                className="hover:text-stone-900 transition-colors duration-200"
              >
                {link}
              </a>
            ))}
          </div>
          <p className="text-xs text-stone-500">© 2025 Heal Inc.</p>
        </div>
      </footer>
    </div>
  );
};

export default function LandingPage() {
  const navigate = useNavigate();
  
  useEffect(() => {
    // Smooth scroll on mount
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);
  
  return (
    <div className="min-h-screen selection:bg-[#5E8B7E] selection:text-white" data-theme="light" style={{ backgroundColor: '#FAFAF9' }}>
      <CustomStyles />
      <div className="bg-grid-pattern fixed inset-0 z-[-1] opacity-60 pointer-events-none" />
      <Navbar onLogin={() => navigate('/login')} onSignup={() => navigate('/signup')} />
      <LandingContent onSignup={() => navigate('/signup')} />
    </div>
  );
}
