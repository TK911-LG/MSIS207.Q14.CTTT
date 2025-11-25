import React, { useState, useEffect } from 'react';
import { Activity, Moon, Calendar, ArrowCounterClockwise, Check, Target } from 'phosphor-react';
import { moodAPI } from '../../services/api';
import { useToast } from '../../context/ToastContext';
import { useTheme } from '../../context/ThemeContext';

// Helper functions for emotion wheel
const polarToCartesian = (centerX, centerY, radius, angleInDegrees) => {
  const angleInRadians = ((angleInDegrees - 90) * Math.PI) / 180.0;
  return {
    x: centerX + radius * Math.cos(angleInRadians),
    y: centerY + radius * Math.sin(angleInRadians),
  };
};

const describeArc = (x, y, innerRadius, outerRadius, startAngle, endAngle) => {
  const start = polarToCartesian(x, y, outerRadius, endAngle);
  const end = polarToCartesian(x, y, outerRadius, startAngle);
  const start2 = polarToCartesian(x, y, innerRadius, endAngle);
  const end2 = polarToCartesian(x, y, innerRadius, startAngle);
  const largeArcFlag = endAngle - startAngle <= 180 ? '0' : '1';
  return [
    'M',
    start.x,
    start.y,
    'A',
    outerRadius,
    outerRadius,
    0,
    largeArcFlag,
    0,
    end.x,
    end.y,
    'L',
    end2.x,
    end2.y,
    'A',
    innerRadius,
    innerRadius,
    0,
    largeArcFlag,
    1,
    start2.x,
    start2.y,
    'Z',
  ].join(' ');
};

const MOOD_DATA = {
  energized: {
    label: 'Energized',
    color: '#E8B39A',
    startAngle: 0,
    endAngle: 90,
    clusters: [
      { id: 'joyful', label: 'Joyful', sub: ['Happy', 'Cheerful', 'Delighted'] },
      { id: 'confident', label: 'Confident', sub: ['Proud', 'Strong', 'Bold'] },
    ],
  },
  agitated: {
    label: 'Agitated',
    color: '#C7C1E8',
    startAngle: 90,
    endAngle: 180,
    clusters: [
      { id: 'anxious', label: 'Anxious', sub: ['Worried', 'Nervous', 'Uneasy'] },
      { id: 'angry', label: 'Angry', sub: ['Frustrated', 'Annoyed', 'Bitter'] },
    ],
  },
  drained: {
    label: 'Drained',
    color: '#D4D2CD',
    startAngle: 180,
    endAngle: 270,
    clusters: [
      { id: 'sad', label: 'Sad', sub: ['Lonely', 'Hurt', 'Disappointed'] },
      { id: 'fatigued', label: 'Fatigued', sub: ['Tired', 'Exhausted', 'Bored'] },
    ],
  },
  calm: {
    label: 'Calm',
    color: '#BFD3C5',
    startAngle: 270,
    endAngle: 360,
    clusters: [
      { id: 'peaceful', label: 'Peaceful', sub: ['Relaxed', 'Serene', 'Safe'] },
      { id: 'content', label: 'Content', sub: ['Satisfied', 'Grateful', 'Okay'] },
    ],
  },
};

