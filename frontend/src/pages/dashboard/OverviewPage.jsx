import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../../context/ToastContext';
import { useTheme } from '../../context/ThemeContext';
import { 
  Timer, Smiley, Wind, BookOpen, Drop, Plus, Check, 
  Activity, Moon, MagnifyingGlass, Bell, Target, TrendUp, Sparkle
} from 'phosphor-react';
import { moodAPI, habitAPI, journalAPI, sleepAPI, overviewAPI } from '../../services/api';
import { 
  getPersonalizedGreeting, 
  getEncouragingMessage
} from '../../utils/personalization';

const FunFactWidget = ({ funFact, loading, getCardStyle }) => {
  // Fallback facts nếu không có từ API
  const fallbackFacts = [
    {
      icon: '🌱',
      title: 'Growth Mindset',
      fact: 'Your brain creates new neural pathways every time you learn something new. Every day is a chance to grow!',
    },
    {
      icon: '💚',
      title: 'Self-Care Matters',
      fact: 'Taking just 5 minutes for yourself can reduce stress by up to 50%. Small moments add up to big changes.',
    },
    {
      icon: '✨',
      title: 'Progress Over Perfection',
      fact: 'Consistency beats intensity. Small daily actions create lasting transformation more than occasional big efforts.',
    },
    {
      icon: '🌙',
      title: 'Rest is Productive',
      fact: 'Quality sleep improves memory, creativity, and emotional regulation. Rest is not laziness—it\'s restoration.',
    },
    {
      icon: '💭',
      title: 'Emotions are Data',
      fact: 'Your feelings are messengers, not enemies. Understanding them helps you respond, not just react.',
    },
  ];

  const currentFact = funFact || fallbackFacts[Math.floor(Math.random() * fallbackFacts.length)];

  if (loading) {
    return (
      <div className="p-6 rounded-3xl relative overflow-hidden h-full flex flex-col" style={getCardStyle()}>
        <div className="skeleton skeleton-text-lg mb-2"></div>
        <div className="skeleton skeleton-text-sm mb-4" style={{ width: '50%' }}></div>
        <div className="flex-1 flex items-center justify-center">
          <div className="skeleton skeleton-avatar-lg"></div>
        </div>
        <div className="skeleton skeleton-text-sm mt-4"></div>
      </div>
    );
  }

  return (
    <div className="p-6 rounded-3xl relative overflow-hidden h-full group cursor-default flex flex-col justify-between interactive-card" style={getCardStyle()}>
      <div className="flex justify-between items-start mb-4 relative z-10 animate-enter" style={{ animationDelay: '50ms' }}>
        <div>
          <h3 className="text-primary font-bold text-lg">Hopeful Fact</h3>
          <p className="text-secondary text-xs font-medium uppercase tracking-wider mt-1">
            Daily Inspiration
          </p>
        </div>
        <div className="bg-accent-sage-light text-accent-sage p-2 rounded-full">
          <Sparkle size={20} weight="duotone" />
        </div>
      </div>
      <div className="flex-1 flex flex-col justify-center relative z-10 animate-enter" style={{ animationDelay: '100ms' }}>
        <div className="text-4xl mb-3">{currentFact.icon}</div>
        <h4 className="text-primary font-bold text-base mb-2">{currentFact.title}</h4>
        <p className="text-secondary text-sm leading-relaxed">{currentFact.fact}</p>
      </div>
    </div>
  );
};

