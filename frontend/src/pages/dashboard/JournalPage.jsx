import React, { useState, useEffect } from 'react';
import { 
  PencilSimple, Sparkle, Hash, Trash, Pencil, X, Check, Calendar,
  BookOpen, Plus
} from 'phosphor-react';
import { journalAPI } from '../../services/api';
import { useToast } from '../../context/ToastContext';
import { humanTouchContent, getActionRecommendation } from '../../utils/personalization';

const dailyPrompts = [
  "What is a small victory you had today that you might be overlooking?",
  "What made you smile today?",
  "What are you grateful for?",
  "What challenged you today?",
  "What did you learn today?",
  "How did you take care of yourself today?",
  "What would you tell your future self?",
  "What are three things that went well?",
  "What emotions did you experience today?",
  "What are you looking forward to?",
  "What made today unique?",
  "What moment today made you pause and reflect?",
  "What would you do differently if you could relive today?",
];

const JournalPage = () => {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isWriting, setIsWriting] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [currentPrompt, setCurrentPrompt] = useState('');
  const [formData, setFormData] = useState({
    content: '',
    prompt: '',
    date: new Date().toISOString().split('T')[0],
  });
  const toast = useToast();

  useEffect(() => {
    fetchEntries();
    // Set daily prompt based on day of year for consistency
    const today = new Date();
    const startOfYear = new Date(today.getFullYear(), 0, 1);
    const dayOfYear = Math.floor((today - startOfYear) / (1000 * 60 * 60 * 24));
    setCurrentPrompt(dailyPrompts[dayOfYear % dailyPrompts.length]);
  }, []);

  const fetchEntries = async () => {
    try {
      setLoading(true);
      const response = await journalAPI.list({ limit: 50 });
      if (response.items) {
        setEntries(response.items);
      }
    } catch (error) {
      console.error('Error fetching journals:', error);
      toast.error('Failed to load journal entries', {
        title: 'Error',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async () => {
    if (!formData.content.trim()) {
      toast.warning('Please write something before saving', {
        title: 'Empty Entry',
      });
      return;
    }

    try {
      await journalAPI.create({
        content: formData.content,
        prompt: formData.prompt || currentPrompt,
        date: new Date(formData.date).toISOString(),
      });
      
      toast.success(humanTouchContent.feedback.success.journalSaved, {
        title: 'Entry Saved ✨',
      });
      
      resetForm();
      fetchEntries();
    } catch (error) {
      console.error('Error creating journal:', error);
      toast.error('Failed to save journal entry', {
        title: 'Error',
      });
    }
  };

  const handleUpdate = async () => {
    if (!formData.content.trim()) {
      toast.warning('Please write something before saving', {
        title: 'Empty Entry',
      });
      return;
    }

    try {
      await journalAPI.update(editingId, {
        content: formData.content,
        prompt: formData.prompt,
        date: new Date(formData.date).toISOString(),
      });
      
      toast.success('Journal entry updated successfully', {
        title: 'Updated',
      });
      
      resetForm();
      fetchEntries();
    } catch (error) {
      console.error('Error updating journal:', error);
      toast.error('Failed to update journal entry', {
        title: 'Error',
      });
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this entry?')) {
      return;
    }

    try {
      await journalAPI.delete(id);
      toast.success('Journal entry deleted', {
        title: 'Deleted',
      });
      fetchEntries();
    } catch (error) {
      console.error('Error deleting journal:', error);
      toast.error('Failed to delete journal entry', {
        title: 'Error',
      });
    }
  };

  const handleEdit = (entry) => {
    setEditingId(entry._id);
    setFormData({
      content: entry.content,
      prompt: entry.prompt || '',
      date: new Date(entry.date).toISOString().split('T')[0],
    });
    setIsWriting(true);
  };

  const resetForm = () => {
    setFormData({
      content: '',
      prompt: '',
      date: new Date().toISOString().split('T')[0],
    });
    setIsWriting(false);
    setEditingId(null);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric',
        year: date.getFullYear() !== today.getFullYear() ? 'numeric' : undefined
      });
    }
  };

  const getTimeAgo = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays}d ago`;
    return formatDate(dateString);
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto fade-in">
        <div className="flex items-center justify-center py-20">
          <div className="text-stone-400 text-sm">Loading journal entries...</div>
        </div>
      </div>
    );
  }

  const formatDateForDisplay = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getEntryTitle = (entry) => {
    // Generate title from date (e.g., "Monday Reflections")
    const date = new Date(entry.date);
    const dayName = date.toLocaleDateString('en-US', { weekday: 'long' });
    return `${dayName} Reflections`;
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 fade-in">
      <header className="mb-12">
        <h1 className="text-5xl font-serif font-bold text-stone-900 mb-2">Journal</h1>
        <p className="text-stone-600 text-lg">Track your well-being journey.</p>
      </header>

      {/* Writing Form */}
      {isWriting && (
        <div className="bg-white rounded-3xl p-8 shadow-sm border border-stone-100 fade-in-up">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-serif font-bold text-stone-900">
              {editingId ? 'Edit Entry' : 'New Entry'}
            </h2>
            <button
              onClick={resetForm}
              className="p-2 rounded-full hover:bg-stone-100 text-stone-400 hover:text-stone-600 transition-colors"
            >
              <X size={24} />
            </button>
          </div>

          {!editingId && currentPrompt && (
            <div className="mb-8 p-6 bg-amber-50 rounded-2xl border border-amber-200">
              <div className="flex items-center gap-3 mb-3">
                <span className="px-3 py-1.5 bg-amber-100 text-amber-900 rounded-lg text-xs font-bold uppercase tracking-wider">
                  Daily Prompt
                </span>
                <span className="text-sm text-stone-500">
                  {formatDateForDisplay(formData.date)}
                </span>
              </div>
              <blockquote className="text-xl font-serif text-stone-900 leading-relaxed mb-4">
                "{currentPrompt}"
              </blockquote>
              <button
                onClick={() => setFormData({ ...formData, prompt: currentPrompt })}
                className="text-sm text-amber-700 hover:text-amber-900 font-medium underline"
              >
                Use this prompt
              </button>
            </div>
          )}

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-stone-700 mb-2">
                Date
              </label>
              <input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:border-stone-400 focus:bg-white text-stone-800"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-stone-700 mb-2">
                {editingId ? 'Prompt (optional)' : 'Custom Prompt (optional)'}
              </label>
              <input
                type="text"
                value={formData.prompt}
                onChange={(e) => setFormData({ ...formData, prompt: e.target.value })}
                placeholder="Add a custom prompt or leave blank"
                className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:border-stone-400 focus:bg-white text-stone-800"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-stone-700 mb-2">
                Your Thoughts
              </label>
              <textarea
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                placeholder="Write your thoughts here..."
                rows={14}
                className="w-full px-4 py-4 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:border-stone-400 focus:bg-white text-stone-800 resize-none leading-relaxed text-lg font-serif"
              />
              <p className="text-xs text-stone-400 mt-2">
                {formData.content.length} characters
              </p>
            </div>

            <div className="flex gap-3 pt-4">
              <button
                onClick={editingId ? handleUpdate : handleCreate}
                className="px-6 py-3 bg-stone-900 text-white rounded-full font-semibold hover:bg-stone-800 transition-colors flex items-center gap-2"
              >
                <Check size={18} /> {editingId ? 'Update Entry' : 'Save Entry'}
              </button>
              <button
                onClick={resetForm}
                className="px-6 py-3 rounded-full border border-stone-200 text-stone-600 font-semibold hover:bg-stone-50 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Daily Prompt Card (when not writing) */}
      {!isWriting && currentPrompt && (
        <div className="bg-white rounded-3xl p-8 shadow-sm border border-stone-100">
          <div className="flex items-center justify-between mb-6">
            <span className="px-3 py-1.5 bg-amber-100 text-amber-900 rounded-lg text-xs font-bold uppercase tracking-wider">
              Daily Prompt
            </span>
            <span className="text-sm text-stone-400">
              {formatDateForDisplay(new Date().toISOString())}
            </span>
          </div>
          <blockquote className="text-2xl font-serif text-stone-900 leading-relaxed mb-6">
            "{currentPrompt}"
          </blockquote>
          <button
            onClick={() => setIsWriting(true)}
            className="px-6 py-3 bg-stone-900 text-white rounded-full text-sm font-semibold hover:bg-stone-800 transition-colors"
          >
            Write Response
          </button>
        </div>
      )}

      {/* Journal Entries List */}
      {entries.length === 0 && !isWriting ? (
        <div className="bg-white rounded-3xl p-16 flex flex-col items-center justify-center text-center shadow-sm border border-stone-100">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-stone-50 to-stone-100 mb-6 flex items-center justify-center">
            <BookOpen size={40} className="text-stone-400" weight="duotone" />
          </div>
          <h3 className="text-2xl font-serif font-bold text-stone-900 mb-3">
            {humanTouchContent.emptyStates.journal.title}
          </h3>
          <p className="text-stone-600 text-base mb-6 max-w-md leading-relaxed">
            {humanTouchContent.emptyStates.journal.message}
          </p>
          <p className="text-sm text-stone-400 mb-8 italic">
            {getActionRecommendation('noJournal')}
          </p>
          <button
            onClick={() => setIsWriting(true)}
            className="px-8 py-4 bg-stone-900 text-white rounded-full font-semibold hover:bg-stone-800 transition-colors flex items-center gap-2"
          >
            <Plus size={20} /> {humanTouchContent.emptyStates.journal.action}
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {entries.map((entry) => (
            <div
              key={entry._id}
              className="bg-white rounded-3xl p-8 shadow-sm border border-stone-100 hover:shadow-md transition-all group"
            >
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-3xl font-serif font-bold text-stone-900">
                  {getEntryTitle(entry)}
                </h2>
                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEdit(entry);
                    }}
                    className="p-2 rounded-lg hover:bg-stone-100 text-stone-400 hover:text-stone-700 transition-colors"
                    title="Edit"
                  >
                    <Pencil size={18} />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(entry._id);
                    }}
                    className="p-2 rounded-lg hover:bg-red-50 text-stone-400 hover:text-red-500 transition-colors"
                    title="Delete"
                  >
                    <Trash size={18} />
                  </button>
                </div>
              </div>

              <p className="text-stone-700 text-lg font-serif leading-relaxed mb-4">
                {entry.content.length > 200 ? `${entry.content.substring(0, 200)}...` : entry.content}
              </p>

              {entry.prompt && (
                <div className="mt-4 pt-4 border-t border-stone-100">
                  <p className="text-sm text-stone-500 italic">
                    Prompt: "{entry.prompt}"
                  </p>
                </div>
              )}

              <div className="mt-4 pt-4 border-t border-stone-100 flex items-center justify-between">
                <span className="text-sm text-stone-400">
                  {formatDateForDisplay(entry.date)}
                </span>
                <button
                  onClick={() => handleEdit(entry)}
                  className="text-sm text-stone-600 hover:text-stone-900 font-medium"
                >
                  Read more →
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default JournalPage;