const EmotionWheelUI = ({ onSelect, selectedZone, selectedCluster }) => {
  const size = 360;
  const center = size / 2;
  const r0 = 60;
  const r1 = 110;
  const r2 = 160;

  return (
    <div className="relative w-full max-w-[400px] aspect-square mx-auto flex items-center justify-center select-none">
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className="w-full h-full drop-shadow-2xl"
        style={{ display: 'block', margin: '0 auto' }}
        preserveAspectRatio="xMidYMid meet"
      >
        {Object.entries(MOOD_DATA).map(([key, zone]) => {
          const isDimmed = selectedZone && selectedZone !== key;
          const isActive = selectedZone === key;
          return (
            <g
              key={key}
              onClick={() => onSelect('zone', key)}
              className={`transition-all duration-300 cursor-pointer ${
                isDimmed ? 'opacity-20 grayscale' : ''
              }`}
              style={{ transformOrigin: `${center}px ${center}px` }}
            >
              <path
                d={describeArc(center, center, r0 + 4, r1, zone.startAngle + 2, zone.endAngle - 2)}
                fill={zone.color}
                className="transition-all duration-300 hover:brightness-95"
              />
              {(!selectedZone || isActive) && (
                <text
                  x={polarToCartesian(center, center, (r0 + r1) / 2, (zone.startAngle + zone.endAngle) / 2).x}
                  y={polarToCartesian(center, center, (r0 + r1) / 2, (zone.startAngle + zone.endAngle) / 2).y}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  className="pointer-events-none"
                  style={{
                    fontSize: '11px',
                    textTransform: 'uppercase',
                    letterSpacing: '1px',
                    fontWeight: 600,
                    fill: 'var(--text-primary)',
                  }}
                >
                  {zone.label}
                </text>
              )}
            </g>
          );
        })}

        {Object.entries(MOOD_DATA).map(([zoneKey, zone]) => {
          const isZoneActive = selectedZone === zoneKey;
          return zone.clusters.map((cluster, i) => {
            const totalAngle = zone.endAngle - zone.startAngle;
            const clusterAngle = totalAngle / zone.clusters.length;
            const start = zone.startAngle + i * clusterAngle;
            const end = start + clusterAngle;
            const isClusterActive = selectedCluster === cluster.id;

            return (
              <g
                key={cluster.id}
                onClick={(e) => {
                  e.stopPropagation();
                  if (isZoneActive) onSelect('cluster', cluster.id);
                  else onSelect('zone', zoneKey);
                }}
                className={`transition-all duration-300 ${
                  !isZoneActive ? 'opacity-20 pointer-events-none' : 'opacity-100'
                } ${isClusterActive ? 'brightness-90' : ''} cursor-pointer`}
                style={{ 
                  transitionDelay: isZoneActive ? '100ms' : '0ms',
                  transformOrigin: `${center}px ${center}px`,
                  transform: !isZoneActive ? 'scale(0.9)' : isClusterActive ? 'scale(1.02)' : 'scale(1)'
                }}
              >
                <path
                  d={describeArc(center, center, r1 + 4, r2, start + 1, end - 1)}
                  fill={zone.color}
                  style={{ filter: 'brightness(0.95)' }}
                />
                <text
                  x={polarToCartesian(center, center, (r1 + r2) / 2, (start + end) / 2).x}
                  y={polarToCartesian(center, center, (r1 + r2) / 2, (start + end) / 2).y}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  className="pointer-events-none"
                  style={{ fill: '#1c1917', fontSize: '10px', fontWeight: 600 }}
                >
                  {cluster.label}
                </text>
              </g>
            );
          });
        })}

        <circle cx={center} cy={center} r={r0 - 5} fill="white" className="drop-shadow-sm" />
        <foreignObject 
          x={center - 50} 
          y={center - 35} 
          width="100" 
          height="70"
          style={{ overflow: 'visible' }}
        >
          <div className="w-full h-full flex flex-col items-center justify-center text-center pointer-events-none" style={{ display: 'flex' }}>
            {selectedZone ? (
              <>
                <span className="text-[10px] text-secondary uppercase tracking-wide">You feel</span>
                <span className="text-sm font-bold text-primary leading-tight">
                  {selectedCluster
                    ? Object.values(MOOD_DATA)
                        .flatMap((z) => z.clusters)
                        .find((c) => c.id === selectedCluster)?.label
                    : MOOD_DATA[selectedZone].label}
                </span>
                {!selectedCluster && (
                  <span className="text-[8px] text-secondary mt-1">Tap to refine</span>
                )}
              </>
            ) : (
              <>
                <span className="text-[10px] text-secondary uppercase tracking-wide">How are</span>
                <span className="text-sm font-bold text-primary">You?</span>
              </>
            )}
          </div>
        </foreignObject>
      </svg>
    </div>
  );
};

