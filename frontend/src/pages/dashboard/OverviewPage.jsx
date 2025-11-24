import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../../context/ToastContext';
import { 
  Timer, Flame, Smiley, Wind, BookOpen, Drop, Plus, Check, 
  Activity, Moon, MagnifyingGlass, Bell, Target, TrendUp, Sparkle
} from 'phosphor-react';
import { moodAPI, habitAPI, journalAPI } from '../../services/api';
import { 
  getPersonalizedGreeting, 
  getEncouragingMessage, 
  getTimeBasedBackground,
  getPersonalizedInsight,
  humanTouchContent 
} from '../../utils/personalization';

const MindfulnessWidget = ({ minutes = 35 }) => (
  <div className="bg-white p-6 rounded-[32px] card-shadow relative overflow-hidden h-full group cursor-default">
    <div className="flex justify-between items-start mb-2 relative z-10">
      <div>
        <h3 className="text-stone-800 font-bold text-lg">Mindfulness</h3>
        <p className="text-stone-400 text-xs font-medium uppercase tracking-wider mt-1">
          Time Centering
        </p>
      </div>
      <div className="bg-[#E7F3F0] text-[#5E8B7E] p-2 rounded-full">
        <Timer size={20} fill="currentColor" />
      </div>
    </div>
    <div className="mt-8 relative z-10">
      <div className="flex items-end gap-2">
        <span className="text-6xl font-bold text-stone-800 tracking-tight">{minutes}</span>
        <span className="text-xl font-medium text-stone-400 mb-2">min</span>
      </div>
      <div className="mt-6 flex items-center gap-3">
        <div className="h-1.5 flex-1 bg-stone-100 rounded-full overflow-hidden">
          <div className="h-full bg-[#5E8B7E] w-[60%] rounded-full transition-all duration-500" />
        </div>
        <span className="text-xs font-bold text-stone-400">Goal: 60m</span>
      </div>
    </div>
  </div>
);

