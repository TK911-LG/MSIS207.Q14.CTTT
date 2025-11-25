import React, { useState, useEffect } from 'react';
import { Activity, TrendUp, Moon, Target, Flame, ChartLine, Lightbulb, ArrowRight, Sparkle, Heart, Clock, Calendar, CheckCircle } from 'phosphor-react';
import { moodAPI, habitAPI, sleepAPI } from '../../services/api';
import { useTheme } from '../../context/ThemeContext';
import { getGreeting, getDynamicWelcomeMessage } from '../../utils/personalization';

// Generate smooth bezier curve path (catmull-rom to bezier)
const generateSmoothPath = (points, tension = 0.4) => {
  if (points.length < 2) return '';
  if (points.length === 2) {
    return `M ${points[0].x},${points[0].y} L ${points[1].x},${points[1].y}`;
  }

  let path = `M ${points[0].x},${points[0].y}`;
  
  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[Math.max(0, i - 1)];
    const p1 = points[i];
    const p2 = points[i + 1];
    const p3 = points[Math.min(points.length - 1, i + 2)];
    
    const cp1x = p1.x + (p2.x - p0.x) * tension / 3;
    const cp1y = p1.y + (p2.y - p0.y) * tension / 3;
    const cp2x = p2.x - (p3.x - p1.x) * tension / 3;
    const cp2y = p2.y - (p3.y - p1.y) * tension / 3;
    
    path += ` C ${cp1x},${cp1y} ${cp2x},${cp2y} ${p2.x},${p2.y}`;
  }
  
  return path;
};