const SmartCheckIn = ({ onSave, getCardStyle }) => {
  const [zone, setZone] = useState(null);
  const [cluster, setCluster] = useState(null);
  const [specificEmotion, setSpecificEmotion] = useState(null);
  const [note, setNote] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const toast = useToast();

  const handleWheelSelect = (type, id) => {
    if (type === 'zone') {
      if (zone === id) {
        setZone(null);
        setCluster(null);
      } else {
        setZone(id);
        setCluster(null);
      }
    } else if (type === 'cluster') {
      setCluster(id);
    }
  };

  const handleReset = () => {
    setZone(null);
    setCluster(null);
    setSpecificEmotion(null);
    setNote('');
  };

  const handleSave = async () => {
    if (!zone || !cluster) {
      toast.warning('Please select an emotion first', {
        title: 'Selection Required',
      });
      return;
    }

    setIsSaving(true);
    try {
      const emotionToScore = {
        'joyful': 9,
        'confident': 8,
        'anxious': 4,
        'angry': 3,
        'sad': 2,
        'fatigued': 3,
        'peaceful': 7,
        'content': 8,
      };
      
      const score = emotionToScore[cluster] || 5;
      const tags = [MOOD_DATA[zone].label];
      if (specificEmotion) {
        tags.push(specificEmotion);
      }

      await moodAPI.create({
        score,
        note: note || undefined,
        tags,
        date: new Date().toISOString(),
      });

      const emotionLabel = Object.values(MOOD_DATA)
        .flatMap((z) => z.clusters)
        .find((c) => c.id === cluster)?.label || MOOD_DATA[zone].label;

      toast.success(`Your ${emotionLabel.toLowerCase()} mood has been saved`, {
        title: 'Mood Saved',
        duration: 4000,
      });
      
      handleReset();
      if (onSave) {
        onSave();
      }
    } catch (error) {
      console.error('Error saving mood:', error);
      toast.error('Failed to save mood entry. Please try again.', {
        title: 'Save Failed',
      });
    } finally {
      setIsSaving(false);
    }
  };

  const currentClusterObj =
    zone && cluster ? MOOD_DATA[zone].clusters.find((c) => c.id === cluster) : null;

  return (
    <div className="rounded-3xl mb-8 relative overflow-hidden min-h-[500px] flex flex-col fade-in-up" style={getCardStyle()}>
      <div className="px-8 pt-8 pb-4 flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-primary">Daily Check-in</h2>
          <p className="text-secondary text-sm">Explore your emotions.</p>
        </div>
        {zone && (
          <button
            onClick={handleReset}
            className="p-2 rounded-full bg-tertiary text-secondary hover:bg-tertiary/80 transition-colors"
          >
            <ArrowCounterClockwise size={16} />
          </button>
        )}
      </div>

      <div className="flex-1 flex flex-col lg:flex-row">
        <div className="flex-1 flex flex-col items-center justify-center p-6 relative">
          <EmotionWheelUI
            selectedZone={zone}
            selectedCluster={cluster}
            onSelect={handleWheelSelect}
          />
        </div>

        <div
          className={`flex-1 p-8 border-t lg:border-t-0 lg:border-l border-primary flex flex-col transition-all duration-500 ${
            cluster ? 'opacity-100 translate-x-0' : 'opacity-50 lg:opacity-100'
          }`}
        >
          {cluster ? (
            <div className="flex flex-col h-full fade-in-up">
              <div className="mb-8">
                <label className="text-xs font-bold text-secondary uppercase tracking-wider mb-3 block">
                  Refine Emotion
                </label>
                <div className="flex flex-wrap gap-2">
                  {currentClusterObj.sub.map((e) => (
                    <button
                      key={e}
                      onClick={() => setSpecificEmotion(e)}
                      className={`px-4 py-2 rounded-full text-sm font-bold border transition-all ${
                        specificEmotion === e
                          ? 'bg-primary text-inverse border-primary'
                          : 'bg-elevated text-primary border-primary hover:border-accent-sage'
                      }`}
                    >
                      {e}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex-1 flex flex-col mb-8">
                <label className="text-xs font-bold text-secondary uppercase tracking-wider mb-3 block">
                  Notes
                </label>
                <textarea
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="Add a quick note..."
                  className="w-full flex-1 bg-tertiary border border-primary rounded-xl p-4 text-sm text-primary placeholder-secondary focus:outline-none focus:ring-2 focus:ring-accent-sage/20 resize-none"
                />
              </div>

              <button
                onClick={handleSave}
                disabled={isSaving}
                className="w-full bg-primary text-inverse py-4 rounded-xl font-bold shadow-lg hover:opacity-90 transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isSaving ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    Save Entry <Check size={18} />
                  </>
                )}
              </button>
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-center text-tertiary">
              <div className="w-16 h-16 rounded-full bg-tertiary mb-4 flex items-center justify-center">
                <Target size={24} />
              </div>
              <p className="max-w-[200px]">
                Select an emotion cluster from the wheel to add details.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const MoodCalendar = ({ currentMonth, setCurrentMonth, refreshTrigger, getCardStyle }) => {
  const [days, setDays] = useState([]);
  const [loading, setLoading] = useState(true);
  const [moodData, setMoodData] = useState({});

  useEffect(() => {
    fetchMoodData();
  }, [currentMonth, refreshTrigger]);

  const fetchMoodData = async () => {
    try {
      setLoading(true);
      const year = currentMonth.getFullYear();
      const month = currentMonth.getMonth();
      
      const firstDay = new Date(year, month, 1);
      const lastDay = new Date(year, month + 1, 0);
      
      const response = await moodAPI.list({
        from: firstDay.toISOString(),
        to: lastDay.toISOString(),
        all: true,
      });

      // Create a map of date -> mood score
      const moodMap = {};
      if (response.items && response.items.length > 0) {
        response.items.forEach((mood) => {
          const date = new Date(mood.date);
          const dateKey = date.getDate();
          if (!moodMap[dateKey] || new Date(mood.date) > new Date(moodMap[dateKey].date)) {
            moodMap[dateKey] = mood;
          }
        });
      }
      setMoodData(moodMap);
    } catch (error) {
      console.error('Error fetching mood data:', error);
      setMoodData({});
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Generate calendar days for current month
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDayOfWeek = new Date(year, month, 1).getDay();
    
    // Adjust to start week on Monday (0 = Sunday, 1 = Monday, etc.)
    const adjustedFirstDay = firstDayOfWeek === 0 ? 6 : firstDayOfWeek - 1;
    
    const calendarDays = [];
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < adjustedFirstDay; i++) {
      calendarDays.push({ day: null, mood: null, isEmpty: true });
    }
    
    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const mood = moodData[day];
      calendarDays.push({
        day,
        mood: mood ? mood.score : null,
        moodId: mood ? mood._id : null,
        date: new Date(year, month, day),
      });
    }
    
    setDays(calendarDays);
  }, [currentMonth, moodData]);

  const getMoodColor = (score) => {
    if (!score) return 'bg-tertiary border border-dashed border-primary text-tertiary';
    
    // Map score (1-10) to color categories - using theme-aware colors
    if (score >= 8) return 'bg-emerald-300 dark:bg-emerald-400 text-emerald-900 dark:text-emerald-50'; // Very positive
    if (score >= 6) return 'bg-teal-200 dark:bg-teal-300 text-teal-900 dark:text-teal-50'; // Positive
    if (score >= 4) return 'bg-tertiary text-primary'; // Neutral
    if (score >= 2) return 'bg-orange-200 dark:bg-orange-300 text-orange-900 dark:text-orange-50'; // Low
    return 'bg-indigo-200 dark:bg-indigo-300 text-indigo-900 dark:text-indigo-50'; // Very low
  };

  const getMonthName = () => {
    return currentMonth.toLocaleString('default', { month: 'long', year: 'numeric' });
  };

  const handlePrevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  };

  return (
    <div
      className="p-8 rounded-3xl h-full flex flex-col fade-in-up"
      style={{ ...getCardStyle(), animationDelay: '100ms' }}
    >
      <div className="flex justify-between items-center mb-8">
        <div>
          <h3 className="font-bold text-lg text-primary">{getMonthName()}</h3>
          <p className="text-xs text-secondary font-medium mt-1">Mood History</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handlePrevMonth}
            className="p-2 bg-tertiary hover:bg-tertiary/80 rounded-full transition-colors"
            aria-label="Previous month"
          >
            <Calendar size={16} className="text-secondary" />
          </button>
          <button
            onClick={handleNextMonth}
            className="p-2 bg-tertiary hover:bg-tertiary/80 rounded-full transition-colors"
            aria-label="Next month"
            disabled={currentMonth >= new Date()}
          >
            <Calendar size={16} className="text-secondary rotate-180" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-4 mb-4 px-2">
        {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((d, i) => (
          <div
            key={i}
            className="text-center text-[10px] font-bold text-secondary uppercase tracking-wider"
          >
            {d}
          </div>
        ))}
      </div>

      {loading ? (
        <div className="flex-1 flex items-center justify-center">
          <div className="text-secondary text-sm">Loading...</div>
        </div>
      ) : days.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center text-center py-12">
          <div className="w-16 h-16 rounded-full bg-tertiary mb-4 flex items-center justify-center">
            <Calendar size={24} className="text-tertiary" />
          </div>
          <p className="text-secondary text-sm font-medium">No mood data yet</p>
          <p className="text-tertiary text-xs mt-1">Start tracking your mood to see patterns</p>
        </div>
      ) : (
        <div className="grid grid-cols-7 gap-3 flex-1 px-2 pb-2">
          {days.map((d, i) => {
            if (d.isEmpty) {
              return <div key={i} className="aspect-square" />;
            }
            return (
              <div
                key={i}
                data-tooltip={d.mood ? `Mood: ${d.mood}/10` : 'No entry'}
                className={`aspect-square rounded-xl flex items-center justify-center text-sm font-bold transition-all cursor-pointer relative group hover:scale-110 hover:shadow-md ${getMoodColor(
                  d.mood
                )}`}
              >
                {d.day}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

const MonthlyReport = ({ currentMonth, refreshTrigger, getCardStyle }) => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, [currentMonth, refreshTrigger]);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const year = currentMonth.getFullYear();
      const month = currentMonth.getMonth();
      
      const firstDay = new Date(year, month, 1);
      const lastDay = new Date(year, month + 1, 0);
      
      const response = await moodAPI.list({
        from: firstDay.toISOString(),
        to: lastDay.toISOString(),
        all: true,
      });

      if (response.items && response.items.length > 0) {
        const moods = response.items;
        const total = moods.length;
        
        const distribution = {
          veryHigh: moods.filter(m => m.score >= 8).length,
          high: moods.filter(m => m.score >= 6 && m.score < 8).length,
          neutral: moods.filter(m => m.score >= 4 && m.score < 6).length,
          low: moods.filter(m => m.score >= 2 && m.score < 4).length,
          veryLow: moods.filter(m => m.score < 2).length,
        };

        const avgScore = moods.reduce((sum, m) => sum + m.score, 0) / total;

        // Find most common tag (if any)
        const allTags = moods.flatMap(m => m.tags || []);
        const tagCounts = {};
        allTags.forEach(tag => {
          tagCounts[tag] = (tagCounts[tag] || 0) + 1;
        });
        const topTag = Object.entries(tagCounts).sort((a, b) => b[1] - a[1])[0];

        setStats({
          total,
          distribution,
          avgScore,
          topTag: topTag ? { name: topTag[0], count: topTag[1] } : null,
        });
      } else {
        setStats(null);
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
      setStats(null);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="p-6 rounded-3xl h-full fade-in-up flex items-center justify-center" style={getCardStyle()}>
        <div className="text-secondary text-sm">Loading...</div>
      </div>
    );
  }

  if (!stats || stats.total === 0) {
    return (
      <div className="p-6 rounded-3xl h-full fade-in-up flex flex-col items-center justify-center text-center" style={getCardStyle()}>
        <div className="w-16 h-16 rounded-full bg-tertiary mb-4 flex items-center justify-center">
          <Activity size={24} className="text-tertiary" />
        </div>
        <p className="text-secondary text-sm font-medium">No data yet</p>
        <p className="text-tertiary text-xs mt-1">Start tracking to see insights</p>
      </div>
    );
  }

  const { distribution, avgScore, topTag, total } = stats;

  return (
    <div className="p-6 rounded-[32px] h-full fade-in-up flex flex-col" style={getCardStyle()}>
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-accent-clay-light rounded-full flex items-center justify-center text-accent-clay">
          <Activity size={20} />
        </div>
        <div>
          <h3 className="font-bold text-primary">Monthly Report</h3>
          <p className="text-xs text-secondary">Analysis</p>
        </div>
      </div>
      <div className="space-y-6 flex-1">
        <div>
          <p className="text-xs font-bold text-secondary uppercase mb-3">Mood Balance</p>
          <div className="flex h-4 rounded-full overflow-hidden w-full">
            {distribution.veryHigh > 0 && (
              <div 
                className="bg-emerald-300" 
                style={{ width: `${(distribution.veryHigh / total) * 100}%` }}
              />
            )}
            {distribution.high > 0 && (
              <div 
                className="bg-teal-200" 
                style={{ width: `${(distribution.high / total) * 100}%` }}
              />
            )}
            {distribution.neutral > 0 && (
              <div 
                className="bg-stone-200" 
                style={{ width: `${(distribution.neutral / total) * 100}%` }}
              />
            )}
            {distribution.low > 0 && (
              <div 
                className="bg-orange-200" 
                style={{ width: `${(distribution.low / total) * 100}%` }}
              />
            )}
            {distribution.veryLow > 0 && (
              <div 
                className="bg-indigo-200" 
                style={{ width: `${(distribution.veryLow / total) * 100}%` }}
              />
            )}
          </div>
          <p className="text-xs text-secondary mt-2">Avg: {avgScore.toFixed(1)}/10</p>
        </div>
        {topTag && (
          <div className="p-4 bg-tertiary rounded-2xl border border-primary">
            <p className="text-xs font-bold text-secondary uppercase mb-2">Most Common</p>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400">
                  <Moon size={14} />
                </div>
                <span className="text-sm font-bold text-primary">{topTag.name}</span>
              </div>
              <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/30 px-2 py-1 rounded-md">
                {topTag.count}x
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const MoodPage = () => {
  const { getCardStyle } = useTheme();
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleMoodSave = () => {
    // Trigger refresh of calendar and report
    setRefreshTrigger(prev => prev + 1);
  };

  return (
    <div className="max-w-6xl mx-auto fade-in space-y-8">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-primary">Mood Journal</h1>
        <p className="text-secondary">Track your emotional well-being.</p>
      </header>

      <SmartCheckIn onSave={handleMoodSave} getCardStyle={getCardStyle} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 h-auto lg:h-[400px]">
        <div className="lg:col-span-2 h-full">
          <MoodCalendar 
            currentMonth={currentMonth} 
            setCurrentMonth={setCurrentMonth}
            refreshTrigger={refreshTrigger}
            getCardStyle={getCardStyle}
          />
        </div>

        <div className="lg:col-span-1 h-full">
          <MonthlyReport currentMonth={currentMonth} refreshTrigger={refreshTrigger} getCardStyle={getCardStyle} />
        </div>
      </div>
    </div>
  );
};

export default MoodPage;

