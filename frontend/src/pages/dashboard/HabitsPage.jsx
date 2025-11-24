import React, { useState, useEffect } from 'react';
import { 
  Plus, Check, Spinner, Trash, X, Target, Trophy, ChartLine, Calendar, Flame, Sparkle,
  // Health & Wellness
  Heart, Leaf, Pill, FirstAid,
  // Exercise & Fitness
  Barbell, Bicycle, PersonSimpleWalk, Flower,
  // Mental & Learning
  Brain, BookOpen, Lightbulb, GraduationCap,
  // Daily Life
  Coffee, Drop, Moon, Sun,
  // Creative & Fun
  MusicNote, Palette, Camera, PencilSimple,
  // Social & Communication
  Phone, ChatCircle, Gift, Hand
} from 'phosphor-react';
import { habitAPI } from '../../services/api';
import { useToast } from '../../context/ToastContext';
import { humanTouchContent, getActionRecommendation } from '../../utils/personalization';

// Curated icon set - arranged in 3 rows of 10 icons each
const habitIcons = {
  // Row 1 (10 icons) - arranged to avoid adjacent similar colors
  heart: Heart,           // red
  bicycle: Bicycle,       // teal
  brain: Brain,           // violet
  drop: Drop,            // cyan
  barbell: Barbell,      // orange
  moon: Moon,            // indigo
  music: MusicNote,      // pink
  sun: Sun,              // yellow
  'book-open': BookOpen,  // indigo
  phone: Phone,          // green
  // Row 2 (10 icons)
  apple: Leaf,           // emerald
  coffee: Coffee,        // amber
  pill: Pill,            // blue
  paint: Palette,        // rose
  running: PersonSimpleWalk, // red
  lightbulb: Lightbulb,   // yellow
  stethoscope: FirstAid, // cyan
  camera: Camera,        // fuchsia
  yoga: Flower,          // purple
  chat: ChatCircle,      // teal
  // Row 3 (4 icons)
  graduation: GraduationCap, // blue
  pencil: PencilSimple,  // slate
  gift: Gift,            // pink
  handshake: Hand,       // emerald
};

// Default healthy habits suggestions
const suggestedHabits = [
  { name: 'Drink 8 glasses of water', icon: 'drop', category: 'health' },
  { name: 'Morning meditation', icon: 'brain', category: 'meditation' },
  { name: 'Read for 30 minutes', icon: 'book-open', category: 'reading' },
  { name: 'Exercise or workout', icon: 'barbell', category: 'exercise' },
  { name: 'Get 8 hours of sleep', icon: 'moon', category: 'sleep' },
  { name: 'Eat fruits & vegetables', icon: 'apple', category: 'health' },
  { name: 'Take a walk outside', icon: 'sun', category: 'wellness' },
  { name: 'Practice gratitude', icon: 'heart', category: 'wellness' },
  { name: 'No phone before bed', icon: 'moon', category: 'sleep' },
  { name: 'Stretch or yoga', icon: 'yoga', category: 'wellness' },
];