const MoodWave = ({ moodData, loading }) => {
  const getLast7DaysData = () => {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const weekData = [];
    const today = new Date();
    
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      date.setHours(0, 0, 0, 0);
      
      const dayName = days[date.getDay()];
      const dateStr = date.toISOString().split('T')[0];
      
      // Find mood entry for this date
      const moodEntry = moodData?.find(m => {
        const moodDate = new Date(m.date);
        moodDate.setHours(0, 0, 0, 0);
        return moodDate.getTime() === date.getTime();
      });
      
      if (moodEntry) {
        // Convert score (1-10) to level (1-5)
        const level = Math.ceil(moodEntry.score / 2);
        weekData.push({
          dayName,
          level,
          score: moodEntry.score,
          hasData: true,
        });
      } else {
        weekData.push({
          dayName,
          level: 0,
          score: 0,
          hasData: false,
        });
      }
    }
    
    return weekData;
  };

  const getColorForLevel = (level) => {
    if (level === 0) return '#E5E7EB';
    const colors = ['#FCA5A5', '#FDBA74', '#F5F5F4', '#E7F3F0', '#5E8B7E'];
    return colors[Math.min(level - 1, 4)] || '#E5E7EB';
  };

  const getHeight = (level) => {
    if (level === 0) return 10;
    return (level / 5) * 100;
  };

  const weekData = getLast7DaysData();
  const hasData = moodData && moodData.length > 0;

  if (loading) {
    return (
      <div className="bg-white p-8 rounded-[32px] card-shadow relative overflow-hidden col-span-1 md:col-span-2 flex items-center justify-center">
        <div className="animate-pulse text-stone-400">Loading mood data...</div>
      </div>
    );
  }

  // Calculate average mood for personalized insight
  const avgScore = hasData && weekData.filter(d => d.hasData).length > 0
    ? weekData.filter(d => d.hasData).reduce((sum, d) => sum + d.score, 0) / weekData.filter(d => d.hasData).length
    : 0;
  const insightType = avgScore >= 7 ? 'improving' : avgScore >= 5 ? 'stable' : 'declining';

  return (
    <div className="bg-white p-8 rounded-[32px] card-shadow relative overflow-hidden col-span-1 md:col-span-2 flex flex-col justify-between">
      <div className="flex justify-between items-start mb-4 relative z-10">
        <div className="flex-1">
          <h3 className="text-stone-800 font-bold text-lg">Emotional Flow</h3>
          <p className="text-stone-400 text-xs font-medium mt-1 flex items-center gap-1">
            <TrendUp size={14} />
            <span>Last 7 days trend</span>
          </p>
          {hasData && avgScore > 0 && (
            <p className="text-xs text-stone-500 mt-2 italic leading-relaxed">
              {getPersonalizedInsight({ avgScore, type: insightType }, 'mood')}
            </p>
          )}
        </div>
      </div>
      {!hasData ? (
        <div className="h-40 w-full flex flex-col items-center justify-center text-center px-4">
          <Sparkle size={32} className="text-stone-300 mb-2" weight="duotone" />
          <p className="text-stone-400 text-sm mb-1">
            {humanTouchContent.emptyStates.mood.message}
          </p>
          <p className="text-xs text-stone-400 italic">
            {getActionRecommendation('noMood')}
          </p>
        </div>
      ) : (
        <div className="h-40 w-full flex items-end justify-between gap-2 relative z-10">
          {weekData.map((day, i) => {
            const height = getHeight(day.level);
            const color = getColorForLevel(day.level);
            const isToday = i === weekData.length - 1;
            return (
              <div
                key={i}
                className="flex flex-col items-center gap-2 w-full group cursor-pointer"
                title={day.hasData ? `${day.dayName}: ${day.score}/10` : `${day.dayName}: No entry`}
              >
                <div
                  className="w-full rounded-t-2xl relative overflow-hidden transition-all duration-500 group-hover:brightness-110"
                  style={{
                    height: `${Math.max(height, 15)}%`,
                    backgroundColor: color,
                    minHeight: '15px',
                    border: isToday ? '2px solid #5E8B7E' : 'none',
                    boxShadow: isToday ? '0 0 0 2px rgba(94, 139, 126, 0.2)' : 'none',
                  }}
                >
                  {day.hasData && (
                    <div className="absolute inset-0 bg-gradient-to-t from-black/5 to-transparent" />
                  )}
                </div>
                <div className="text-[10px] font-bold text-stone-400 uppercase">
                  {day.dayName.slice(0, 1)}
                </div>
                {day.hasData && (
                  <div className="text-[9px] text-stone-500 font-medium">
                    {day.score}/10
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

const HabitListWidget = ({ habits, onToggle, onAdd }) => {
  const habitIcons = {
    wind: Wind,
    drop: Drop,
    'book-open': BookOpen,
    moon: Moon,
    target: Target,
  };

  return (
    <div className="bg-white/50 p-8 rounded-[32px] border border-white/60 relative overflow-hidden">
      <div className="flex items-center justify-between mb-6 relative z-10">
        <div>
          <h3 className="text-xl font-bold text-stone-800">Daily Rituals</h3>
        </div>
        <button
          onClick={onAdd}
          className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-stone-400 hover:text-[#5E8B7E] hover:bg-[#E7F3F0] transition-colors shadow-sm"
        >
          <Plus size={20} />
        </button>
      </div>
      <div className="space-y-2 relative z-10">
        {habits.map((habit) => {
          const IconComponent = habitIcons[habit.iconName] || Target;
          return (
            <div
              key={habit.id}
              onClick={() => onToggle(habit.id)}
              className={`group flex items-center justify-between p-4 rounded-2xl transition-all cursor-pointer border border-transparent select-none ${
                habit.completed
                  ? 'bg-stone-100/50 opacity-60'
                  : 'bg-white hover:border-[#E7F3F0] hover:shadow-sm'
              }`}
            >
              <div className="flex items-center gap-4">
                <div
                  className={`w-12 h-12 rounded-lg flex items-center justify-center transition-all duration-300 ${
                    habit.completed
                      ? 'bg-[#5E8B7E] text-white scale-100'
                      : 'bg-stone-100 text-stone-300 group-hover:bg-[#E7F3F0] group-hover:text-[#5E8B7E] group-hover:scale-110'
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
                        ? 'text-stone-400 line-through'
                        : 'text-stone-700'
                    }`}
                  >
                    {habit.title}
                  </p>
                  <p className="text-xs text-stone-400">{habit.time}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const ActivityFeed = ({ activities, loading }) => {
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
      <div className="bg-white p-6 rounded-[32px] card-shadow mt-6">
        <h3 className="font-bold text-stone-800 mb-4">Recent Activity</h3>
        <div className="animate-pulse text-stone-400 text-sm">Loading...</div>
      </div>
    );
  }

  if (!activities || activities.length === 0) {
    return (
      <div className="bg-white p-6 rounded-[32px] card-shadow mt-6">
        <h3 className="font-bold text-stone-800 mb-4">Recent Activity</h3>
        <div className="text-center py-6">
          <Sparkle size={24} className="text-stone-300 mx-auto mb-2" weight="duotone" />
          <p className="text-stone-400 text-sm mb-1">Your activity feed is quiet</p>
          <p className="text-xs text-stone-400 italic">Start logging your mood or completing habits to see your journey unfold! ✨</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-[32px] card-shadow mt-6">
      <h3 className="font-bold text-stone-800 mb-4">Recent Activity</h3>
      <div className="relative pl-4 space-y-6 border-l border-stone-100">
        {activities.map((item, i) => (
          <div key={i} className="relative">
            <div
              className={`absolute -left-[21px] top-1 w-3 h-3 rounded-full border-2 border-white ring-1 ring-white ${item.color}`}
            />
            <p className="text-sm font-medium text-stone-700">{item.text}</p>
            <p className="text-xs text-stone-400 mt-0.5" title={new Date(item.date).toLocaleString()}>
              {formatTime(item.date)}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

const StreakWidget = ({ habits }) => {
  // Calculate overall streak from all habits
  const calculateOverallStreak = () => {
    if (!habits || habits.length === 0) return 0;
    
    // Get all unique completion dates from all habits
    const allDates = new Set();
    habits.forEach(habit => {
      if (habit._original?.completedDates) {
        habit._original.completedDates.forEach(date => allDates.add(date));
      }
    });
    
    if (allDates.size === 0) return 0;
    
    // Sort dates and calculate consecutive days
    const sortedDates = Array.from(allDates)
      .map(d => new Date(d))
      .sort((a, b) => a - b);
    
    let streak = 0;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    // Count consecutive days from today backwards
    for (let i = sortedDates.length - 1; i >= 0; i--) {
      const date = new Date(sortedDates[i]);
      date.setHours(0, 0, 0, 0);
      const diffDays = Math.floor((today - date) / (1000 * 60 * 60 * 24));
      
      if (diffDays === streak) {
        streak++;
      } else if (diffDays > streak) {
        break;
      }
    }
    
    return streak;
  };

  const streak = calculateOverallStreak();
  const dayText = streak === 1 ? 'day' : 'days';

  return (
    <div className="bg-white p-6 rounded-[32px] card-shadow flex items-center justify-between relative overflow-hidden group mt-6 border border-stone-200">
      <div className="relative z-10">
        <p className="text-stone-400 text-xs font-bold uppercase tracking-widest mb-1">
          Streak
        </p>
        <h3 className="text-4xl font-bold text-stone-500">
          {streak} <span className="text-lg font-medium text-stone-500">{dayText}</span>
        </h3>
      </div>
      <div className="relative z-10 w-14 h-14 rounded-full bg-orange-500/10 flex items-center justify-center text-[#D97757] border border-orange-500/20">
        <Flame size={28} fill="currentColor" className="animate-pulse" />
      </div>
    </div>
  );
};

const OverviewPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [moodData, setMoodData] = useState([]);
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [habits, setHabits] = useState([]);
  const [habitsLoading, setHabitsLoading] = useState(true);
  const toast = useToast();

  const fetchHabits = async () => {
    try {
      setHabitsLoading(true);
      const response = await habitAPI.list();
      if (response.items) {
        // Transform API response to match component expectations
        const transformedHabits = response.items.map((habit) => {
          const today = new Date().toDateString();
          // Check if habit is completed today
          const isCompleted = habit.completedDates?.includes(today) || false;

          // Calculate streak from completedDates
          const sortedDates = (habit.completedDates || []).sort();
          let streak = 0;
          const todayDate = new Date();
          todayDate.setHours(0, 0, 0, 0);
          
          for (let i = sortedDates.length - 1; i >= 0; i--) {
            const date = new Date(sortedDates[i]);
            date.setHours(0, 0, 0, 0);
            const diffDays = Math.floor((todayDate - date) / (1000 * 60 * 60 * 24));
            if (diffDays === streak) {
              streak++;
            } else {
              break;
            }
          }

          // Use iconName from habit if available
          let iconName = habit.iconName || 'target';
          if (!habit.iconName && habit.category) {
            const categoryToIcon = {
              'meditation': 'wind',
              'health': 'drop',
              'reading': 'book-open',
              'sleep': 'moon',
              'exercise': 'dumbbell',
              'wellness': 'heart',
              'productivity': 'zap',
              'fitness': 'dumbbell',
              'creativity': 'camera',
              'leisure': 'gamepad2',
              'general': 'target',
            };
            iconName = categoryToIcon[habit.category?.toLowerCase()] || 'target';
          }

          return {
            id: habit._id,
            title: habit.name || habit.title,
            streak,
            completed: isCompleted,
            time: 'Anytime',
            iconName,
            _original: habit,
          };
        });
        setHabits(transformedHabits);
      }
    } catch (error) {
      console.error('Error fetching habits:', error);
    } finally {
      setHabitsLoading(false);
    }
  };

  const toggleHabit = async (id) => {
    try {
      await habitAPI.toggle(id, new Date().toISOString());
      await fetchHabits();
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
    fetchHabits();
  }, []);

  const fetchOverviewData = async () => {
    try {
      setLoading(true);
      
      // Get last 7 days
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
      
      // Fetch mood data for last 7 days
      const [moodResponse, journalResponse, habitResponse] = await Promise.all([
        moodAPI.list({
          from: sevenDaysAgo.toISOString(),
          to: new Date().toISOString(),
          all: true,
        }),
        journalAPI.list({ limit: 5 }),
        habitAPI.list(),
      ]);

      // Process mood data
      if (moodResponse.items) {
        setMoodData(moodResponse.items);
      }

      // Create activity feed from recent entries
      const activityList = [];
      
      // Add recent mood entries
      if (moodResponse.items && moodResponse.items.length > 0) {
        moodResponse.items
          .sort((a, b) => new Date(b.date) - new Date(a.date))
          .slice(0, 3)
          .forEach(mood => {
            const moodLabels = {
              1: 'Very Low',
              2: 'Low',
              3: 'Neutral',
              4: 'Good',
              5: 'Great',
            };
            activityList.push({
              text: `Logged mood: ${moodLabels[Math.ceil(mood.score / 2)] || 'Neutral'}`,
              date: mood.date,
              color: 'bg-[#D97757]',
            });
          });
      }

      // Add recent journal entries
      if (journalResponse.items && journalResponse.items.length > 0) {
        journalResponse.items
          .sort((a, b) => new Date(b.createdAt || b.date) - new Date(a.createdAt || a.date))
          .slice(0, 2)
          .forEach(journal => {
            activityList.push({
              text: `Journal entry: ${journal.title || 'Untitled'}`,
              date: journal.createdAt || journal.date,
              color: 'bg-[#78716C]',
            });
          });
      }

      // Add recent habit completions
      if (habitResponse.items && habitResponse.items.length > 0) {
        habitResponse.items.forEach(habit => {
          if (habit.completedDates && habit.completedDates.length > 0) {
            // Get most recent completion date
            const sortedDates = habit.completedDates
              .map(d => new Date(d))
              .sort((a, b) => b - a);
            if (sortedDates.length > 0) {
              activityList.push({
                text: `Completed: ${habit.name || habit.title}`,
                date: sortedDates[0].toISOString(),
                color: 'bg-[#5E8B7E]',
              });
            }
          }
        });
      }

      // Sort by date and take most recent 5
      activityList.sort((a, b) => new Date(b.date) - new Date(a.date));
      setActivities(activityList.slice(0, 5));
    } catch (error) {
      console.error('Error fetching overview data:', error);
    } finally {
      setLoading(false);
    }
  };

  const quickActions = [
    { label: 'Log Mood', icon: Smiley, color: 'text-[#D97757] bg-[#FEEBE5]', path: '/dashboard/mood' },
    { label: 'Habits', icon: Target, color: 'text-[#5E8B7E] bg-[#E7F3F0]', path: '/dashboard/habits' },
    { label: 'Journal', icon: BookOpen, color: 'text-[#78716C] bg-[#F5F5F4]', path: '/dashboard/journal' },
    { label: 'Sleep', icon: Moon, color: 'text-[#7DD3FC] bg-[#E0F2FE]', path: '/dashboard/sleep' },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-8 fade-in">
      <header className="flex justify-between items-center mb-8">
        <div>
          {(() => {
            const { greeting, emoji } = getPersonalizedGreeting(user?.displayName || user?.username);
            return (
              <>
                <h1 className="text-3xl font-bold text-stone-800 flex items-center gap-2">
                  {greeting} {emoji}
                </h1>
                <p className="text-stone-500 mt-1">
                  {getEncouragingMessage({
                    habitsCompleted: habits.filter(h => h.completed).length,
                    streak: habits.length > 0 ? Math.max(...habits.map(h => h.streak || 0)) : 0,
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
              className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400"
              size={18}
            />
            <input
              type="text"
              placeholder="Search..."
              className="bg-white pl-10 pr-4 py-2 rounded-full border border-stone-200 outline-none focus:border-[#5E8B7E] text-sm"
            />
          </div>
          <button className="w-10 h-10 bg-white rounded-full border border-stone-200 flex items-center justify-center text-stone-400 hover:text-[#5E8B7E] transition-colors">
            <Bell size={20} />
          </button>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div className="md:col-span-1">
          <MindfulnessWidget />
        </div>
        <MoodWave moodData={moodData} loading={loading} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {quickActions.map((action, i) => (
              <button
                key={i}
                onClick={() => action.path && navigate(action.path)}
                className="heal-card p-4 flex flex-col items-center gap-3 hover:scale-105 transition-transform"
              >
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center ${action.color}`}
                >
                  <action.icon size={22} fill="currentColor" />
                </div>
                <span className="text-sm font-bold text-stone-600">{action.label}</span>
              </button>
            ))}
          </div>

          <HabitListWidget habits={habits} onToggle={toggleHabit} onAdd={addHabit} />
        </div>

        <div className="space-y-6">
          <StreakWidget habits={habits} />
          <ActivityFeed activities={activities} loading={loading} />
        </div>
      </div>
    </div>
  );
};

export default OverviewPage;