const InsightsPage = () => {
  const { getCardStyle, isDark } = useTheme();
  const [moodHistory, setMoodHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [moodStats, setMoodStats] = useState(null);
  const [habitStats, setHabitStats] = useState(null);
  const [habits, setHabits] = useState([]);
  const [sleepData, setSleepData] = useState([]);
  const [userName, setUserName] = useState('');

  useEffect(() => {
    fetchInsights();
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    setUserName(user.name || user.displayName || '');
  }, []);

  const fetchInsights = async () => {
    try {
      setLoading(true);

      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      thirtyDaysAgo.setHours(0, 0, 0, 0);
      const today = new Date();
      today.setHours(23, 59, 59, 999);

      const [moodResponse, moodStatsResponse, habitResponse, habitStatsResponse, sleepResponse] = await Promise.all([
        moodAPI.list({
          from: thirtyDaysAgo.toISOString(),
          to: today.toISOString(),
          all: true,
        }),
        moodAPI.getStats({
          from: thirtyDaysAgo.toISOString(),
          to: today.toISOString(),
          includeTrend: 'true',
        }),
        habitAPI.list(),
        habitAPI.getStats(),
        sleepAPI.list({
          from: thirtyDaysAgo.toISOString(),
          to: today.toISOString(),
        }),
      ]);

      if (moodResponse.items && moodResponse.items.length > 0) {
        const moods = moodResponse.items.sort((a, b) => new Date(a.date) - new Date(b.date));
        setMoodHistory(moods);
      }

      if (moodStatsResponse) {
        setMoodStats({
          total: moodStatsResponse.total || 0,
          avgScore: moodStatsResponse.averageScore || 0,
          distribution: moodStatsResponse.distribution || {
            veryHigh: 0, high: 0, neutral: 0, low: 0, veryLow: 0,
          },
          topTag: moodStatsResponse.topTags?.[0] || null,
          trend: moodStatsResponse.trend || null,
        });
      }

      let processedHabits = [];
      if (habitResponse.items && habitResponse.items.length > 0) {
        if (habitStatsResponse) {
          setHabitStats({
            total: habitStatsResponse.total || 0,
            completedToday: habitStatsResponse.completedToday || 0,
            streak: habitStatsResponse.streak || 0,
          });

          processedHabits = habitStatsResponse.habits.map((habit) => {
            const completions = habit.completedDates?.length || 0;
            const completionRate = completions > 0 ? Math.round((completions / 30) * 100) : 0;
            
            return {
              id: habit._id,
              title: typeof habit.name === 'string' ? habit.name : String(habit.name || 'Untitled'),
              streak: habit.streak || 0,
              completed: habit.completed || false,
              iconName: habit.iconName || 'heart',
              completionRate,
              totalCompletions: completions,
              _original: habit,
            };
          });
        } else {
          processedHabits = habitResponse.items.map((habit) => {
            const completions = habit.completedDates?.length || 0;
            const completionRate = completions > 0 ? Math.round((completions / 30) * 100) : 0;
            
            return {
              id: habit._id,
              title: typeof habit.name === 'string' ? habit.name : String(habit.name || 'Untitled'),
              streak: 0,
              completed: false,
              iconName: habit.iconName || 'heart',
              completionRate,
              totalCompletions: completions,
              _original: habit,
            };
          });
        }

        setHabits(processedHabits);
      }

      if (sleepResponse.items && sleepResponse.items.length > 0) {
        setSleepData(sleepResponse.items);
      }
    } catch (error) {
      console.error('Error fetching insights:', error);
    } finally {
      setLoading(false);
    }
  };

  const getMoodTrendData = () => {
    const days = [];
    const today = new Date();
    
    for (let i = 13; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      date.setHours(0, 0, 0, 0);
      
      const moodEntry = moodHistory.find(m => {
        const moodDate = new Date(m.date);
        moodDate.setHours(0, 0, 0, 0);
        return moodDate.getTime() === date.getTime();
      });
      
      days.push({
        date: date.toISOString().split('T')[0],
        dayName: date.toLocaleDateString('en-US', { weekday: 'short' }),
        dayNumber: date.getDate(),
        score: moodEntry ? moodEntry.score : null,
      });
    }
    
    return days;
  };

  const getAverageSleep = () => {
    if (!sleepData.length) return null;
    const total = sleepData.reduce((sum, s) => sum + (s.duration || 0), 0);
    return (total / sleepData.length).toFixed(1);
  };

  // Get top 3 habits by completion
  const getTopHabits = () => {
    return [...habits]
      .sort((a, b) => b.completionRate - a.completionRate)
      .slice(0, 3);
  };

  // Get key insights
  const getKeyInsights = () => {
    const insights = [];
    
    // Mood trend insight
    if (moodHistory.length >= 7) {
      const last7 = moodHistory.slice(-7);
      const prev7 = moodHistory.slice(-14, -7);
      if (prev7.length > 0) {
        const lastAvg = last7.reduce((s, m) => s + m.score, 0) / last7.length;
        const prevAvg = prev7.reduce((s, m) => s + m.score, 0) / prev7.length;
        const change = lastAvg - prevAvg;
        
        if (change > 0.5) {
          insights.push({
            type: 'positive',
            icon: '📈',
            title: 'Mood Improving',
            message: `Your mood has improved by ${change.toFixed(1)} points this week!`,
            action: 'Keep doing what makes you feel good',
          });
        } else if (change < -0.5) {
          insights.push({
            type: 'attention',
            icon: '💙',
            title: 'Mood Lower',
            message: `Your mood has been lower this week. That's okay - we all have tough periods.`,
            action: 'Try a mindfulness exercise or reach out to someone',
          });
        }
      }
    }
    
    // Habit insight
    if (habitStats && habitStats.total > 0) {
      const completionRate = (habitStats.completedToday / habitStats.total) * 100;
      if (completionRate >= 80) {
        insights.push({
          type: 'positive',
          icon: '🔥',
          title: 'Habits on Fire',
          message: `You've completed ${habitStats.completedToday} of ${habitStats.total} habits today!`,
          action: 'Keep this momentum going',
        });
      } else if (completionRate < 50 && habitStats.total > 0) {
        insights.push({
          type: 'encouragement',
          icon: '💪',
          title: 'Room to Grow',
          message: `You've completed ${habitStats.completedToday} of ${habitStats.total} habits today.`,
          action: 'Focus on one habit at a time',
        });
      }
    }
    
    // Streak insight
    if (habitStats && habitStats.streak > 0) {
      if (habitStats.streak >= 7) {
        insights.push({
          type: 'positive',
          icon: '🌟',
          title: 'Amazing Streak',
          message: `${habitStats.streak} days in a row! You're building something real.`,
          action: 'Consider adding a new habit',
        });
      } else if (habitStats.streak >= 3) {
        insights.push({
          type: 'positive',
          icon: '✨',
          title: 'Building Consistency',
          message: `${habitStats.streak} days strong! Keep it going.`,
          action: 'Maintain your streak',
        });
      }
    }
    
    // Sleep insight
    const avgSleep = getAverageSleep();
    if (avgSleep) {
      if (avgSleep >= 7 && avgSleep <= 9) {
        insights.push({
          type: 'positive',
          icon: '😴',
          title: 'Great Sleep',
          message: `You're averaging ${avgSleep} hours of sleep. That's healthy!`,
          action: 'Keep up the good sleep routine',
        });
      } else if (avgSleep < 6) {
        insights.push({
          type: 'attention',
          icon: '🌙',
          title: 'Sleep Needs Attention',
          message: `You're averaging ${avgSleep} hours. Consider improving your sleep.`,
          action: 'Try a consistent bedtime routine',
        });
      }
    }
    
    return insights.slice(0, 4); // Max 4 insights
  };

  const moodTrendData = getMoodTrendData();
  const topHabits = getTopHabits();
  const keyInsights = getKeyInsights();
  const avgSleep = getAverageSleep();
  const greeting = getGreeting();

  return (
    <div className="max-w-6xl mx-auto space-y-6 fade-in">
      {/* Header */}
      <header className="mb-6">
        <h1 className="text-4xl font-bold text-primary mb-2 flex items-center gap-3">
          <Sparkle size={36} className="text-accent-sage" weight="duotone" />
          {userName ? `${greeting}, ${userName.split(' ')[0]}!` : 'Insights'}
        </h1>
        <p className="text-secondary text-lg">
          {getDynamicWelcomeMessage(moodStats?.avgScore, habitStats?.completedToday) || 
           'Your wellness journey at a glance'}
        </p>
      </header>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-accent-sage border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-secondary text-sm">Analyzing your data...</p>
          </div>
        </div>
      ) : (
        <>
          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="rounded-3xl p-6" style={getCardStyle()}>
              <div className="flex items-center gap-2 mb-2">
                <Heart size={20} className="text-accent-sage" weight="fill" />
                <span className="text-xs font-semibold text-secondary">Avg Mood</span>
              </div>
              <p className="text-3xl font-bold text-primary">
                {moodStats?.avgScore ? moodStats.avgScore.toFixed(1) : '-'}
              </p>
              <p className="text-xs text-secondary mt-1">Out of 10</p>
            </div>

            <div className="rounded-3xl p-6" style={getCardStyle()}>
              <div className="flex items-center gap-2 mb-2">
                <Target size={20} className="text-accent-clay" weight="fill" />
                <span className="text-xs font-semibold text-secondary">Habits</span>
              </div>
              <p className="text-3xl font-bold text-primary">
                {habitStats?.completedToday || 0}/{habitStats?.total || 0}
              </p>
              <p className="text-xs text-secondary mt-1">Completed today</p>
            </div>

            <div className="rounded-3xl p-6" style={getCardStyle()}>
              <div className="flex items-center gap-2 mb-2">
                <Flame size={20} className="text-amber-500" weight="fill" />
                <span className="text-xs font-semibold text-secondary">Streak</span>
              </div>
              <p className="text-3xl font-bold text-primary">
                {habitStats?.streak || 0}
              </p>
              <p className="text-xs text-secondary mt-1">Days in a row</p>
            </div>

            <div className="rounded-3xl p-6" style={getCardStyle()}>
              <div className="flex items-center gap-2 mb-2">
                <Moon size={20} className="text-indigo-500" weight="fill" />
                <span className="text-xs font-semibold text-secondary">Sleep</span>
              </div>
              <p className="text-3xl font-bold text-primary">
                {avgSleep ? `${avgSleep}h` : '-'}
              </p>
              <p className="text-xs text-secondary mt-1">Average per night</p>
            </div>
          </div>

          {/* Mood Trend Line Chart */}
          <div className="rounded-3xl p-6" style={getCardStyle()}>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-bold text-primary">Mood Trend</h3>
                <p className="text-xs text-secondary mt-1">Last 14 days</p>
              </div>
              {moodStats?.avgScore && (
                <div className="text-right">
                  <p className="text-xs text-secondary">Average</p>
                  <p className="text-xl font-bold text-accent-sage">{moodStats.avgScore.toFixed(1)}</p>
                </div>
              )}
            </div>

            {moodTrendData.length > 0 && moodTrendData.some(d => d.score !== null) ? (
              <div className="relative" style={{ height: '200px' }}>
                {/* Y-axis labels */}
                <div className="absolute left-0 top-0 bottom-8 w-6 flex flex-col justify-between text-[10px] text-tertiary">
                  <span>10</span>
                  <span>5</span>
                  <span>1</span>
                </div>

                {/* Chart area */}
                <div className="ml-7 h-full relative pb-8">
                  {/* Grid lines */}
                  <div className="absolute inset-0 bottom-8 flex flex-col justify-between">
                    {[0, 1, 2].map(i => (
                      <div key={i} className="border-t border-dashed border-primary/10" />
                    ))}
                  </div>

                  {/* Data points container */}
                  <div className="absolute inset-0 bottom-8 flex">
                    {moodTrendData.map((d, i) => {
                      if (d.score === null) return (
                        <div key={i} className="flex-1 relative">
                          <div 
                            className="absolute left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-tertiary/30"
                            style={{ top: '90%' }}
                          />
                        </div>
                      );
                      
                      // Score 1 = 90% from top, Score 10 = 5% from top
                      const topPercent = 90 - ((d.score - 1) / 9) * 85;
                      const isToday = i === moodTrendData.length - 1;
                      
                      return (
                        <div key={i} className="flex-1 relative group">
                          <div 
                            className="absolute left-1/2 z-10"
                            style={{ 
                              top: `${topPercent}%`, 
                              transform: 'translate(-50%, -50%)',
                              transition: 'all 0.4s cubic-bezier(0.2, 0.8, 0.2, 1)'
                            }}
                          >
                            {/* Static glow */}
                            <div 
                              className="absolute rounded-full"
                              style={{ 
                                width: '16px', 
                                height: '16px',
                                left: '50%',
                                top: '50%',
                                transform: 'translate(-50%, -50%)',
                                backgroundColor: 'var(--accent-sage)',
                                opacity: 0.2,
                              }}
                            />
                            {/* Static glow on hover */}
                            <div 
                              className="absolute rounded-full blur-md opacity-0 group-hover:opacity-40"
                              style={{ 
                                width: '20px', 
                                height: '20px',
                                left: '50%',
                                top: '50%',
                                transform: 'translate(-50%, -50%)',
                                backgroundColor: 'var(--accent-sage)',
                                transition: 'all 0.3s cubic-bezier(0.2, 0.8, 0.2, 1)'
                              }}
                            />
                            {/* Dot */}
                            <div 
                              className={`w-2.5 h-2.5 rounded-full bg-accent-sage border-2 border-white dark:border-stone-800 shadow-sm group-hover:scale-125 ${
                                isToday ? 'ring-2 ring-accent-sage/30' : ''
                              }`}
                              style={{ transition: 'transform 0.3s cubic-bezier(0.2, 0.8, 0.2, 1)' }}
                            />
                            {/* Tooltip */}
                            <div 
                              className="absolute -top-7 left-1/2 opacity-0 group-hover:opacity-100 group-hover:-translate-y-1 pointer-events-none z-10"
                              style={{
                                transform: 'translateX(-50%)',
                                transition: 'all 0.3s cubic-bezier(0.2, 0.8, 0.2, 1)'
                              }}
                            >
                              <span className="text-[9px] font-bold bg-accent-sage text-white px-1.5 py-0.5 rounded-full whitespace-nowrap shadow-lg">
                                {d.score}/10
                              </span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* SVG Line - Smooth Bezier Curve */}
                  {(() => {
                    const dataLength = moodTrendData.length;
                    const chartPoints = moodTrendData
                      .map((d, i) => {
                        if (d.score === null) return null;
                        // X: center of each data point column as percentage
                        // Y: match point position (90% - ((score-1)/9) * 85%) = percentage
                        return {
                          x: ((i + 0.5) / dataLength) * 100, // Convert to percentage
                          y: 90 - ((d.score - 1) / 9) * 85 // Match point topPercent
                        };
                      })
                      .filter(Boolean);
                    
                    if (chartPoints.length < 2) return null;
                    
                    const linePath = generateSmoothPath(chartPoints, 0.35);
                    const primaryColor = isDark ? '#6EE7B7' : '#5E8B7E';
                    
                    return (
                      <svg 
                        className="absolute inset-0 bottom-8 w-full h-full pointer-events-none overflow-visible"
                        viewBox="0 0 100 100"
                        preserveAspectRatio="none"
                      >
                        <defs>
                          <linearGradient id="insightLineGradient" x1="0" y1="0" x2="1" y2="0">
                            <stop offset="0%" stopColor={primaryColor} />
                            <stop offset="50%" stopColor={isDark ? '#34D399' : '#4A9B8C'} />
                            <stop offset="100%" stopColor={primaryColor} />
                          </linearGradient>
                          <filter id="insightGlow" x="-50%" y="-50%" width="200%" height="200%">
                            <feGaussianBlur stdDeviation="3" result="blur"/>
                            <feMerge>
                              <feMergeNode in="blur"/>
                              <feMergeNode in="SourceGraphic"/>
                            </feMerge>
                          </filter>
                        </defs>
                        
                        {/* Soft glow behind line */}
                        <path
                          d={linePath}
                          fill="none"
                          stroke={`${primaryColor}40`}
                          strokeWidth="6"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          vectorEffect="non-scaling-stroke"
                          filter="url(#insightGlow)"
                        />
                        
                        {/* Main smooth line */}
                        <path
                          d={linePath}
                          fill="none"
                          stroke="url(#insightLineGradient)"
                          strokeWidth="2.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          vectorEffect="non-scaling-stroke"
                        />
                      </svg>
                    );
                  })()}

                  {/* X-axis labels */}
                  <div className="absolute bottom-0 left-0 right-0 h-8 flex">
                    {moodTrendData.map((d, i) => (
                      <div key={i} className="flex-1 flex flex-col items-center justify-end text-[9px] text-secondary">
                        <span className="font-semibold">{d.dayNumber}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="h-48 flex items-center justify-center text-secondary text-sm">
                <div className="text-center">
                  <ChartLine size={32} className="mx-auto mb-2 text-tertiary" />
                  <p>Start logging your mood to see trends</p>
                </div>
              </div>
            )}
          </div>

          {/* Top Habits Progress */}
          {topHabits.length > 0 && (
            <div className="rounded-3xl p-6" style={getCardStyle()}>
              <h3 className="text-lg font-bold text-primary mb-4">Top Habits</h3>
              <div className="space-y-4">
                {topHabits.map((habit) => (
                  <div key={habit.id}>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold text-primary">{habit.title}</span>
                        {habit.streak > 0 && (
                          <span className="text-xs font-bold text-amber-500 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/20 px-2 py-0.5 rounded-full">
                            🔥 {habit.streak} days
                          </span>
                        )}
                      </div>
                      <span className="text-sm font-bold text-secondary">{habit.completionRate}%</span>
                    </div>
                    <div className="h-2 bg-tertiary rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-accent-sage to-accent-sage/80 rounded-full transition-all duration-500"
                        style={{ width: `${habit.completionRate}%` }}
                      />
                    </div>
                    <p className="text-xs text-secondary mt-1">
                      {habit.totalCompletions} times in the last 30 days
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Key Insights */}
          {keyInsights.length > 0 && (
            <div className="rounded-3xl p-6" style={getCardStyle()}>
              <div className="flex items-center gap-2 mb-4">
                <Lightbulb size={20} className="text-accent-sage" weight="fill" />
                <h3 className="text-lg font-bold text-primary">Key Insights</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {keyInsights.map((insight, i) => (
                  <div
                    key={i}
                    className={`p-4 rounded-xl border-2 ${
                      insight.type === 'positive'
                        ? 'bg-emerald-50 border-emerald-200'
                        : insight.type === 'attention'
                        ? 'bg-amber-50 border-amber-200'
                        : 'bg-blue-50 border-blue-200'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <span className="text-2xl shrink-0">{insight.icon}</span>
                      <div className="flex-1">
                        <h4 className="font-bold text-primary mb-1">{insight.title}</h4>
                        <p className="text-sm text-primary mb-2">{insight.message}</p>
                        <div className="flex items-center gap-1 text-xs text-secondary">
                          <ArrowRight size={12} />
                          <span>{insight.action}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Mood Distribution */}
          {moodStats && moodStats.total > 0 && (
            <div className="rounded-3xl p-6" style={getCardStyle()}>
              <h3 className="text-lg font-bold text-primary mb-4">Mood Distribution</h3>
              <div className="space-y-3">
                {[
                  { label: 'Very High (8-10)', count: moodStats.distribution.veryHigh, color: 'bg-emerald-400' },
                  { label: 'High (6-7)', count: moodStats.distribution.high, color: 'bg-teal-300' },
                  { label: 'Neutral (4-5)', count: moodStats.distribution.neutral, color: 'bg-tertiary' },
                  { label: 'Low (2-3)', count: moodStats.distribution.low, color: 'bg-orange-300' },
                  { label: 'Very Low (0-1)', count: moodStats.distribution.veryLow, color: 'bg-red-300' },
                ].map((item) => {
                  const percentage = moodStats.total > 0 ? (item.count / moodStats.total) * 100 : 0;
                  return (
                    <div key={item.label}>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm text-primary">{item.label}</span>
                        <span className="text-sm font-bold text-secondary">{item.count} days</span>
                      </div>
                      <div className="h-3 bg-stone-100 rounded-full overflow-hidden">
                        <div
                          className={`h-full ${item.color} rounded-full transition-all duration-500`}
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Empty State */}
          {(!moodStats || moodStats.total === 0) && (!habitStats || habitStats.total === 0) && (
            <div className="bg-elevated rounded-3xl p-12 flex flex-col items-center justify-center text-center card-shadow">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-accent-sage-light to-accent-sage/10 mb-4 flex items-center justify-center">
                <Sparkle size={32} className="text-accent-sage" weight="duotone" />
              </div>
              <h3 className="text-xl font-bold text-primary mb-2">No Insights Yet</h3>
              <p className="text-secondary text-sm max-w-md leading-relaxed mb-4">
                Start tracking your mood and habits to unlock personalized insights. Every entry helps us understand you better.
              </p>
              <p className="text-xs text-secondary italic">
                💡 Tip: Log your mood daily for at least a week to see detailed patterns!
              </p>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default InsightsPage;