// Icon color mapping - pastel colors, arranged to avoid adjacent duplicates
const getIconColor = (iconName) => {
  const colorMap = {
    // Health & Wellness - Red/Pink tones
    heart: { bg: 'bg-red-50', text: 'text-red-500', border: 'border-red-200' },
    apple: { bg: 'bg-emerald-50', text: 'text-emerald-500', border: 'border-emerald-200' },
    pill: { bg: 'bg-blue-50', text: 'text-blue-500', border: 'border-blue-200' },
    stethoscope: { bg: 'bg-cyan-50', text: 'text-cyan-500', border: 'border-cyan-200' },
    // Exercise & Fitness - Orange/Red tones
    barbell: { bg: 'bg-orange-50', text: 'text-orange-500', border: 'border-orange-200' },
    bicycle: { bg: 'bg-teal-50', text: 'text-teal-500', border: 'border-teal-200' },
    running: { bg: 'bg-red-50', text: 'text-red-500', border: 'border-red-200' },
    yoga: { bg: 'bg-purple-50', text: 'text-purple-500', border: 'border-purple-200' },
    // Mental & Learning - Purple/Blue tones
    brain: { bg: 'bg-violet-50', text: 'text-violet-500', border: 'border-violet-200' },
    'book-open': { bg: 'bg-indigo-50', text: 'text-indigo-500', border: 'border-indigo-200' },
    lightbulb: { bg: 'bg-yellow-50', text: 'text-yellow-500', border: 'border-yellow-200' },
    graduation: { bg: 'bg-blue-50', text: 'text-blue-500', border: 'border-blue-200' },
    // Daily Life - Warm tones
    coffee: { bg: 'bg-amber-50', text: 'text-amber-500', border: 'border-amber-200' },
    drop: { bg: 'bg-cyan-50', text: 'text-cyan-500', border: 'border-cyan-200' },
    moon: { bg: 'bg-indigo-50', text: 'text-indigo-500', border: 'border-indigo-200' },
    sun: { bg: 'bg-yellow-50', text: 'text-yellow-500', border: 'border-yellow-200' },
    // Creative & Fun - Pink/Purple tones
    music: { bg: 'bg-pink-50', text: 'text-pink-500', border: 'border-pink-200' },
    paint: { bg: 'bg-rose-50', text: 'text-rose-500', border: 'border-rose-200' },
    camera: { bg: 'bg-fuchsia-50', text: 'text-fuchsia-500', border: 'border-fuchsia-200' },
    pencil: { bg: 'bg-slate-50', text: 'text-slate-500', border: 'border-slate-200' },
    // Social & Communication - Green/Teal tones
    phone: { bg: 'bg-green-50', text: 'text-green-500', border: 'border-green-200' },
    chat: { bg: 'bg-teal-50', text: 'text-teal-500', border: 'border-teal-200' },
    gift: { bg: 'bg-pink-50', text: 'text-pink-500', border: 'border-pink-200' },
    handshake: { bg: 'bg-emerald-50', text: 'text-emerald-500', border: 'border-emerald-200' },
  };
  return colorMap[iconName] || { bg: 'bg-stone-50', text: 'text-stone-500', border: 'border-stone-200' };
};

// Stats Cards Component
const StatsCards = ({ habits }) => {
  const totalHabits = habits.length;
  const completedToday = habits.filter(h => h.completed).length;
  const completionRate = totalHabits > 0 ? Math.round((completedToday / totalHabits) * 100) : 0;
  const longestStreak = habits.length > 0 
    ? Math.max(...habits.map(h => h.streak || 0), 0) 
    : 0;

  const stats = [
    {
      label: 'Total Habits',
      value: totalHabits,
      icon: Target,
      color: 'from-[#5E8B7E] to-[#4a7a6d]',
      bgColor: 'bg-[#E7F3F0]',
    },
    {
      label: 'Today\'s Progress',
      value: `${completionRate}%`,
      icon: ChartLine,
      color: 'from-[#D97757] to-[#c26647]',
      bgColor: 'bg-[#FEEBE5]',
      subtext: `${completedToday} of ${totalHabits} completed`,
    },
    {
      label: 'Longest Streak',
      value: longestStreak,
      icon: Trophy,
      color: 'from-[#F59E0B] to-[#d97706]',
      bgColor: 'bg-[#FEF3C7]',
      subtext: longestStreak === 1 ? '1 day' : `${longestStreak} days`,
    },
  ];

  if (totalHabits === 0) return null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
      {stats.map((stat, index) => {
        const IconComponent = stat.icon;
        return (
          <div
            key={index}
            className="bg-white rounded-2xl p-6 card-shadow relative overflow-hidden group hover:shadow-lg transition-all duration-300"
          >
            <div className="relative z-10">
              <div className="flex items-start justify-between mb-4">
                <div className={`${stat.bgColor} p-3 rounded-xl`}>
                  <IconComponent size={24} className="text-stone-700" />
                </div>
              </div>
              <div className="mt-2">
                <p className="text-xs font-semibold text-stone-500 uppercase tracking-wider mb-1">
                  {stat.label}
                </p>
                <p className="text-3xl font-bold text-stone-900 mb-1">
                  {stat.value}
                </p>
                {stat.subtext && (
                  <p className="text-xs text-stone-400 mt-1">
                    {stat.subtext}
                  </p>
                )}
              </div>
            </div>
            <div className={`absolute -right-8 -bottom-8 w-32 h-32 bg-gradient-to-br ${stat.color} rounded-full opacity-5 group-hover:opacity-10 transition-opacity`} />
          </div>
        );
      })}
    </div>
  );
};