const MoodWave = ({ moodData, loading, getCardStyle }) => {
  const { isDark } = useTheme();
  
  // Get current week data (Monday to Sunday or last 7 days ending today)
  const getLast7DaysData = () => {
    const weekData = [];
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    // Create a map of date strings to mood entries
    const moodMap = {};
    if (moodData && Array.isArray(moodData)) {
      moodData.forEach(m => {
        if (m && m.date && m.score !== undefined && m.score !== null) {
          try {
            const moodDate = new Date(m.date);
            moodDate.setHours(0, 0, 0, 0);
            const dateKey = moodDate.toISOString().split('T')[0];
            if (!moodMap[dateKey] || new Date(m.date) > new Date(moodMap[dateKey].date)) {
              moodMap[dateKey] = m;
            }
          } catch (e) {}
        }
      });
    }
    
    // Build data for last 7 days (6 days ago to today)
    // Display format: S M T W T F S (but showing actual days from past week)
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);
      date.setHours(0, 0, 0, 0);
      const dateStr = date.toISOString().split('T')[0];
      const moodEntry = moodMap[dateStr];
      const isToday = i === 0;
      
      // Get day label (single letter)
      const dayNames = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
      const fullDayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
      const dayOfWeek = date.getDay();
      
      if (moodEntry && moodEntry.score !== undefined) {
        const score = Math.max(1, Math.min(10, Number(moodEntry.score)));
        weekData.push({ 
          dayLabel: dayNames[dayOfWeek], 
          dayName: fullDayNames[dayOfWeek],
          score, 
          hasData: true, 
          date: dateStr, 
          note: moodEntry.note,
          isToday,
          dayIndex: i // 6 = oldest, 0 = today
        });
      } else {
        weekData.push({ 
          dayLabel: dayNames[dayOfWeek], 
          dayName: fullDayNames[dayOfWeek],
          score: 0, 
          hasData: false, 
          date: dateStr,
          isToday,
          dayIndex: i
        });
      }
    }
    return weekData;
  };

  // Get color based on score
  const getColorForScore = (score) => {
    if (!score || score === 0) return isDark ? '#4B5563' : '#D1D5DB';
    if (score <= 3) return '#EF4444'; // Low - red
    if (score <= 5) return '#F59E0B'; // Medium-low - amber
    if (score <= 7) return '#10B981'; // Good - emerald
    return '#5E8B7E'; // Great - sage
  };

  // Get emoji for score
  const getEmoji = (score) => {
    if (!score || score === 0) return '○';
    if (score <= 2) return '😔';
    if (score <= 4) return '😕';
    if (score <= 6) return '😐';
    if (score <= 8) return '🙂';
    return '😊';
  };

  const weekData = getLast7DaysData();
  const dataPoints = weekData.filter(d => d.hasData);
  const hasData = dataPoints.length > 0;

  // Calculate insights
  const avgScore = dataPoints.length > 0
    ? dataPoints.reduce((sum, d) => sum + d.score, 0) / dataPoints.length
    : 0;
  
  const recentDays = weekData.slice(-3).filter(d => d.hasData);
  const earlierDays = weekData.slice(0, 4).filter(d => d.hasData);
  const recentAvg = recentDays.length > 0 ? recentDays.reduce((sum, d) => sum + d.score, 0) / recentDays.length : 0;
  const earlierAvg = earlierDays.length > 0 ? earlierDays.reduce((sum, d) => sum + d.score, 0) / earlierDays.length : 0;
  const trendDiff = recentAvg - earlierAvg;
  
  // Find highest/lowest days
  const sortedByScore = [...dataPoints].sort((a, b) => b.score - a.score);
  const highestDay = sortedByScore[0];
  const lowestDay = sortedByScore[sortedByScore.length - 1];

  // Personal insights
  const getPersonalInsight = () => {
    if (dataPoints.length === 0) return null;
    if (dataPoints.length === 1) {
      const score = dataPoints[0].score;
      if (score >= 7) return { text: "Great start! Keep tracking to see your patterns.", type: 'positive' };
      if (score <= 4) return { text: "Remember: one day doesn't define you. Tomorrow is fresh. 💚", type: 'support' };
      return { text: "You're building awareness. That's powerful.", type: 'neutral' };
    }
    
    if (trendDiff > 1) return { text: "You're trending upward! Keep doing what makes you feel good. ✨", type: 'positive' };
    if (trendDiff < -1) return { text: "Looks like a tough stretch. Be gentle with yourself — rest counts too.", type: 'support' };
    if (avgScore >= 7) return { text: "Your mood's been steady and positive. You're doing great! 🌿", type: 'positive' };
    if (avgScore <= 4) return { text: "Some challenging days lately. Consider reaching out or journaling.", type: 'support' };
    return { text: "Your mood is balanced. Consistency is a strength.", type: 'neutral' };
  };

  const insight = getPersonalInsight();

  // Chart helper functions
  const chartHeight = 120;
  
  // Calculate Y position for a score (1-10 maps to chartHeight-10 to 10)
  const getY = (score) => {
    if (!score || score === 0) return chartHeight - 10;
    return chartHeight - 10 - ((score - 1) / 9) * (chartHeight - 20);
  };
  
  // Calculate X position for day index (0-6 maps across full width with padding)
  const getX = (index, totalWidth) => {
    const padding = 20;
    const usableWidth = totalWidth - padding * 2;
    return padding + (index / 6) * usableWidth;
  };

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
      
      // Calculate control points with tension
      const cp1x = p1.x + (p2.x - p0.x) * tension / 3;
      const cp1y = p1.y + (p2.y - p0.y) * tension / 3;
      const cp2x = p2.x - (p3.x - p1.x) * tension / 3;
      const cp2y = p2.y - (p3.y - p1.y) * tension / 3;
      
      path += ` C ${cp1x},${cp1y} ${cp2x},${cp2y} ${p2.x},${p2.y}`;
    }
    
    return path;
  };

  // Generate smooth area fill path
  const generateSmoothAreaPath = (points, tension = 0.4, baseline = 100) => {
    if (points.length < 2) return '';
    
    const linePath = generateSmoothPath(points, tension);
    const lastPoint = points[points.length - 1];
    const firstPoint = points[0];
    
    return `${linePath} L ${lastPoint.x},${baseline} L ${firstPoint.x},${baseline} Z`;
  };

  if (loading) {
    return (
      <div className="p-6 rounded-3xl relative overflow-hidden col-span-1 md:col-span-2 flex flex-col" style={getCardStyle()}>
        <div className="skeleton skeleton-text-lg mb-2"></div>
        <div className="skeleton skeleton-text-sm mb-6" style={{ width: '60%' }}></div>
        <div className="skeleton-chart flex-1"></div>
      </div>
    );
  }

  return (
    <div className="p-6 rounded-3xl relative overflow-hidden col-span-1 md:col-span-2 flex flex-col interactive-card" style={getCardStyle()}>
      {/* Header */}
      <div className="flex justify-between items-start mb-3 animate-enter" style={{ animationDelay: '150ms' }}>
        <div>
          <h3 className="text-primary font-bold text-lg">Emotional Flow</h3>
          <p className="text-secondary text-xs font-medium mt-0.5 flex items-center gap-1">
            <TrendUp size={12} />
            <span>Last 7 days</span>
          </p>
        </div>
        {hasData && (
          <div className="flex items-center gap-1 text-xs">
            {trendDiff > 0.5 ? (
              <span className="text-emerald-500 font-medium flex items-center gap-0.5">↑ Improving</span>
            ) : trendDiff < -0.5 ? (
              <span className="text-amber-500 font-medium flex items-center gap-0.5">↓ Dipping</span>
            ) : (
              <span className="text-secondary font-medium flex items-center gap-0.5">→ Stable</span>
            )}
          </div>
        )}
      </div>

      {/* Personal Insight */}
      {insight && (
        <p className={`text-xs mb-4 italic leading-relaxed ${
          insight.type === 'positive' ? 'text-emerald-600 dark:text-emerald-400' :
          insight.type === 'support' ? 'text-amber-600 dark:text-amber-400' :
          'text-secondary'
        }`}>
          {insight.text}
        </p>
      )}

      {!hasData ? (
        <div className="flex-1 flex flex-col items-center justify-center text-center py-6">
          <Sparkle size={28} className="text-tertiary mb-2" weight="duotone" />
          <p className="text-secondary text-sm mb-1">No mood data yet</p>
          <p className="text-xs text-tertiary">Start logging to see your emotional patterns</p>
        </div>
      ) : (
        <div className="flex-1 flex flex-col">
          {/* Simple aligned chart */}
          <div className="flex-1">
            {/* Chart container with grid and data */}
            <div className="relative" style={{ height: `${chartHeight}px` }}>
              {/* Y-axis labels */}
              <div className="absolute left-0 top-0 bottom-0 w-6 flex flex-col justify-between text-[9px] text-tertiary py-1">
                <span>10</span>
                <span>5</span>
                <span>1</span>
              </div>
              
              {/* Chart area */}
              <div className="ml-7 h-full relative">
                {/* Grid lines */}
                <div className="absolute inset-0 flex flex-col justify-between py-1 pointer-events-none">
                  {[0, 1, 2].map(i => (
                    <div key={i} className="border-t border-dashed" style={{ borderColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)' }} />
                  ))}
                </div>
                
                {/* Data points container - same width division for dots and labels */}
                <div className="absolute inset-0 flex">
                  {weekData.map((day, i) => {
                    const color = getColorForScore(day.score);
                    // Calculate Y position: score 1 = bottom (95%), score 10 = top (5%)
                    const yPercent = day.hasData ? 95 - ((day.score - 1) / 9) * 90 : 95;
                    
                    return (
                      <div key={i} className="flex-1 relative group">
                        {/* Dot positioned by Y - Cinematic transitions */}
                        <div 
                          className="absolute left-1/2 z-10"
                          style={{ 
                            top: `${yPercent}%`, 
                            transform: 'translate(-50%, -50%)',
                            transition: 'all 0.4s cubic-bezier(0.2, 0.8, 0.2, 1)'
                          }}
                        >
                          {day.hasData ? (
                            <>
                              {/* Static glow */}
                              <div 
                                className="absolute rounded-full"
                                style={{ 
                                  width: '20px', 
                                  height: '20px',
                                  left: '50%',
                                  top: '50%',
                                  transform: 'translate(-50%, -50%)',
                                  backgroundColor: color,
                                  opacity: 0.2,
                                }}
                              />
                              {/* Static glow on hover */}
                              <div 
                                className="absolute rounded-full blur-md opacity-0 group-hover:opacity-50"
                                style={{ 
                                  width: '24px', 
                                  height: '24px',
                                  left: '50%',
                                  top: '50%',
                                  transform: 'translate(-50%, -50%)',
                                  backgroundColor: color,
                                  transition: 'all 0.3s cubic-bezier(0.2, 0.8, 0.2, 1)'
                                }}
                              />
                              {/* Main dot with smooth scale */}
                              <div 
                                className={`w-3 h-3 rounded-full border-2 shadow-md group-hover:scale-125 ${
                                  day.isToday ? 'border-accent-sage ring-2 ring-accent-sage/30' : 'border-white dark:border-stone-800'
                                }`}
                                style={{ 
                                  backgroundColor: color,
                                  transition: 'transform 0.3s cubic-bezier(0.2, 0.8, 0.2, 1), box-shadow 0.3s ease'
                                }}
                              />
                              {/* Tooltip with cinematic entry */}
                              <div 
                                className="absolute -top-8 left-1/2 opacity-0 group-hover:opacity-100 group-hover:-translate-y-1 pointer-events-none"
                                style={{
                                  transform: 'translateX(-50%)',
                                  transition: 'all 0.3s cubic-bezier(0.2, 0.8, 0.2, 1)'
                                }}
                              >
                                <span 
                                  className="text-[10px] font-bold px-2 py-1 rounded-full whitespace-nowrap shadow-lg"
                                  style={{ backgroundColor: color, color: 'white' }}
                                >
                                  {day.score}/10
                                </span>
                              </div>
                            </>
                          ) : (
                            <div 
                              className="w-2 h-2 rounded-full transition-all duration-300 group-hover:scale-125"
                              style={{ backgroundColor: isDark ? '#4B5563' : '#D1D5DB', opacity: 0.4 }}
                            />
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
                
                {/* SVG Line connecting data points - Smooth Bezier Curves */}
                  {dataPoints.length >= 2 && (() => {
                    // Build points array for smooth curve
                    // Use percentage-based coordinates to match point positions
                    const chartPoints = weekData
                      .map((day, i) => {
                        if (!day.hasData) return null;
                        // X: center of each day column (0.5/7, 1.5/7, ..., 6.5/7) = percentage
                        // Y: match point position (95% - ((score-1)/9) * 90%) = percentage
                        return {
                          x: ((i + 0.5) / 7) * 100, // Convert to percentage
                          y: 95 - ((day.score - 1) / 9) * 90 // Match point yPercent
                        };
                      })
                      .filter(Boolean);
                    
                    if (chartPoints.length < 2) return null;
                    
                    const linePath = generateSmoothPath(chartPoints, 0.35);
                    const areaPath = generateSmoothAreaPath(chartPoints, 0.35, 100);
                    
                    return (
                      <svg 
                        className="absolute inset-0 w-full h-full pointer-events-none overflow-visible"
                        viewBox="0 0 100 100"
                        preserveAspectRatio="none"
                      >
                      {/* Gradient definitions */}
                      <defs>
                        {/* Area fill gradient - soft fade */}
                        <linearGradient id="chartAreaGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor={isDark ? 'rgba(110, 231, 183, 0.25)' : 'rgba(94, 139, 126, 0.15)'} />
                          <stop offset="50%" stopColor={isDark ? 'rgba(110, 231, 183, 0.1)' : 'rgba(94, 139, 126, 0.08)'} />
                          <stop offset="100%" stopColor="rgba(0, 0, 0, 0)" />
                        </linearGradient>
                        
                        {/* Line gradient for depth */}
                        <linearGradient id="chartLineGradient" x1="0" y1="0" x2="1" y2="0">
                          <stop offset="0%" stopColor={isDark ? '#6EE7B7' : '#5E8B7E'} />
                          <stop offset="50%" stopColor={isDark ? '#34D399' : '#4A9B8C'} />
                          <stop offset="100%" stopColor={isDark ? '#6EE7B7' : '#5E8B7E'} />
                        </linearGradient>
                        
                        {/* Soft glow filter */}
                        <filter id="softGlow" x="-50%" y="-50%" width="200%" height="200%">
                          <feGaussianBlur stdDeviation="4" result="blur"/>
                          <feMerge>
                            <feMergeNode in="blur"/>
                            <feMergeNode in="SourceGraphic"/>
                          </feMerge>
                        </filter>
                        
                        {/* Subtle shadow */}
                        <filter id="lineSoftShadow" x="-20%" y="-20%" width="140%" height="140%">
                          <feDropShadow dx="0" dy="3" stdDeviation="4" floodColor={isDark ? '#6EE7B7' : '#5E8B7E'} floodOpacity="0.25"/>
                        </filter>
                      </defs>
                      
                      {/* Soft area fill with smooth curve */}
                      <path
                        d={areaPath}
                        fill="url(#chartAreaGradient)"
                        style={{ 
                          opacity: 0.8
                        }}
                      />
                      
                      {/* Glow line (behind main line) */}
                      <path
                        d={linePath}
                        fill="none"
                        stroke={isDark ? 'rgba(110, 231, 183, 0.4)' : 'rgba(94, 139, 126, 0.3)'}
                        strokeWidth="8"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        vectorEffect="non-scaling-stroke"
                        filter="url(#softGlow)"
                        style={{ 
                          opacity: 0.6
                        }}
                      />
                      
                      {/* Main smooth line */}
                      <path
                        d={linePath}
                        fill="none"
                        stroke="url(#chartLineGradient)"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        vectorEffect="non-scaling-stroke"
                        filter="url(#lineSoftShadow)"
                      />
                    </svg>
                  );
                })()}
              </div>
            </div>
            
            {/* Day labels with emojis - aligned with chart columns */}
            <div className="flex mt-2 ml-7">
              {weekData.map((day, i) => (
                <div 
                  key={i} 
                  className="flex flex-col items-center flex-1 group cursor-pointer transition-transform hover:scale-110"
                  title={day.hasData ? `${day.dayName}: ${day.score}/10` : `${day.dayName}: No entry`}
                >
                  <span className="text-base">{getEmoji(day.score)}</span>
                  <span className={`text-[10px] font-medium mt-0.5 ${
                    day.isToday ? 'text-accent-sage font-bold' : 'text-secondary'
                  }`}>
                    {day.dayLabel}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Highlight best/worst days */}
          {dataPoints.length >= 3 && highestDay && lowestDay && highestDay.score !== lowestDay.score && (
            <div className="mt-4 pt-3 border-t border-primary/10 flex justify-between text-xs">
              <span className="text-secondary">
                ✨ Best: <span className="font-medium text-emerald-600 dark:text-emerald-400">{highestDay.dayName} ({highestDay.score}/10)</span>
              </span>
              <span className="text-secondary">
                💭 Low: <span className="font-medium text-amber-600 dark:text-amber-400">{lowestDay.dayName} ({lowestDay.score}/10)</span>
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

const HabitListWidget = ({ habits, onToggle, onAdd, getCardStyle }) => {
  const habitIcons = {
    wind: Wind,
    drop: Drop,
    'book-open': BookOpen,
    moon: Moon,
    target: Target,
  };

  return (
    <div className="p-8 rounded-3xl relative overflow-hidden interactive-card" style={getCardStyle()}>
      <div className="flex items-center justify-between mb-6 relative z-10">
        <div>
          <h3 className="text-xl font-bold text-primary">Daily Rituals</h3>
        </div>
        <button
          onClick={onAdd}
          className="w-10 h-10 rounded-full bg-elevated flex items-center justify-center text-secondary hover:text-accent-sage hover:bg-accent-sage-light shadow-sm border border-primary"
          style={{ transition: 'all 0.3s cubic-bezier(0.2, 0.8, 0.2, 1)' }}
        >
          <Plus size={20} />
        </button>
      </div>
      <div className="space-y-2 relative z-10">
        {habits.map((habit, index) => {
          const IconComponent = habitIcons[habit.iconName] || Target;
          return (
            <div
              key={habit.id}
              onClick={() => onToggle(habit.id)}
              className={`group flex items-center justify-between p-4 rounded-2xl cursor-pointer border border-transparent select-none animate-enter ${
                habit.completed
                  ? 'bg-tertiary/50 opacity-60'
                  : 'bg-elevated hover:border-accent-sage-light hover:shadow-sm'
              }`}
              style={{ 
                animationDelay: `${index * 50}ms`,
                transition: 'all 0.4s cubic-bezier(0.2, 0.8, 0.2, 1)'
              }}
            >
              <div className="flex items-center gap-4">
                <div
                  className={`w-12 h-12 rounded-lg flex items-center justify-center transition-all duration-300 ${
                    habit.completed
                      ? 'bg-accent-sage text-inverse scale-100'
                      : 'bg-tertiary text-tertiary group-hover:bg-accent-sage-light group-hover:text-accent-sage group-hover:scale-110'
                  }`}
                >
                  {habit.completed ? (
                    <Check size={20} />
                  ) : (
                    <IconComponent size={20} />
                  )}
                </div>
                <div>
                  <p
                    className={`text-sm font-bold transition-colors ${
                      habit.completed
                        ? 'text-secondary line-through'
                        : 'text-primary'
                    }`}
                  >
                    {habit.title}
                  </p>
                  <p className="text-xs text-secondary">{habit.time}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const ActivityFeed = ({ activities, loading, getCardStyle }) => {
  const formatTime = (dateString) => {
    if (!dateString) return 'Just now';
    const date = new Date(dateString);
    const now = new Date();
    const diffInMs = now - date;
    const diffInMins = Math.floor(diffInMs / (1000 * 60));
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

    if (diffInMins < 1) return 'Just now';
    if (diffInMins < 60) return `${diffInMins}m ago`;
    if (diffInHours < 24) return `${diffInHours}h ago`;
    if (diffInDays < 7) return `${diffInDays}d ago`;
    
    // Show actual date for older items
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="p-6 rounded-3xl mt-6" style={getCardStyle()}>
        <div className="skeleton skeleton-text-lg mb-4"></div>
        <div className="space-y-3">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="flex items-center gap-3">
              <div className="skeleton skeleton-avatar"></div>
              <div className="flex-1 space-y-2">
                <div className="skeleton skeleton-text" style={{ width: `${70 + i * 5}%` }}></div>
                <div className="skeleton skeleton-text-sm" style={{ width: `${40 + i * 3}%` }}></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!activities || activities.length === 0) {
    return (
      <div className="p-6 rounded-3xl mt-6" style={getCardStyle()}>
        <h3 className="font-bold text-primary mb-4">Recent Activity</h3>
        <div className="text-center py-6">
          <Sparkle size={24} className="text-tertiary mx-auto mb-2" weight="duotone" />
          <p className="text-secondary text-sm mb-1">Your activity feed is quiet</p>
          <p className="text-xs text-secondary italic">Start logging your mood or completing habits to see your journey unfold! ✨</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 rounded-3xl mt-6 interactive-card" style={getCardStyle()}>
      <h3 className="font-bold text-primary mb-4">Recent Activity</h3>
      <div className="relative pl-4 space-y-6 border-l border-primary">
        {activities.map((item, i) => (
          <div 
            key={i} 
            className="relative animate-enter"
            style={{ animationDelay: `${i * 60}ms` }}
          >
            <div
              className={`absolute -left-[21px] top-1 w-3 h-3 rounded-full border-2 border-elevated ring-1 ring-elevated ${item.color}`}
              style={{ transition: 'transform 0.3s cubic-bezier(0.2, 0.8, 0.2, 1)' }}
            />
            <p className="text-sm font-medium text-primary">{item.text}</p>
            <p className="text-xs text-secondary mt-0.5" title={new Date(item.date).toLocaleString()}>
              {formatTime(item.date)}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};


const OverviewPage = () => {
  const { user } = useAuth();
  const { getCardStyle } = useTheme();
  const navigate = useNavigate();
  const [moodData, setMoodData] = useState([]);
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [habits, setHabits] = useState([]);
  const [habitsLoading, setHabitsLoading] = useState(true);
  const [funFact, setFunFact] = useState(null);
  const [funFactLoading, setFunFactLoading] = useState(true);
  const toast = useToast();

  // Transform habits from backend response to match component expectations
  const transformHabitsFromBackend = (backendHabits) => {
    if (!backendHabits || !Array.isArray(backendHabits)) return [];
    
    return backendHabits.map((habit) => ({
      id: habit._id,
      title: habit.name || habit.title,
      streak: habit.streak || 0,
      completed: habit.completed || false,
      time: 'Anytime',
      iconName: habit.iconName || 'target',
      _original: habit,
    }));
  };

  const refreshHabits = async () => {
    try {
      setHabitsLoading(true);
      // Refresh overview data to get updated habits with streak/completed
      const overviewResponse = await overviewAPI.get();
      if (overviewResponse.habits) {
        setHabits(transformHabitsFromBackend(overviewResponse.habits));
      }
      // Also refresh activities
      if (overviewResponse.activities) {
        setActivities(overviewResponse.activities);
      }
    } catch (error) {
      console.error('Error refreshing habits:', error);
    } finally {
      setHabitsLoading(false);
    }
  };

  const toggleHabit = async (id) => {
    try {
      await habitAPI.toggle(id, new Date().toISOString());
      await refreshHabits(); // Refresh from backend to get updated streak/completed
      toast.success('Habit updated', { duration: 2000 });
    } catch (error) {
      console.error('Error toggling habit:', error);
      toast.error('Failed to update habit');
    }
  };

  const addHabit = () => {
    navigate('/dashboard/habits');
  };

  useEffect(() => {
    fetchOverviewData();
    fetchFunFact();
  }, []);

  const fetchFunFact = async () => {
    try {
      setFunFactLoading(true);
      // Try to fetch from API, fallback to local facts
      try {
        const response = await sleepAPI.getFact('wellness');
        if (response && response.fact) {
          setFunFact({
            icon: response.icon || '✨',
            title: response.title || 'Wellness Fact',
            fact: response.fact,
          });
        } else {
          setFunFact(null); // Will use fallback in component
        }
      } catch (apiError) {
        setFunFact(null);
      }
    } catch (error) {
      console.error('Error fetching fun fact:', error);
      setFunFact(null);
    } finally {
      setFunFactLoading(false);
    }
  };

  const fetchOverviewData = async () => {
    try {
      setLoading(true);
      setHabitsLoading(true);
      
      const overviewResponse = await overviewAPI.get();
      
      if (overviewResponse.moodData && Array.isArray(overviewResponse.moodData)) {
        const validMoods = overviewResponse.moodData.filter(m => {
          return m && m.date && m.score !== undefined && m.score !== null;
        });
        setMoodData(validMoods);
      } else {
        setMoodData([]);
      }

      if (overviewResponse.activities && Array.isArray(overviewResponse.activities)) {
        setActivities(overviewResponse.activities);
      } else {
        setActivities([]);
      }

      if (overviewResponse.habits && Array.isArray(overviewResponse.habits)) {
        setHabits(transformHabitsFromBackend(overviewResponse.habits));
      } else {
        setHabits([]);
      }
    } catch (error) {
      console.error('Error fetching overview data:', error);
      try {
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
        const today = new Date();
        today.setHours(23, 59, 59, 999);
        sevenDaysAgo.setHours(0, 0, 0, 0);
        
        const [moodResponse] = await Promise.all([
          moodAPI.list({
            from: sevenDaysAgo.toISOString(),
            to: today.toISOString(),
            all: true,
          }),
        ]);
        
        if (moodResponse && moodResponse.items && Array.isArray(moodResponse.items)) {
          const validMoods = moodResponse.items.filter(m => {
            return m && m.date && m.score !== undefined && m.score !== null;
          });
          setMoodData(validMoods);
        }
      } catch (fallbackError) {
        console.error('Fallback fetch also failed:', fallbackError);
      }
    } finally {
      setLoading(false);
      setHabitsLoading(false);
    }
  };

  const quickActions = [
    { label: 'Log Mood', icon: Smiley, color: 'text-accent-clay bg-accent-clay-light', path: '/dashboard/mood' },
    { label: 'Habits', icon: Target, color: 'text-accent-sage bg-accent-sage-light', path: '/dashboard/habits' },
    { label: 'Journal', icon: BookOpen, color: 'text-secondary bg-tertiary', path: '/dashboard/journal' },
    { label: 'Sleep', icon: Moon, color: 'text-blue-500 bg-blue-50 dark:bg-blue-950/20', path: '/dashboard/sleep' },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-8 fade-in">
      <header className="flex justify-between items-center mb-8">
        <div>
          {(() => {
            const { greeting, emoji } = getPersonalizedGreeting(user?.displayName || user?.username);
            return (
              <>
                <h1 className="text-3xl font-bold text-primary flex items-center gap-2">
                  {greeting} {emoji}
                </h1>
                <p className="text-secondary mt-1">
                  {getEncouragingMessage({
                    habitsCompleted: habits.filter(h => h.completed).length,
                    streak: 0,
                    moodCount: moodData?.length || 0,
                    journalCount: 0
                  }).text}
                </p>
              </>
            );
          })()}
        </div>
        <div className="flex items-center gap-4">
          <div className="relative">
            <MagnifyingGlass
              className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary"
              size={18}
            />
            <input
              type="text"
              placeholder="Search..."
              className="bg-elevated pl-10 pr-4 py-2 rounded-full border border-primary outline-none focus:border-accent-sage text-sm text-primary placeholder:text-secondary"
            />
          </div>
          <button className="w-10 h-10 bg-elevated rounded-full border border-primary flex items-center justify-center text-secondary hover:text-accent-sage transition-colors">
            <Bell size={20} />
          </button>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div className="md:col-span-1 animate-enter" style={{ animationDelay: '0ms' }}>
          <FunFactWidget funFact={funFact} loading={funFactLoading} getCardStyle={getCardStyle} />
        </div>
        <div className="md:col-span-2 animate-enter" style={{ animationDelay: '100ms' }}>
          <MoodWave moodData={moodData} loading={loading} getCardStyle={getCardStyle} />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {quickActions.map((action, i) => (
              <button
                key={i}
                onClick={() => action.path && navigate(action.path)}
                className="animate-enter interactive-card p-4 flex flex-col items-center gap-3 rounded-3xl"
                style={{ ...getCardStyle(), animationDelay: `${200 + i * 50}ms` }}
              >
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center ${action.color} transition-transform group-hover:scale-110`}
                >
                  <action.icon size={22} fill="currentColor" />
                </div>
                <span className="text-sm font-bold text-primary">{action.label}</span>
              </button>
            ))}
          </div>

          <div className="animate-enter" style={{ animationDelay: '400ms' }}>
            <HabitListWidget habits={habits} onToggle={toggleHabit} onAdd={addHabit} getCardStyle={getCardStyle} />
          </div>
        </div>

        <div className="space-y-6 animate-enter" style={{ animationDelay: '500ms' }}>
          <ActivityFeed activities={activities} loading={loading} getCardStyle={getCardStyle} />
        </div>
      </div>
    </div>
  );
};

export default OverviewPage;

