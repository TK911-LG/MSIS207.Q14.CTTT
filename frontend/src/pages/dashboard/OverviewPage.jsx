import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { 
  Timer, Flame, Smile, Wind, BookOpen, Droplets, Plus, Check, 
  Activity, Moon, Search, Bell, Target
} from 'lucide-react';

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

const MoodWave = ({ history = [4, 3, 5, 4, 2, 4, 5] }) => (
  <div className="bg-white p-8 rounded-[32px] card-shadow relative overflow-hidden col-span-1 md:col-span-2 flex flex-col justify-between">
    <div className="flex justify-between items-center mb-2 relative z-10">
      <div>
        <h3 className="text-stone-800 font-bold text-lg">Emotional Flow</h3>
        <p className="text-stone-400 text-xs font-medium mt-1">Last 7 days trend</p>
      </div>
    </div>
    <div className="h-40 w-full flex items-end justify-between gap-3 relative z-10 px-2">
      {history.map((level, i) => {
        const height = level * 20;
        const colors = ['#FCA5A5', '#FDBA74', '#F5F5F4', '#E7F3F0', '#5E8B7E'];
        return (
          <div
            key={i}
            className="flex flex-col items-center gap-3 w-full group cursor-pointer"
            title={`Level ${level}/5`}
          >
            <div
              className="w-full bg-stone-50 rounded-2xl relative overflow-hidden transition-all duration-500 group-hover:bg-stone-100"
              style={{ height: `${height}%` }}
            >
              <div
                className="absolute bottom-0 w-full transition-all duration-500 group-hover:opacity-90 opacity-80"
                style={{
                  height: '100%',
                  backgroundColor: colors[level - 1],
                }}
              />
            </div>
          </div>
        );
      })}
    </div>
  </div>
);

const HabitListWidget = ({ habits, onToggle, onAdd }) => {
  const habitIcons = {
    wind: Wind,
    drop: Droplets,
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

const ActivityFeed = () => (
  <div className="bg-white p-6 rounded-[32px] card-shadow mt-6">
    <h3 className="font-bold text-stone-800 mb-4">Recent Activity</h3>
    <div className="relative pl-4 space-y-6 border-l border-stone-100">
      {[
        { text: 'Logged mood: Great 😄', time: '2h ago', color: 'bg-[#D97757]' },
        { text: 'Completed: Meditation', time: '5h ago', color: 'bg-[#5E8B7E]' },
      ].map((item, i) => (
        <div key={i} className="relative">
          <div
            className={`absolute -left-[21px] top-1 w-3 h-3 rounded-full border-2 border-white ring-1 ring-white ${item.color}`}
          />
          <p className="text-sm font-medium text-stone-700">{item.text}</p>
          <p className="text-xs text-stone-400 mt-0.5">{item.time}</p>
        </div>
      ))}
    </div>
  </div>
);

const StreakWidget = () => (
  <div className="bg-[#1C1917] p-6 rounded-[32px] card-shadow text-white flex items-center justify-between relative overflow-hidden group mt-6">
    <div className="relative z-10">
      <p className="text-stone-400 text-xs font-bold uppercase tracking-widest mb-1">
        Streak
      </p>
      <h3 className="text-4xl font-bold text-white">
        12 <span className="text-lg font-medium text-stone-500">days</span>
      </h3>
    </div>
    <div className="relative z-10 w-14 h-14 rounded-full bg-orange-500/10 flex items-center justify-center text-[#D97757] border border-orange-500/20">
      <Flame size={28} fill="currentColor" className="animate-pulse" />
    </div>
  </div>
);

const OverviewPage = () => {
  const { user } = useAuth();
  const [habits, setHabits] = useState([
    {
      id: 1,
      title: 'Morning Meditation',
      streak: 12,
      completed: true,
      time: '07:00 AM',
      iconName: 'wind',
    },
    {
      id: 2,
      title: 'Drink 2L Water',
      streak: 5,
      completed: false,
      time: 'All Day',
      iconName: 'drop',
    },
    {
      id: 3,
      title: 'Read 10 Pages',
      streak: 24,
      completed: false,
      time: '09:00 PM',
      iconName: 'book-open',
    },
    {
      id: 4,
      title: 'No Screen Time',
      streak: 3,
      completed: true,
      time: '10:00 PM',
      iconName: 'moon',
    },
  ]);

  const toggleHabit = (id) => {
    setHabits(habits.map((h) => (h.id === id ? { ...h, completed: !h.completed } : h)));
  };

  const addHabit = () => {
    const title = prompt('Enter new habit:');
    if (title) {
      setHabits([
        ...habits,
        {
          id: Date.now(),
          title,
          streak: 0,
          completed: false,
          time: 'Anytime',
          iconName: 'target',
        },
      ]);
    }
  };

  const quickActions = [
    { label: 'Log Mood', icon: Smile, color: 'text-[#D97757] bg-[#FEEBE5]' },
    { label: 'Breathe', icon: Wind, color: 'text-[#5E8B7E] bg-[#E7F3F0]' },
    { label: 'Journal', icon: BookOpen, color: 'text-[#78716C] bg-[#F5F5F4]' },
    { label: 'Hydrate', icon: Droplets, color: 'text-[#7DD3FC] bg-[#E0F2FE]' },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-8 fade-in">
      <header className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-stone-800">Overview</h1>
          <p className="text-stone-500">Welcome back, {user?.displayName || user?.username}</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="relative">
            <Search
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
        <MoodWave />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {quickActions.map((action, i) => (
              <button
                key={i}
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
          <StreakWidget />
          <ActivityFeed />
        </div>
      </div>
    </div>
  );
};

export default OverviewPage;