// Empty State Component with human touch
const EmptyState = ({ onAdd }) => {
  const content = humanTouchContent.emptyStates.habits;
  return (
    <div className="bg-white rounded-3xl p-8 md:p-16 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-[#5E8B7E]/5 to-transparent" />
      <div className="relative z-10 text-center">
        <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-[#E7F3F0] to-[#5E8B7E]/10 flex items-center justify-center animate-pulse">
          <Sparkle size={48} className="text-[#5E8B7E]" weight="duotone" />
        </div>
        <h3 className="text-2xl font-bold text-stone-900 mb-3">
          {content.title}
        </h3>
        <p className="text-stone-500 mb-8 max-w-md mx-auto text-lg leading-relaxed">
          {content.message}
        </p>
        <p className="text-sm text-stone-400 mb-6 italic">
          {getActionRecommendation('noHabits')}
        </p>
      </div>
    </div>
  );
};

// Habit Card Component
const HabitCard = ({ habit, onToggle, onDelete }) => {
  const IconComponent = habitIcons[habit.iconName] || Target;
  const iconColors = getIconColor(habit.iconName);

  return (
    <div
      className={`group relative bg-white rounded-2xl p-5 border-2 transition-all duration-300 hover:shadow-lg ${
        habit.completed
          ? 'border-[#5E8B7E]/30 bg-[#E7F3F0]/30'
          : `border-stone-100 ${iconColors.border}`
      }`}
    >
      <div className="flex items-start gap-4">
        {/* Icon & Check Button */}
        <button
          onClick={() => onToggle(habit.id)}
          className={`shrink-0 w-14 h-14 rounded-xl flex items-center justify-center transition-all duration-300 ${
            habit.completed
              ? 'bg-[#5E8B7E] text-white scale-100 shadow-md'
              : `${iconColors.bg} ${iconColors.text} hover:scale-110 group-hover:shadow-md`
          }`}
        >
          {habit.completed ? (
            <Check size={24} weight="bold" />
          ) : (
            <IconComponent size={24} weight="fill" />
          )}
        </button>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-2">
            <div className="flex-1">
              <h3
                className={`font-bold text-base transition-colors ${
                  habit.completed
                    ? 'text-stone-400 line-through'
                    : 'text-stone-900'
                }`}
              >
                {habit.title}
              </h3>
              <div className="flex items-center gap-3 mt-1.5">
                {habit.streak > 0 && (
                  <span className="inline-flex items-center gap-1 text-xs font-bold text-[#D97757] bg-[#FEEBE5] px-2.5 py-1 rounded-full">
                    <Flame size={12} weight="fill" />
                    {habit.streak} {habit.streak === 1 ? 'day' : 'days'}
                  </span>
                )}
              </div>
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete(habit.id, habit.title);
              }}
              className="opacity-0 group-hover:opacity-100 p-2 rounded-lg text-stone-400 hover:text-red-600 hover:bg-red-50 transition-all shrink-0"
              aria-label="Delete habit"
            >
              <Trash size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const HabitsPage = () => {
  const [habits, setHabits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isCreating, setIsCreating] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [newHabitName, setNewHabitName] = useState('');
  const [selectedIcon, setSelectedIcon] = useState('heart');
  const [isAdding, setIsAdding] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const toast = useToast();

  useEffect(() => {
    fetchHabits();
  }, []);

  const fetchHabits = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await habitAPI.list();
      if (response.items) {
        const transformedHabits = response.items.map((habit) => {
          const today = new Date().toDateString();
          const isCompleted = habit.completedDates?.includes(today) || false;
          
          // Calculate streak
          const sortedDates = habit.completedDates?.sort() || [];
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

          let iconName = habit.iconName || 'heart';
          if (!habit.iconName && habit.category) {
            const categoryToIcon = {
              'meditation': 'brain',
              'health': 'drop',
              'reading': 'book-open',
              'sleep': 'moon',
              'exercise': 'barbell',
              'wellness': 'heart',
              'productivity': 'lightbulb',
              'fitness': 'barbell',
              'creativity': 'camera',
              'learning': 'graduation',
              'social': 'phone',
              'general': 'heart',
            };
            iconName = categoryToIcon[habit.category?.toLowerCase()] || 'heart';
          }
          
          // Fallback: if iconName doesn't exist in habitIcons, use 'heart'
          if (!habitIcons[iconName]) {
            iconName = 'heart';
          }

          // Ensure name is always a string
          let habitName = habit.name;
          if (typeof habitName !== 'string') {
            if (habitName && typeof habitName === 'object') {
              habitName = habitName.name || habitName.title || String(habitName);
            } else {
              habitName = String(habitName || 'Untitled Habit');
            }
          }

          return {
            id: habit._id,
            title: habitName.trim(),
            streak,
            completed: isCompleted,
            iconName,
            _original: habit,
          };
        });
        setHabits(transformedHabits);
      }
    } catch (err) {
      console.error('Error fetching habits:', err);
      setError('Failed to load habits. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const toggleHabit = async (id) => {
    const habit = habits.find((h) => h.id === id);
    if (!habit) return;

    try {
      await habitAPI.toggle(id, new Date().toISOString());
      await fetchHabits();
      toast.success(
        habit.completed 
          ? 'No worries - you can always try again tomorrow! 💙' 
          : humanTouchContent.feedback.success.habitCompleted, 
        {
          duration: 3000,
        }
      );
    } catch (err) {
      console.error('Error toggling habit:', err);
      toast.error('Failed to update habit. Please try again.');
    }
  };

  const addHabit = async (habitName = null, iconName = null, category = null) => {
    // Ensure we get a string value, not an object
    let nameValue = habitName;
    if (habitName && typeof habitName === 'object') {
      nameValue = habitName.name || habitName.title || String(habitName);
    }
    const finalName = String(nameValue || newHabitName || '').trim();
    const finalIcon = String(iconName || selectedIcon || 'heart');
    const finalCategory = category ? String(category) : null;
    
    if (!finalName || finalName === '') {
      toast.warning('Please enter a habit name', {
        title: 'Invalid Input',
      });
      return;
    }

    if (!finalIcon || !habitIcons[finalIcon]) {
      toast.warning('Please select a valid icon', {
        title: 'Invalid Icon',
      });
      return;
    }

    setIsAdding(true);
    try {
      const iconToCategory = {
        // Health & Wellness
        'heart': 'wellness',
        'apple': 'health',
        'pill': 'health',
        'stethoscope': 'health',
        // Exercise & Fitness
        'barbell': 'exercise',
        'bicycle': 'exercise',
        'running': 'exercise',
        'yoga': 'wellness',
        // Mental & Learning
        'brain': 'meditation',
        'book-open': 'reading',
        'lightbulb': 'productivity',
        'graduation': 'learning',
        // Daily Life
        'coffee': 'productivity',
        'drop': 'health',
        'moon': 'sleep',
        'sun': 'wellness',
        // Creative & Fun
        'music': 'creativity',
        'paint': 'creativity',
        'camera': 'creativity',
        'pencil': 'creativity',
        // Social & Communication
        'phone': 'social',
        'chat': 'social',
        'gift': 'social',
        'handshake': 'social',
      };
      
      const habitData = {
        name: finalName.trim(),
        category: finalCategory || iconToCategory[finalIcon] || 'general',
        goal: 1,
        iconName: finalIcon,
      };
      
      await habitAPI.create(habitData);
      const displayName = typeof finalName === 'string' ? finalName : String(finalName);
      toast.success(humanTouchContent.feedback.success.habitCreated, {
        title: 'Habit Added ✨',
      });
      setNewHabitName('');
      setSelectedIcon('heart');
      setIsCreating(false);
      await fetchHabits();
    } catch (err) {
      console.error('Error adding habit:', err);
      toast.error('Failed to add habit. Please try again.', {
        title: 'Error',
      });
    } finally {
      setIsAdding(false);
    }
  };

  const handleDeleteClick = (id, habitName) => {
    setDeleteTarget({ id, name: habitName });
    setShowDeleteModal(true);
  };

  const deleteHabit = async () => {
    if (!deleteTarget) return;

    setIsDeleting(true);
    try {
      await habitAPI.delete(deleteTarget.id);
      toast.success(`"${deleteTarget.name}" habit deleted`, {
        title: 'Habit Deleted',
      });
      setShowDeleteModal(false);
      setDeleteTarget(null);
      await fetchHabits();
    } catch (err) {
      console.error('Error deleting habit:', err);
      toast.error('Failed to delete habit. Please try again.', {
        title: 'Error',
      });
    } finally {
      setIsDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto fade-in flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Spinner size={40} className="animate-spin text-[#5E8B7E] mx-auto mb-4" />
          <p className="text-stone-500">Loading your habits...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-6xl mx-auto fade-in">
        <div className="bg-red-50 border border-red-200 rounded-2xl p-6 text-red-700">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto fade-in">
      {/* Sticky Header */}
      <div className="sticky top-0 z-40 bg-white/95 backdrop-blur-sm border-b border-stone-200 -mx-4 px-4 py-4 mb-8">
        <header className="flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-bold text-stone-900 mb-2">Habits</h1>
            <p className="text-stone-500 text-lg">Build your daily rituals and track your progress.</p>
          </div>
          {!isCreating && (
            <button
              onClick={() => {
                setIsCreating(true);
                // Scroll to top smoothly
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="flex items-center gap-2 px-5 py-3 bg-[#1C1917] text-white rounded-xl font-semibold hover:bg-stone-800 transition-all shadow-lg hover:shadow-xl"
            >
              <Plus size={20} weight="bold" />
              Add Habit
            </button>
          )}
        </header>
      </div>

      {/* Create Habit Form - Inline */}
      {isCreating && (
        <div className="bg-white rounded-3xl p-8 card-shadow mb-8 fade-in-up sticky top-24 z-30">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-stone-900">New Habit</h2>
            <button
              onClick={() => {
                setIsCreating(false);
                setNewHabitName('');
                setSelectedIcon('heart');
              }}
              className="p-2 rounded-full hover:bg-stone-100 text-stone-400 hover:text-stone-600 transition-colors"
            >
              <X size={20} weight="bold" />
            </button>
          </div>

          <div className="space-y-6">
            {/* Custom Habit Input */}
            <div>
              <label className="block text-sm font-semibold text-stone-700 mb-2">
                Habit Name
              </label>
              <input
                type="text"
                value={newHabitName}
                onChange={(e) => setNewHabitName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !isAdding && newHabitName.trim()) {
                    addHabit();
                  }
                  if (e.key === 'Escape') {
                    setIsCreating(false);
                    setNewHabitName('');
                    setSelectedIcon('heart');
                  }
                }}
                placeholder="e.g., Morning Meditation"
                className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-xl text-stone-900 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-[#5E8B7E]/20 focus:border-[#5E8B7E] transition-all"
                autoFocus
              />
            </div>

            {/* Icon Selection */}
            <div>
              <label className="block text-sm font-semibold text-stone-700 mb-3">
                Choose Icon
              </label>
              <div className="grid grid-cols-10 gap-2">
                {Object.entries(habitIcons).map(([key, IconComponent]) => {
                  const iconColors = getIconColor(key);
                  return (
                    <button
                      key={key}
                      onClick={() => setSelectedIcon(key)}
                      className={`
                        aspect-square p-2.5 rounded-xl border-2 transition-all duration-200
                        ${selectedIcon === key
                          ? 'border-[#5E8B7E] bg-[#E7F3F0] text-[#5E8B7E] scale-105 shadow-md ring-2 ring-[#5E8B7E]/20'
                          : `${iconColors.border} ${iconColors.bg} ${iconColors.text} hover:scale-105 hover:shadow-sm`
                        }
                      `}
                      aria-label={`Select ${key} icon`}
                    >
                      <IconComponent 
                        size={18} 
                        weight="fill" 
                        className="mx-auto"
                      />
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-2">
              <button
                onClick={addHabit}
                disabled={isAdding || !newHabitName.trim()}
                className="flex-1 px-4 py-3 rounded-xl font-semibold text-white bg-[#1C1917] hover:bg-stone-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isAdding ? (
                  <>
                    <Spinner size={16} className="animate-spin" />
                    Adding...
                  </>
                ) : (
                  <>
                    <Check size={18} weight="bold" />
                    Create Habit
                  </>
                )}
              </button>
              <button
                onClick={() => {
                  setIsCreating(false);
                  setNewHabitName('');
                  setSelectedIcon('heart');
                }}
                className="px-6 py-3 rounded-xl font-semibold text-stone-600 bg-stone-100 hover:bg-stone-200 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Stats Cards - Hide when creating */}
      {!isCreating && <StatsCards habits={habits} />}

      {/* Quick Add Suggested Habits - Show when user has few or no habits, but hide when creating */}
      {habits.length < 3 && !isCreating && (
        <div className="bg-white rounded-3xl p-6 card-shadow mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-bold text-stone-900">Get Started with Healthy Habits</h3>
              <p className="text-sm text-stone-500 mt-1">Click to add instantly</p>
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {suggestedHabits.slice(0, 8).map((suggestion, idx) => {
              const IconComponent = habitIcons[suggestion.icon] || Target;
              const iconColors = getIconColor(suggestion.icon);
              const exists = habits.some(h => h.title.toLowerCase() === suggestion.name.toLowerCase());
              
              return (
                <button
                  key={idx}
                  onClick={() => {
                    if (!exists && !isAdding) {
                      addHabit(suggestion.name, suggestion.icon, suggestion.category);
                    }
                  }}
                  disabled={exists || isAdding}
                  className={`
                    relative flex flex-col items-center gap-2 px-4 py-3 rounded-xl border-2 transition-all
                    ${exists 
                      ? 'border-stone-200 bg-stone-50 text-stone-400 cursor-not-allowed'
                      : `${iconColors.border} ${iconColors.bg} ${iconColors.text} hover:scale-105 hover:shadow-md active:scale-95`
                    }
                    disabled:opacity-50 disabled:cursor-not-allowed
                  `}
                >
                  {exists && (
                    <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-[#5E8B7E] flex items-center justify-center">
                      <Check size={12} weight="bold" className="text-white" />
                    </div>
                  )}
                  <IconComponent size={24} weight="fill" />
                  <span className="text-xs font-medium text-center leading-tight">
                    {suggestion.name}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Habits List or Empty State */}
      {habits.length === 0 ? (
        <EmptyState onAdd={() => setIsCreating(true)} />
      ) : (
        <div className="bg-white rounded-3xl p-8 card-shadow relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-[#5E8B7E]/5 to-transparent rounded-full blur-3xl -mr-32 -mt-32" />
          
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-2xl font-bold text-stone-900">Daily Rituals</h3>
                <p className="text-sm text-stone-500 mt-1">Your habits for today</p>
              </div>
              <button
                onClick={() => setIsCreating(true)}
                className="w-10 h-10 rounded-full bg-[#E7F3F0] flex items-center justify-center text-[#5E8B7E] hover:bg-[#5E8B7E] hover:text-white transition-all shadow-sm"
              >
                <Plus size={20} weight="bold" />
              </button>
            </div>
            
            <div className="space-y-3">
              {habits.map((habit) => (
                <HabitCard
                  key={habit.id}
                  habit={habit}
                  onToggle={toggleHabit}
                  onDelete={handleDeleteClick}
                />
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && deleteTarget && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          onClick={() => {
            setShowDeleteModal(false);
            setDeleteTarget(null);
          }}
        >
          <div 
            className="fixed inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => {
              setShowDeleteModal(false);
              setDeleteTarget(null);
            }}
          />
          <div
            className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 z-10"
            onClick={(e) => e.stopPropagation()}
            style={{
              animation: 'slideInFromTop 0.2s cubic-bezier(0.16, 1, 0.3, 1) forwards',
            }}
          >
            <div className="mb-6">
              <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center mb-4 mx-auto">
                <Trash size={24} className="text-red-600" />
              </div>
              <h2 className="text-xl font-bold text-stone-900 text-center mb-2">
                Delete Habit?
              </h2>
              <p className="text-sm text-stone-600 text-center">
                Are you sure you want to delete <span className="font-semibold text-stone-900">"{deleteTarget.name}"</span>? This action cannot be undone.
              </p>
            </div>
            
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setDeleteTarget(null);
                }}
                disabled={isDeleting}
                className="flex-1 px-4 py-2.5 rounded-xl font-semibold text-stone-600 bg-stone-100 hover:bg-stone-200 transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={deleteHabit}
                disabled={isDeleting}
                className="flex-1 px-4 py-2.5 rounded-xl font-semibold text-white bg-red-600 hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isDeleting ? (
                  <>
                    <Spinner size={16} className="animate-spin" />
                    Deleting...
                  </>
                ) : (
                  <>
                    <Trash size={16} />
                    Delete
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HabitsPage;
