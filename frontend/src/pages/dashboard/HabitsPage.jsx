import React, { useState, useEffect } from 'react';
import { 
  Plus, Check, Wind, Droplets, BookOpen, Moon, Target, Loader2, Trash2, X,
  Heart, Coffee, Dumbbell, Sun, Sparkles, Music, Camera, Gamepad2, 
  Smile, Zap, Flame, Leaf, Waves, Activity
} from 'lucide-react';
import { habitAPI } from '../../services/api';
import { useToast } from '../../context/ToastContext';

const habitIcons = {
  wind: Wind,
  drop: Droplets,
  'book-open': BookOpen,
  moon: Moon,
  target: Target,
  heart: Heart,
  coffee: Coffee,
  dumbbell: Dumbbell,
  sun: Sun,
  sparkles: Sparkles,
  music: Music,
  camera: Camera,
  gamepad2: Gamepad2,
  smile: Smile,
  zap: Zap,
  flame: Flame,
  leaf: Leaf,
  waves: Waves,
  activity: Activity,
};

const HabitListWidget = ({ habits, onToggle, onAdd, onDelete }) => {

  return (
    <div className="max-w-4xl mx-auto fade-in">
      <header className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-stone-800">Habits</h1>
          <p className="text-stone-500">Build your daily rituals.</p>
        </div>
      </header>

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
                className={`group flex items-center justify-between p-4 rounded-2xl transition-all border border-transparent select-none ${
                  habit.completed
                    ? 'bg-stone-100/50 opacity-60'
                    : 'bg-white hover:border-[#E7F3F0] hover:shadow-sm'
                }`}
              >
                <div 
                  onClick={() => onToggle(habit.id)}
                  className="flex items-center gap-4 flex-1 cursor-pointer"
                >
                  <div
                    className={`w-12 h-12 rounded-lg flex items-center justify-center transition-all duration-300 ${
                      habit.completed
                        ? 'bg-[#5E8B7E] text-white scale-100'
                        : 'bg-stone-100 text-stone-300 group-hover:bg-[#E7F3F0] group-hover:text-[#5E8B7E] group-hover:scale-110'
                    }`}
                  >
                    {habit.completed ? <Check size={20} /> : <IconComponent size={20} />}
                  </div>
                  <div>
                    <p
                      className={`text-sm font-bold transition-colors ${
                        habit.completed ? 'text-stone-400 line-through' : 'text-stone-700'
                      }`}
                    >
                      {habit.title}
                    </p>
                    <div className="flex items-center gap-3 mt-1">
                      <p className="text-xs text-stone-400">{habit.time}</p>
                      {habit.streak > 0 && (
                        <span className="text-xs font-bold text-[#D97757] bg-[#FEEBE5] px-2 py-0.5 rounded-full">
                          🔥 {habit.streak} day{habit.streak > 1 ? 's' : ''}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete(habit.id, habit.title);
                  }}
                  className="opacity-0 group-hover:opacity-100 p-2 rounded-lg text-stone-400 hover:text-red-600 hover:bg-red-50 transition-all ml-2"
                  aria-label="Delete habit"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

const HabitsPage = () => {
  const [habits, setHabits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [newHabitName, setNewHabitName] = useState('');
  const [selectedIcon, setSelectedIcon] = useState('target');
  const [isAdding, setIsAdding] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const toast = useToast();

  // Fetch habits from API
  useEffect(() => {
    fetchHabits();
  }, []);

  const fetchHabits = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await habitAPI.list();
      if (response.items) {
        // Transform API response to match component expectations
        const transformedHabits = response.items.map((habit) => {
          const today = new Date().toDateString();
          const isCompleted = habit.completedDates?.includes(today) || false;
          // Calculate streak (simplified - count consecutive days)
          const sortedDates = habit.completedDates?.sort() || [];
          let streak = 0;
          const todayDate = new Date();
          for (let i = sortedDates.length - 1; i >= 0; i--) {
            const date = new Date(sortedDates[i]);
            const diffDays = Math.floor((todayDate - date) / (1000 * 60 * 60 * 24));
            if (diffDays === streak) {
              streak++;
            } else {
              break;
            }
          }

          // Use iconName from habit if available, otherwise map from category
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
            title: habit.name,
            streak,
            completed: isCompleted,
            time: 'Anytime', // You might want to add time field to habit model
            iconName,
            _original: habit, // Keep original for API calls
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
      // Refresh habits after toggle
      await fetchHabits();
      toast.success('Habit updated', {
        duration: 2000,
      });
    } catch (err) {
      console.error('Error toggling habit:', err);
      toast.error('Failed to update habit. Please try again.');
    }
  };

  const addHabit = async () => {
    if (!newHabitName.trim()) {
      toast.warning('Please enter a habit name', {
        title: 'Invalid Input',
      });
      return;
    }

    setIsAdding(true);
    try {
      // Map icon to category for backend
      const iconToCategory = {
        'wind': 'meditation',
        'drop': 'health',
        'book-open': 'reading',
        'moon': 'sleep',
        'dumbbell': 'exercise',
        'heart': 'wellness',
        'zap': 'productivity',
        'coffee': 'productivity',
        'sun': 'wellness',
        'sparkles': 'wellness',
        'music': 'wellness',
        'camera': 'creativity',
        'gamepad2': 'leisure',
        'smile': 'wellness',
        'flame': 'fitness',
        'leaf': 'wellness',
        'waves': 'wellness',
        'activity': 'fitness',
        'target': 'general',
      };
      
      await habitAPI.create({
        name: newHabitName.trim(),
        category: iconToCategory[selectedIcon] || 'general',
        goal: 1,
        iconName: selectedIcon, // Store icon name
      });
      toast.success(`"${newHabitName.trim()}" habit created`, {
        title: 'Habit Added',
      });
      setNewHabitName('');
      setSelectedIcon('target');
      setShowAddModal(false);
      // Refresh habits after adding
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
      // Refresh habits after deleting
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
      <div className="max-w-4xl mx-auto fade-in flex items-center justify-center min-h-[400px]">
        <Loader2 size={32} className="animate-spin text-stone-400" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto fade-in">
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-red-700">
          {error}
        </div>
      </div>
    );
  }

  return (
    <>
      <HabitListWidget 
        habits={habits} 
        onToggle={toggleHabit} 
        onAdd={() => setShowAddModal(true)}
        onDelete={handleDeleteClick}
      />
      
      {/* Add Habit Modal */}
      {showAddModal && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          onClick={() => {
            setShowAddModal(false);
            setNewHabitName('');
            setSelectedIcon('target');
          }}
        >
          <div 
            className="fixed inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => {
              setShowAddModal(false);
              setNewHabitName('');
              setSelectedIcon('target');
            }}
          />
          <div
            className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 z-10"
            onClick={(e) => e.stopPropagation()}
            style={{
              animation: 'slideInFromTop 0.2s cubic-bezier(0.16, 1, 0.3, 1) forwards',
            }}
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-stone-900">Add New Habit</h2>
              <button
                onClick={() => {
                  setShowAddModal(false);
                  setNewHabitName('');
                  setSelectedIcon('target');
                }}
                className="p-1.5 rounded-lg text-stone-400 hover:text-stone-600 hover:bg-stone-100 transition-colors"
                aria-label="Close"
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="space-y-6">
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
                      setShowAddModal(false);
                      setNewHabitName('');
                      setSelectedIcon('target');
                    }
                  }}
                  placeholder="e.g., Morning Meditation"
                  className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-xl text-stone-900 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-[#5E8B7E]/20 focus:border-[#5E8B7E] transition-all"
                  autoFocus
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-stone-700 mb-3">
                  Choose Icon
                </label>
                <div className="grid grid-cols-6 gap-2">
                  {Object.entries(habitIcons).map(([key, IconComponent]) => (
                    <button
                      key={key}
                      onClick={() => setSelectedIcon(key)}
                      className={`
                        p-3 rounded-xl border-2 transition-all
                        ${selectedIcon === key
                          ? 'border-[#5E8B7E] bg-[#E7F3F0] text-[#5E8B7E] scale-105'
                          : 'border-stone-200 bg-stone-50 text-stone-400 hover:border-stone-300 hover:bg-stone-100'
                        }
                      `}
                      aria-label={`Select ${key} icon`}
                    >
                      <IconComponent size={20} strokeWidth={selectedIcon === key ? 2.5 : 2} />
                    </button>
                  ))}
                </div>
              </div>
              
              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => {
                    setShowAddModal(false);
                    setNewHabitName('');
                    setSelectedIcon('target');
                  }}
                  className="flex-1 px-4 py-2.5 rounded-xl font-semibold text-stone-600 bg-stone-100 hover:bg-stone-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={addHabit}
                  disabled={isAdding || !newHabitName.trim()}
                  className="flex-1 px-4 py-2.5 rounded-xl font-semibold text-white bg-[#1C1917] hover:bg-stone-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isAdding ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      Adding...
                    </>
                  ) : (
                    'Add Habit'
                  )}
                </button>
              </div>
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
                <Trash2 size={24} className="text-red-600" />
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
                    <Loader2 size={16} className="animate-spin" />
                    Deleting...
                  </>
                ) : (
                  <>
                    <Trash2 size={16} />
                    Delete
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default HabitsPage;

