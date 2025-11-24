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
      className={`transition-all duration-700 ease-out transform ${
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
    @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
    :root {
      --bg-page: #FAFAF9;
      --text-main: #1C1917;
      --text-muted: #78716C;
      --sage: #5E8B7E;
      --clay: #D97757;
    }
    
    * {
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
    }
    
    html {
      scroll-behavior: smooth;
    }
    
    body {
      font-family: 'Plus Jakarta Sans', sans-serif;
      background-color: var(--bg-page);
      color: var(--text-main);
      overflow-x: hidden;
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
      background: rgba(255, 255, 255, 0.7);
      backdrop-filter: blur(20px);
      -webkit-backdrop-filter: blur(20px);
      border: 1px solid rgba(28, 25, 23, 0.08);
      transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
      will-change: transform;
    }
    
    .bento-card:hover {
      background: rgba(255, 255, 255, 0.95);
      border-color: rgba(94, 139, 126, 0.25);
      box-shadow: 0 24px 48px -12px rgba(94, 139, 126, 0.15);
      transform: translateY(-4px) scale(1.01);
    }
    
    @keyframes float { 
      0%, 100% { transform: translateY(0px) rotate(0deg); } 
      50% { transform: translateY(-20px) rotate(1deg); } 
    }
    
    .animate-float { 
      animation: float 12s ease-in-out infinite;
    }
    
    .btn-primary {
      background: #1C1917;
      color: white;
      box-shadow: 0 4px 12px rgba(0,0,0,0.1);
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      position: relative;
      overflow: hidden;
    }
    
    .btn-primary::before {
      content: '';
      position: absolute;
      top: 0;
      left: -100%;
      width: 100%;
      height: 100%;
      background: linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent);
      transition: left 0.5s;
    }
    
    .btn-primary:hover::before {
      left: 100%;
    }
    
    .btn-primary:hover {
      background: #292524;
      transform: translateY(-2px);
      box-shadow: 0 12px 24px rgba(0,0,0,0.2);
    }
    
    .btn-primary:active {
      transform: translateY(0);
    }
    
    .smooth-reveal {
      opacity: 0;
      transform: translateY(30px);
      transition: opacity 0.8s ease-out, transform 0.8s ease-out;
    }
    
    .smooth-reveal.revealed {
      opacity: 1;
      transform: translateY(0);
    }
    
    .gradient-text {
      background: linear-gradient(135deg, #5E8B7E 0%, #2F5F55 50%, #5E8B7E 100%);
      background-size: 200% 200%;
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      animation: gradientShift 5s ease infinite;
    }
    
    @keyframes gradientShift {
      0%, 100% { background-position: 0% 50%; }
      50% { background-position: 100% 50%; }
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
    <nav className={`fixed top-0 w-full z-50 transition-all duration-500 ease-out ${
      isScrolled 
        ? 'bg-[#FAFAF9]/90 backdrop-blur-xl border-b border-stone-200/60 shadow-sm' 
        : 'bg-transparent'
    }`}>
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2 cursor-pointer group" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
          <div className="w-8 h-8 rounded-lg bg-[#E7F3F0] flex items-center justify-center text-[#5E8B7E] transition-transform duration-300 group-hover:scale-110 group-hover:rotate-12">
            <Leaf size={18} weight="fill" />
          </div>
          <span className="font-bold text-stone-800 text-lg tracking-tight transition-colors group-hover:text-[#5E8B7E]">Heal</span>
        </div>
        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-stone-500">
          {['Method', 'Features', 'Science', 'Pricing'].map(item => (
            <a 
              key={item} 
              href="#" 
              className="hover:text-[#5E8B7E] transition-all duration-300 hover:scale-105 relative group"
            >
              {item}
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#5E8B7E] transition-all duration-300 group-hover:w-full"></span>
            </a>
          ))}
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={onLogin} 
            className="text-sm font-semibold text-stone-600 hover:text-stone-900 px-3 py-2 transition-all duration-300 hover:scale-105"
          >
            Log in
          </button>
          <button 
            onClick={onSignup} 
            className="text-sm font-semibold btn-primary px-4 py-2 rounded-full"
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
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-stone-900 leading-[1.1] mb-8">
            Your journey to <br className="hidden md:block" />
            <span className="gradient-text">healing starts here.</span>
          </h1>
        </FadeIn>
        
        <FadeIn delay={200}>
          <p className="text-lg md:text-xl text-stone-500 max-w-2xl mx-auto mb-10 leading-relaxed">
            A compassionate space to track your emotions, nurture your wellbeing, and heal from within. Designed with care for your mental health journey.
          </p>
        </FadeIn>
        
        <FadeIn delay={300}>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button 
              onClick={onSignup} 
              className="h-14 px-8 rounded-full btn-primary text-lg font-bold flex items-center gap-2 group relative"
            >
              <span className="relative z-10">Start healing today</span>
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform duration-300 relative z-10" />
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
        <section className="py-12 border-y border-stone-100 bg-white/50 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto text-center">
            <p className="text-xs text-stone-400 font-bold tracking-widest mb-8 uppercase">Trusted by teams at</p>
            <div className="flex flex-wrap justify-center gap-16 opacity-40 grayscale mix-blend-multiply">
              {['Vogue', 'HEADSPACE', 'Linear', 'CALM'].map((brand, i) => (
                <div 
                  key={brand} 
                  className="text-xl font-black text-stone-800 hover:opacity-60 transition-opacity duration-300 cursor-default"
                  style={{ 
                    fontFamily: i === 0 ? 'serif' : i === 2 ? 'monospace' : 'sans-serif',
                    transitionDelay: `${i * 50}ms`
                  }}
                >
                  {brand}
                </div>
              ))}
            </div>
          </div>
        </section>
      </FadeIn>

      {/* Features Bento Grid */}
      <section className="py-32 max-w-7xl mx-auto">
        <FadeIn>
          <div className="mb-16 max-w-2xl">
            <h2 className="text-3xl md:text-4xl font-bold text-stone-900 mb-4">
              Designed for <span className="text-[#D97757] font-serif italic">flow state</span>.
            </h2>
            <p className="text-lg text-stone-500">Every interaction is optimized to reduce cognitive load. You just focus on yourself.</p>
          </div>
        </FadeIn>
        <div className="grid grid-cols-1 md:grid-cols-3 grid-rows-2 gap-6">
          <BentoItem 
            className="md:col-span-2 md:row-span-2 bg-white"
            title="Intelligent Mood Tracking"
            desc="Log your emotional state in seconds. The system automatically analyzes and visualizes your emotional flow over weeks and months."
            icon={Activity}
            delay={100}
          >
            <MoodVisual />
          </BentoItem>
          <BentoItem 
            className="bg-[#FAFAF9]"
            title="Deep Focus Mode"
            desc="Integrated Pomodoro Timer and ambient sounds (Rain, White Noise) to help you enter the flow state."
            icon={Lightning}
            delay={200}
          >
            <FocusVisual />
          </BentoItem>
          <BentoItem 
            className="bg-white"
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
      <section className="py-24 border-t border-stone-100">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
            <div className="hidden md:block absolute top-8 left-0 w-full h-0.5 bg-gradient-to-r from-stone-200 via-stone-200 to-transparent -z-10" />
            {[
              { step: "01", title: "Set up your space", desc: "Customize your interface and choose the habits you want to cultivate." },
              { step: "02", title: "Daily check-in", desc: "Spend 2 minutes each morning and evening to log emotions and thoughts." },
              { step: "03", title: "View Insights", desc: "Receive weekly analysis reports to understand yourself better." }
            ].map((item, i) => (
              <FadeIn key={i} delay={i * 150} direction="up">
                <div className="bg-[#FAFAF9] w-16 h-16 rounded-2xl border border-stone-200 flex items-center justify-center text-xl font-bold text-stone-400 mb-6 shadow-sm hover:scale-110 hover:border-[#5E8B7E]/30 transition-all duration-300">
                  {item.step}
                </div>
                <h3 className="text-xl font-bold text-stone-800 mb-3">{item.title}</h3>
                <p className="text-stone-500 leading-relaxed">{item.desc}</p>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-32 px-6">
        <FadeIn>
          <div className="max-w-4xl mx-auto bg-[#1C1917] rounded-[40px] p-12 md:p-20 text-center relative overflow-hidden shadow-2xl">
            <div className="absolute inset-0 opacity-10 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] mix-blend-overlay" />
            <div className="relative z-10">
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 tracking-tight">
                Begin your healing journey today.
              </h2>
              <p className="text-stone-400 text-lg mb-10 max-w-xl mx-auto">
                Join thousands of people who are taking steps toward better mental health and emotional wellbeing.
              </p>
              <button 
                onClick={onSignup} 
                className="bg-white text-[#1C1917] px-10 py-4 rounded-full text-lg font-bold hover:bg-stone-100 transition-all hover:scale-105 active:scale-95 shadow-[0_0_40px_-10px_rgba(255,255,255,0.3)] hover:shadow-[0_0_60px_-10px_rgba(255,255,255,0.4)]"
              >
                Start your free trial
              </button>
              <p className="mt-6 text-sm text-stone-500">No credit card required • Cancel anytime</p>
            </div>
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#5E8B7E] rounded-full blur-[100px] opacity-20 animate-pulse" style={{ animationDuration: '4s' }} />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#D97757] rounded-full blur-[100px] opacity-20 animate-pulse" style={{ animationDuration: '6s', animationDelay: '1s' }} />
          </div>
        </FadeIn>
      </section>

      {/* Footer */}
      <footer className="border-t border-stone-200 py-16 bg-white">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8 px-6">
          <div className="flex items-center gap-2 hover:scale-105 transition-transform duration-300 cursor-pointer">
            <div className="w-6 h-6 rounded bg-stone-100 flex items-center justify-center text-[#5E8B7E]">
              <Leaf size={14} weight="fill" />
            </div>
            <span className="font-bold text-stone-800">Heal</span>
          </div>
          <div className="flex gap-8 text-sm text-stone-500 font-medium">
            {['About Us', 'Terms', 'Privacy', 'Twitter'].map(link => (
              <a 
                key={link} 
                href="#" 
                className="hover:text-stone-900 transition-all duration-300 hover:scale-105"
              >
                {link}
              </a>
            ))}
          </div>
          <p className="text-xs text-stone-400">© 2025 Heal Inc.</p>
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
    <div className="min-h-screen selection:bg-[#5E8B7E] selection:text-white">
      <CustomStyles />
      <div className="bg-grid-pattern fixed inset-0 z-[-1] opacity-60 pointer-events-none" />
      <Navbar onLogin={() => navigate('/login')} onSignup={() => navigate('/signup')} />
      <LandingContent onSignup={() => navigate('/signup')} />
    </div>
  );
}
