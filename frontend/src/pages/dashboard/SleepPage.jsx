import React, { useState, useEffect } from 'react';
import { 
  Clock, Headphones, Wind, Leaf, Flame, Cloud, Moon, 
  Pause, Play, Bed, Timer, Sparkle, CheckCircle, Calendar,
  TrendUp, Plus, X, Check, Star, ChartLine, ArrowRight
} from 'phosphor-react';
import { sleepAPI } from '../../services/api';
import { useToast } from '../../context/ToastContext';
import TimePicker from '../../components/TimePicker';

const SleepPage = () => {
  const [sleepEntries, setSleepEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);
  const [activeSound, setActiveSound] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  
  // Sleep tracking state
  const [isSleeping, setIsSleeping] = useState(false);
  const [sleepStartTime, setSleepStartTime] = useState(null);
  const [showWakeUpModal, setShowWakeUpModal] = useState(false);
  const [wakeUpDuration, setWakeUpDuration] = useState(null);
  const [wakeUpQuality, setWakeUpQuality] = useState(5);
  const [wakeUpNotes, setWakeUpNotes] = useState('');
  
  // Manual log form state (for editing past entries)
  const [formData, setFormData] = useState({
    bedtime: '',
    wakeTime: '',
    quality: 5,
    notes: '',
    date: new Date().toISOString().split('T')[0],
  });
  const [isSaving, setIsSaving] = useState(false);
  const [showLogForm, setShowLogForm] = useState(false);
  
  const toast = useToast();

  // Check for active sleep session on mount
  useEffect(() => {
    const activeSleep = localStorage.getItem('activeSleepSession');
    if (activeSleep) {
      const sleepData = JSON.parse(activeSleep);
      const startTime = new Date(sleepData.startTime);
      const now = new Date();
      const duration = (now - startTime) / (1000 * 60 * 60); // hours
      
      // If sleep session is reasonable (between 2-16 hours), show wake up modal
      if (duration >= 2 && duration <= 16) {
        setIsSleeping(true);
        setSleepStartTime(startTime);
        setWakeUpDuration(duration);
        setShowWakeUpModal(true);
      } else {
        // Clear invalid session
        localStorage.removeItem('activeSleepSession');
      }
    }
    
    fetchSleepData();
  }, []);

  // Listen for page visibility changes (user coming back)
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        const activeSleep = localStorage.getItem('activeSleepSession');
        if (activeSleep) {
          const sleepData = JSON.parse(activeSleep);
          const startTime = new Date(sleepData.startTime);
          const now = new Date();
          const duration = (now - startTime) / (1000 * 60 * 60);
          
          if (duration >= 2 && duration <= 16 && !showWakeUpModal) {
            setIsSleeping(true);
            setSleepStartTime(startTime);
            setWakeUpDuration(duration);
            setShowWakeUpModal(true);
          }
        }
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [showWakeUpModal]);

  const fetchSleepData = async () => {
    try {
      setLoading(true);
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
      
      const [entriesResponse] = await Promise.all([
        sleepAPI.list({ limit: 30 }),
      ]);

      if (entriesResponse.items) {
        setSleepEntries(entriesResponse.items);
        calculateStats(entriesResponse.items, sevenDaysAgo);
      }
    } catch (error) {
      console.error('Error fetching sleep data:', error);
      toast.error('Failed to load sleep data');
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (entries, sevenDaysAgo) => {
    if (!entries || entries.length === 0) {
      setStats(null);
      return;
    }

    const totalEntries = entries.length;
    const avgDuration = entries.reduce((sum, e) => sum + (e.duration || 0), 0) / totalEntries;
    const avgQuality = entries.reduce((sum, e) => sum + (e.quality || 5), 0) / totalEntries;
    
    // Last 7 days
    const recentEntries = entries.filter(e => new Date(e.date) >= sevenDaysAgo);
    const recentAvgDuration = recentEntries.length > 0
      ? recentEntries.reduce((sum, e) => sum + (e.duration || 0), 0) / recentEntries.length
      : 0;
    
    // Calculate sleep consistency (how regular bedtime/wake time are)
    const bedtimes = entries.map(e => {
      const bed = new Date(e.bedtime);
      return bed.getHours() * 60 + bed.getMinutes(); // minutes since midnight
    });
    const wakeTimes = entries.map(e => {
      const wake = new Date(e.wakeTime);
      return wake.getHours() * 60 + wake.getMinutes();
    });
    
    const avgBedtime = bedtimes.reduce((a, b) => a + b, 0) / bedtimes.length;
    const avgWakeTime = wakeTimes.reduce((a, b) => a + b, 0) / wakeTimes.length;
    
    // Calculate variance (lower = more consistent)
    const bedtimeVariance = bedtimes.reduce((sum, b) => sum + Math.pow(b - avgBedtime, 2), 0) / bedtimes.length;
    const wakeTimeVariance = wakeTimes.reduce((sum, w) => sum + Math.pow(w - avgWakeTime, 2), 0) / wakeTimes.length;
    const consistency = Math.max(0, 100 - Math.sqrt(bedtimeVariance + wakeTimeVariance) / 2);
    
    // Get last entry for bedtime/wake time
    const lastEntry = entries[0];
    let bedtime = null;
    let wakeTime = null;
    if (lastEntry) {
      bedtime = new Date(lastEntry.bedtime);
      wakeTime = new Date(lastEntry.wakeTime);
    }

    // Calculate sleep stages (mock data for now)
    const sleepStages = {
      deep: 20,
      rem: 25,
      light: 55,
    };

    // Get last 7 days data for chart
    const last7Days = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      date.setHours(0, 0, 0, 0);
      
      const entry = entries.find(e => {
        const entryDate = new Date(e.date);
        entryDate.setHours(0, 0, 0, 0);
        return entryDate.getTime() === date.getTime();
      });
      
      last7Days.push({
        date: date.toDateString(),
        duration: entry ? entry.duration : null,
        day: date.toLocaleDateString('en-US', { weekday: 'short' }).charAt(0),
      });
    }
    
    setStats({
      totalEntries,
      avgDuration: avgDuration.toFixed(1),
      avgQuality: avgQuality.toFixed(1),
      recentCount: recentEntries.length,
      recentAvgDuration,
      consistency: Math.round(consistency),
      avgBedtime: avgBedtime,
      avgWakeTime: avgWakeTime,
      bedtime,
      wakeTime,
      sleepStages,
      last7Days,
    });
  };

  // Start sleep tracking
  const handleStartSleep = () => {
    const startTime = new Date();
    setIsSleeping(true);
    setSleepStartTime(startTime);
    
    // Save to localStorage
    localStorage.setItem('activeSleepSession', JSON.stringify({
      startTime: startTime.toISOString(),
    }));
    
    toast.success('Sleep tracking started. Sweet dreams! 💤', {
      title: 'Sleep Started',
      duration: 3000,
    });
  };

  // Wake up and log sleep
  const handleWakeUp = async () => {
    if (!sleepStartTime) return;

    setIsSaving(true);
    try {
      const wakeTime = new Date();
      const duration = (wakeTime - sleepStartTime) / (1000 * 60 * 60); // hours
      const date = new Date(sleepStartTime);
      date.setHours(0, 0, 0, 0);

      await sleepAPI.create({
        bedtime: sleepStartTime.toISOString(),
        wakeTime: wakeTime.toISOString(),
        duration,
        quality: wakeUpQuality,
        notes: wakeUpNotes || undefined,
        date: date.toISOString(),
      });

      // Clear sleep session
      localStorage.removeItem('activeSleepSession');
      setIsSleeping(false);
      setSleepStartTime(null);
      setShowWakeUpModal(false);
      setWakeUpDuration(null);
      setWakeUpQuality(5);
      setWakeUpNotes('');

      toast.success('Sleep logged successfully! 🌅', {
        title: 'Good Morning',
        duration: 3000,
      });

      fetchSleepData();
    } catch (error) {
      console.error('Error logging sleep:', error);
      toast.error('Failed to log sleep entry');
    } finally {
      setIsSaving(false);
    }
  };

  // Cancel sleep tracking
  const handleCancelSleep = () => {
    localStorage.removeItem('activeSleepSession');
    setIsSleeping(false);
    setSleepStartTime(null);
    setShowWakeUpModal(false);
    setWakeUpDuration(null);
    setWakeUpQuality(5);
    setWakeUpNotes('');
    toast.info('Sleep tracking cancelled');
  };

  // Manual log sleep (for past entries)
  const handleLogSleep = async () => {
    if (!formData.bedtime || !formData.wakeTime) {
      toast.warning('Please enter both bedtime and wake time', {
        title: 'Missing Information',
      });
      return;
    }

    setIsSaving(true);
    try {
      const bedtimeDate = new Date(`${formData.date}T${formData.bedtime}`);
      const wakeTimeDate = new Date(`${formData.date}T${formData.wakeTime}`);
      
      // If wake time is earlier than bedtime, assume next day
      if (wakeTimeDate < bedtimeDate) {
        wakeTimeDate.setDate(wakeTimeDate.getDate() + 1);
      }

      const duration = (wakeTimeDate - bedtimeDate) / (1000 * 60 * 60); // hours

      await sleepAPI.create({
        bedtime: bedtimeDate.toISOString(),
        wakeTime: wakeTimeDate.toISOString(),
        duration,
        quality: formData.quality,
        notes: formData.notes || undefined,
        date: new Date(formData.date).toISOString(),
      });

      toast.success('Sleep entry logged successfully', {
        title: 'Sleep Logged',
      });

      setFormData({
        bedtime: '',
        wakeTime: '',
        quality: 5,
        notes: '',
        date: new Date().toISOString().split('T')[0],
      });
      setShowLogForm(false);
      fetchSleepData();
    } catch (error) {
      console.error('Error logging sleep:', error);
      toast.error('Failed to log sleep entry');
    } finally {
      setIsSaving(false);
    }
  };

  // Audio player management
  useEffect(() => {
    if (!audioRef.current) return;

    if (activeSound) {
      const sound = soundscapes.find(s => s.id === activeSound);
      if (sound) {
        const API_BASE_URL = (import.meta.env.VITE_API_URL || 'http://localhost:5001').replace('/api', '');
        audioRef.current.src = `${API_BASE_URL}/sounds/${sound.file}`;
        audioRef.current.loop = true;
        audioRef.current.volume = 0.5; // Set volume to 50%
        
        if (isPlaying) {
          audioRef.current.play().catch(err => {
            console.error('Error playing audio:', err);
            toast.error('Failed to play sound. Please check your browser settings.');
          });
        } else {
          audioRef.current.pause();
        }
      }
    } else {
      audioRef.current.pause();
      audioRef.current.src = '';
    }

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
      }
    };
  }, [activeSound, isPlaying]);

  const toggleSound = (id) => {
    if (activeSound === id) {
      // Toggle play/pause
      setIsPlaying(!isPlaying);
    } else {
      // Switch to new sound
      setActiveSound(id);
      setIsPlaying(true);
    }
  };

  const soundscapes = [
    { 
      id: 'rain', 
      label: 'Gentle Rain', 
      icon: Cloud, 
      color: 'from-blue-400 to-blue-600',
      bgColor: 'bg-blue-50',
      iconColor: 'text-blue-600',
      file: 'gentle-rain-for-relaxation-and-sleep-337279.mp3'
    },
    { 
      id: 'wind', 
      label: 'Wind', 
      icon: Wind, 
      color: 'from-stone-400 to-stone-600',
      bgColor: 'bg-stone-50',
      iconColor: 'text-stone-600',
      file: 'wind.mp3'
    },
    { 
      id: 'forest', 
      label: 'Forest', 
      icon: Leaf, 
      color: 'from-green-400 to-green-600',
      bgColor: 'bg-green-50',
      iconColor: 'text-green-600',
      file: 'forest.mp3'
    },
  ];

  // Audio player ref
  const audioRef = React.useRef(null);

  const formatDuration = (hours) => {
    if (!hours) return 'N/A';
    const h = Math.floor(hours);
    const m = Math.round((hours - h) * 60);
    return `${h}h ${m}m`;
  };

  // Fetch sleep fun fact from backend
  const [funFact, setFunFact] = useState(null);
  
  useEffect(() => {
    const fetchFunFact = async () => {
      try {
        const response = await sleepAPI.getFact();
        setFunFact(response);
      } catch (error) {
        console.error('Error fetching sleep fact:', error);
        // Fallback to a default fact
        setFunFact({
          icon: '🌙',
          title: 'Sleep Cycles',
          fact: 'A full sleep cycle takes about 90 minutes. Most people need 4-6 cycles per night.',
        });
      }
    };
    fetchFunFact();
  }, []);

  // Get personalized sleep insight
  const getSleepInsight = () => {
    if (!stats) return null;
    
    const insights = [];
    
    // Duration insight
    if (stats.avgDuration < 6) {
      insights.push({
        type: 'attention',
        icon: '⚠️',
        message: `You're averaging ${stats.avgDuration}h of sleep. Most adults need 7-9 hours for optimal health.`,
        tip: 'Try going to bed 30 minutes earlier tonight.',
      });
    } else if (stats.avgDuration >= 7 && stats.avgDuration <= 9) {
      insights.push({
        type: 'positive',
        icon: '✅',
        message: `Great! You're averaging ${stats.avgDuration}h of sleep - that's in the healthy range.`,
        tip: 'Keep up the good sleep routine!',
      });
    } else if (stats.avgDuration > 9) {
      insights.push({
        type: 'info',
        icon: '💡',
        message: `You're averaging ${stats.avgDuration}h of sleep. That's on the higher side.`,
        tip: 'Quality matters more than quantity - focus on how you feel when you wake up.',
      });
    }
    
    // Consistency insight
    if (stats.consistency < 50) {
      insights.push({
        type: 'attention',
        icon: '🔄',
        message: 'Your sleep schedule varies quite a bit. Consistency helps your body clock.',
        tip: 'Try to go to bed and wake up at similar times, even on weekends.',
      });
    } else if (stats.consistency >= 70) {
      insights.push({
        type: 'positive',
        icon: '🌟',
        message: 'You have a consistent sleep schedule! This helps your circadian rhythm.',
        tip: 'Your body loves routine - keep it up!',
      });
    }
    
    // Quality insight
    if (stats.avgQuality < 5) {
      insights.push({
        type: 'attention',
        icon: '😴',
        message: `Your sleep quality is ${stats.avgQuality}/10. Consider what might be affecting it.`,
        tip: 'Try a relaxing bedtime routine: reading, meditation, or gentle stretching.',
      });
    } else if (stats.avgQuality >= 7) {
      insights.push({
        type: 'positive',
        icon: '✨',
        message: `Your sleep quality is ${stats.avgQuality}/10 - that's excellent!`,
        tip: 'Whatever you\'re doing, it\'s working well.',
      });
    }
    
    return insights[0] || null;
  };

  const insight = getSleepInsight();

  return (
    <div className="max-w-7xl mx-auto space-y-8 fade-in">
      {/* Header */}
      <header className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-5xl font-serif font-bold text-stone-900 mb-2">Sleep Tracker</h1>
          <p className="text-stone-600 text-lg">Track your well-being journey.</p>
        </div>
        <div className="flex items-center gap-3">
          {!isSleeping && !showLogForm && (
            <>
              <button
                onClick={() => setShowLogForm(true)}
                className="px-4 py-2 text-stone-600 font-semibold hover:text-stone-900 transition-colors"
              >
                Manual Log
              </button>
              <button
                onClick={handleStartSleep}
                className="flex items-center gap-2 px-6 py-3 bg-[#5E8B7E] text-white rounded-xl font-semibold hover:bg-[#4a7a6d] transition-all shadow-lg hover:shadow-xl"
              >
                <Moon size={20} weight="fill" />
                Start Sleep
              </button>
            </>
          )}
          {isSleeping && !showWakeUpModal && (
            <button
              onClick={() => {
                const now = new Date();
                const duration = (now - sleepStartTime) / (1000 * 60 * 60);
                setWakeUpDuration(duration);
                setShowWakeUpModal(true);
              }}
              className="flex items-center gap-2 px-6 py-3 bg-amber-500 text-white rounded-xl font-semibold hover:bg-amber-600 transition-all shadow-lg hover:shadow-xl animate-pulse"
            >
              <Clock size={20} weight="fill" />
              Wake Up
            </button>
          )}
        </div>
      </header>

      {/* Manual Log Sleep Form (for past entries) */}
      {showLogForm && (
        <div className="bg-white rounded-3xl p-8 card-shadow">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="text-2xl font-bold text-stone-900">Log Past Sleep</h3>
              <p className="text-sm text-stone-500 mt-1">Manually log a sleep entry from a previous night</p>
            </div>
            <button
              onClick={() => {
                setShowLogForm(false);
                setFormData({
                  bedtime: '',
                  wakeTime: '',
                  quality: 5,
                  notes: '',
                  date: new Date().toISOString().split('T')[0],
                });
              }}
              className="p-2 rounded-full hover:bg-stone-100 text-stone-400 hover:text-stone-600 transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          <div className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-stone-700 mb-2">Date</label>
              <input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:border-[#5E8B7E] focus:bg-white text-stone-800"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-stone-700 mb-2 flex items-center gap-2">
                  <Moon size={16} />
                  Bedtime
                </label>
                <TimePicker
                  value={formData.bedtime}
                  onChange={(value) => setFormData({ ...formData, bedtime: value })}
                  label="Bedtime"
                  icon={Moon}
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-stone-700 mb-2 flex items-center gap-2">
                  <Clock size={16} />
                  Wake Time
                </label>
                <TimePicker
                  value={formData.wakeTime}
                  onChange={(value) => setFormData({ ...formData, wakeTime: value })}
                  label="Wake Time"
                  icon={Clock}
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-semibold text-stone-700">
                  Sleep Quality
                </label>
                <span className="text-sm font-bold text-[#5E8B7E]">{formData.quality}/10</span>
              </div>
              <div className="flex items-center gap-2 mb-2">
                {[...Array(10)].map((_, i) => (
                  <Star
                    key={i}
                    size={20}
                    weight={i < formData.quality ? 'fill' : 'regular'}
                    className={i < formData.quality ? 'text-amber-400' : 'text-stone-300'}
                    onClick={() => setFormData({ ...formData, quality: i + 1 })}
                  />
                ))}
              </div>
              <input
                type="range"
                min="1"
                max="10"
                value={formData.quality}
                onChange={(e) => setFormData({ ...formData, quality: parseInt(e.target.value) })}
                className="w-full"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-stone-700 mb-2">Notes (Optional)</label>
              <textarea
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                placeholder="How did you sleep? Any observations?"
                rows={3}
                className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:border-[#5E8B7E] focus:bg-white text-stone-800 resize-none"
              />
            </div>

            <div className="flex gap-3 pt-2">
              <button
                onClick={() => {
                  setShowLogForm(false);
                  setFormData({
                    bedtime: '',
                    wakeTime: '',
                    quality: 5,
                    notes: '',
                    date: new Date().toISOString().split('T')[0],
                  });
                }}
                className="flex-1 px-4 py-3 bg-stone-100 text-stone-700 rounded-xl font-semibold hover:bg-stone-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleLogSleep}
                disabled={isSaving || !formData.bedtime || !formData.wakeTime}
                className="flex-1 px-4 py-3 bg-stone-900 text-white rounded-xl font-semibold hover:bg-stone-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isSaving ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Check size={18} />
                    Save Entry
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="text-stone-400 text-sm">Loading sleep data...</div>
        </div>
      ) : (
        <>
          {/* Main Grid: Sleep Insights + Sleep Duration */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Sleep Insights Card */}
            <div className="bg-white rounded-3xl p-8 card-shadow">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-xl bg-[#E7F3F0] flex items-center justify-center">
                  <Sparkle size={24} className="text-[#5E8B7E]" weight="fill" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-stone-900">Sleep Insights</h3>
                  <p className="text-xs text-stone-500 mt-1">Based on your data</p>
                </div>
              </div>

              {insight ? (
                <div className={`p-5 rounded-2xl border-2 mb-4 ${
                  insight.type === 'positive'
                    ? 'bg-emerald-50 border-emerald-200'
                    : insight.type === 'attention'
                    ? 'bg-amber-50 border-amber-200'
                    : 'bg-blue-50 border-blue-200'
                }`}>
                  <div className="flex items-start gap-3">
                    <span className="text-2xl shrink-0">{insight.icon}</span>
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-stone-900 mb-1">{insight.message}</p>
                      <p className="text-xs text-stone-600 italic">{insight.tip}</p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="p-5 rounded-2xl bg-stone-50 border border-stone-200 mb-4">
                  <p className="text-sm text-stone-600 text-center">
                    Log more sleep entries to get personalized insights
                  </p>
                </div>
              )}

              {/* Fun Fact */}
              {funFact ? (
                <div className="p-5 rounded-2xl bg-gradient-to-br from-indigo-50 to-purple-50 border border-indigo-200">
                  <div className="flex items-start gap-3">
                    <span className="text-2xl shrink-0">{funFact.icon}</span>
                    <div className="flex-1">
                      <h4 className="text-sm font-bold text-stone-900 mb-1">{funFact.title}</h4>
                      <p className="text-xs text-stone-700 leading-relaxed">{funFact.fact}</p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="p-5 rounded-2xl bg-stone-50 border border-stone-200">
                  <p className="text-xs text-stone-500 text-center">Loading sleep fact...</p>
                </div>
              )}
            </div>

            {/* Sleep Duration */}
            <div className="bg-white rounded-3xl p-8 card-shadow">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-xl font-bold text-stone-900">Sleep Duration</h3>
                  <p className="text-xs font-semibold text-stone-400 uppercase tracking-wider mt-1">
                    Last 7 Days
                  </p>
                </div>
                {stats && (
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-[#5E8B7E]"></div>
                    <span className="text-sm text-stone-500">
                      Avg: {formatDuration(stats.recentAvgDuration)}
                    </span>
                  </div>
                )}
              </div>

              {/* Days of Week - Improved Chart */}
              <div className="space-y-3">
                {stats?.last7Days.map((day, i) => {
                  const maxDuration = 10; // 10 hours max for visualization
                  const percentage = day.duration ? Math.min(100, (day.duration / maxDuration) * 100) : 0;
                  const dayNames = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
                  const fullDayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
                  
                  return (
                    <div key={i} className="flex items-center gap-3">
                      <div className="w-12 text-xs font-semibold text-stone-600">
                        {fullDayNames[i]}
                      </div>
                      <div className="flex-1 relative">
                        <div className="h-8 bg-stone-100 rounded-lg overflow-hidden">
                          {day.duration ? (
                            <div
                              className="h-full bg-gradient-to-r from-[#5E8B7E] to-[#4a7a6d] rounded-lg transition-all duration-500 flex items-center justify-end pr-2"
                              style={{ width: `${percentage}%` }}
                            >
                              {percentage > 15 && (
                                <span className="text-xs font-bold text-white">
                                  {formatDuration(day.duration)}
                                </span>
                              )}
                            </div>
                          ) : (
                            <div className="h-full flex items-center justify-center">
                              <span className="text-xs text-stone-400">No data</span>
                            </div>
                          )}
                        </div>
                      </div>
                      {day.duration && percentage <= 15 && (
                        <div className="w-16 text-xs font-semibold text-stone-700 text-right">
                          {formatDuration(day.duration)}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Bedtime and Wake Up */}
          {stats && (stats.bedtime || stats.wakeTime) && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Bedtime */}
              <div className="bg-white rounded-3xl p-6 card-shadow">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-indigo-100 flex items-center justify-center">
                    <Moon size={24} className="text-indigo-600" weight="fill" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs font-semibold text-stone-400 uppercase tracking-wider mb-1">
                      Bedtime
                    </p>
                    <p className="text-2xl font-bold text-stone-900">
                      {stats.bedtime ? stats.bedtime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'N/A'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Wake Up */}
              <div className="bg-white rounded-3xl p-6 card-shadow">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-amber-100 flex items-center justify-center">
                    <Clock size={24} className="text-amber-600" weight="fill" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs font-semibold text-stone-400 uppercase tracking-wider mb-1">
                      Wake Up
                    </p>
                    <p className="text-2xl font-bold text-stone-900">
                      {stats.wakeTime ? stats.wakeTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'N/A'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Sleep Stages and Sleep Sounds */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Sleep Stages */}
            <div className="bg-white rounded-3xl p-8 card-shadow">
              <h3 className="text-xl font-bold text-stone-900 mb-6">Sleep Stages</h3>
              
              {stats?.sleepStages ? (
                <div className="space-y-4">
                  {/* Bar Chart */}
                  <div className="flex h-12 rounded-xl overflow-hidden border border-stone-200">
                    <div
                      className="bg-indigo-500 flex items-center justify-center text-white text-xs font-bold"
                      style={{ width: `${stats.sleepStages.deep}%` }}
                    >
                      {stats.sleepStages.deep}%
                    </div>
                    <div
                      className="bg-purple-500 flex items-center justify-center text-white text-xs font-bold"
                      style={{ width: `${stats.sleepStages.rem}%` }}
                    >
                      {stats.sleepStages.rem}%
                    </div>
                    <div
                      className="bg-blue-400 flex items-center justify-center text-white text-xs font-bold"
                      style={{ width: `${stats.sleepStages.light}%` }}
                    >
                      {stats.sleepStages.light}%
                    </div>
                  </div>

                  {/* Labels */}
                  <div className="grid grid-cols-3 gap-4 text-xs">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <div className="w-3 h-3 rounded bg-indigo-500"></div>
                        <span className="font-semibold text-stone-700">Deep</span>
                      </div>
                      <p className="text-stone-500">{stats.sleepStages.deep}%</p>
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <div className="w-3 h-3 rounded bg-purple-500"></div>
                        <span className="font-semibold text-stone-700">REM</span>
                      </div>
                      <p className="text-stone-500">{stats.sleepStages.rem}%</p>
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <div className="w-3 h-3 rounded bg-blue-400"></div>
                        <span className="font-semibold text-stone-700">Light</span>
                      </div>
                      <p className="text-stone-500">{stats.sleepStages.light}%</p>
                    </div>
                  </div>
                </div>
              ) : (
                <p className="text-stone-400 text-sm">No sleep stage data available</p>
              )}
            </div>

            {/* Sleep Sounds */}
            <div className="bg-white rounded-3xl p-8 card-shadow">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-stone-900">Sleep Sounds</h3>
                {soundscapes.length > 3 && (
                  <button className="text-sm text-[#5E8B7E] font-semibold hover:underline flex items-center gap-1">
                    View All
                    <ArrowRight size={16} />
                  </button>
                )}
              </div>

              <div className="space-y-3">
                {soundscapes.map((s) => {
                  const IconComponent = s.icon;
                  const isActive = activeSound === s.id;
                  return (
                    <button
                      key={s.id}
                      onClick={() => toggleSound(s.id)}
                      className={`w-full p-4 rounded-xl border-2 transition-all flex items-center gap-4 ${
                        isActive
                          ? 'border-[#5E8B7E] bg-[#E7F3F0]'
                          : 'border-stone-200 bg-white hover:border-stone-300'
                      }`}
                    >
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                        isActive 
                          ? `bg-gradient-to-br ${s.color} text-white`
                          : `${s.bgColor} ${s.iconColor}`
                      }`}>
                        <IconComponent size={20} weight={isActive ? 'fill' : 'regular'} />
                      </div>
                      <span className="flex-1 text-left font-semibold text-stone-900">
                        {s.label}
                      </span>
                      {isActive && (
                        <div className="flex items-center gap-2">
                          {isPlaying ? (
                            <div className="flex items-center gap-1">
                              <div className="w-1.5 h-4 bg-[#5E8B7E] rounded-full animate-pulse" style={{ animationDelay: '0ms' }}></div>
                              <div className="w-1.5 h-6 bg-[#5E8B7E] rounded-full animate-pulse" style={{ animationDelay: '150ms' }}></div>
                              <div className="w-1.5 h-4 bg-[#5E8B7E] rounded-full animate-pulse" style={{ animationDelay: '300ms' }}></div>
                            </div>
                          ) : (
                            <Pause size={16} className="text-[#5E8B7E]" />
                          )}
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Hidden audio element */}
              <audio ref={audioRef} preload="metadata" />
            </div>
          </div>

          {/* Active Sleep Indicator */}
          {isSleeping && !showWakeUpModal && sleepStartTime && (
            <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-3xl p-8 text-white relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent" />
              <div className="relative z-10 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                    <Moon size={32} weight="fill" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold mb-1">Sleeping...</h3>
                    <p className="text-white/80">
                      Started at {sleepStartTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>
                <button
                  onClick={handleCancelSleep}
                  className="px-4 py-2 bg-white/20 backdrop-blur-sm rounded-xl font-semibold hover:bg-white/30 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          {/* Wake Up Modal */}
          {showWakeUpModal && wakeUpDuration && (
            <div 
              className="fixed inset-0 z-50 flex items-center justify-center p-4"
              onClick={() => setShowWakeUpModal(false)}
            >
              <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" />
              <div
                className="relative bg-white rounded-3xl shadow-2xl w-full max-w-md p-8 z-10"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="text-center mb-6">
                  <div className="w-20 h-20 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center mx-auto mb-4">
                    <Clock size={40} weight="fill" className="text-white" />
                  </div>
                  <h2 className="text-3xl font-bold text-stone-900 mb-2">Good Morning! 🌅</h2>
                  <p className="text-stone-600">
                    You slept for <span className="font-bold text-[#5E8B7E]">{formatDuration(wakeUpDuration)}</span>
                  </p>
                </div>

                <div className="space-y-4 mb-6">
                  <div>
                    <label className="block text-sm font-semibold text-stone-700 mb-2">
                      How was your sleep? {wakeUpQuality}/10
                    </label>
                    <input
                      type="range"
                      min="1"
                      max="10"
                      value={wakeUpQuality}
                      onChange={(e) => setWakeUpQuality(parseInt(e.target.value))}
                      className="w-full"
                    />
                    <div className="flex justify-between text-xs text-stone-400 mt-1">
                      <span>Poor</span>
                      <span>Excellent</span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-stone-700 mb-2">
                      Notes (Optional)
                    </label>
                    <textarea
                      value={wakeUpNotes}
                      onChange={(e) => setWakeUpNotes(e.target.value)}
                      placeholder="How did you feel?"
                      rows={3}
                      className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:border-[#5E8B7E] focus:bg-white text-stone-800 resize-none"
                    />
                  </div>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={handleCancelSleep}
                    className="flex-1 px-4 py-3 bg-stone-100 text-stone-700 rounded-xl font-semibold hover:bg-stone-200 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleWakeUp}
                    disabled={isSaving}
                    className="flex-1 px-4 py-3 bg-[#5E8B7E] text-white rounded-xl font-semibold hover:bg-[#4a7a6d] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {isSaving ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Check size={18} />
                        Log Sleep
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          )}

        </>
      )}
    </div>
  );
};

export default SleepPage;
