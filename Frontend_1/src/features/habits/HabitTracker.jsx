import { useState } from 'react'
import { useApp } from '../../context/AppContext.jsx'
import { Check, Plus, Trash2 } from 'lucide-react'

export default function HabitTracker() {
    const { habits, addHabit, toggleHabit } = useApp()
    const [showForm, setShowForm] = useState(false)
    const [newHabit, setNewHabit] = useState({ name: '', category: 'Health', goal: 7 })

    const categories = ['Health', 'Fitness', 'Mindfulness', 'Social', 'Personal']

    const handleAdd = (e) => {
        e.preventDefault()
        if (!newHabit.name.trim()) return
        addHabit(newHabit.name, newHabit.category, newHabit.goal)
        setNewHabit({ name: '', category: 'Health', goal: 7 })
        setShowForm(false)
    }

    const today = new Date().toDateString()
    const last7Days = Array.from({ length: 7 }, (_, i) => {
        const d = new Date()
        d.setDate(d.getDate() - (6 - i))
        return d
    })

    return (
        <div className="habit-tracker">
            <div className="habit-header">
                <h2>My Habits</h2>
                <button onClick={() => setShowForm(!showForm)} className="btn btn-primary btn-sm">
                    <Plus size={16} /> Add Habit
                </button>
            </div>

            {showForm && (
                <form onSubmit={handleAdd} className="habit-form">
                    <input
                        type="text"
                        value={newHabit.name}
                        onChange={(e) => setNewHabit({ ...newHabit, name: e.target.value })}
                        placeholder="Habit name (e.g., Morning meditation)"
                        className="input"
                    />
                    <select
                        value={newHabit.category}
                        onChange={(e) => setNewHabit({ ...newHabit, category: e.target.value })}
                        className="select"
                    >
                        {categories.map(cat => (
                            <option key={cat} value={cat}>{cat}</option>
                        ))}
                    </select>
                    <div className="form-row">
                        <button type="submit" className="btn btn-primary btn-sm">Save</button>
                        <button type="button" onClick={() => setShowForm(false)} className="btn btn-ghost btn-sm">
                            Cancel
                        </button>
                    </div>
                </form>
            )}

            {habits.length === 0 ? (
                <div className="empty-state">
                    <p>🎯 No habits yet</p>
                    <p className="text-muted">Add a habit to start tracking</p>
                </div>
            ) : (
                <div className="habits-list">
                    {habits.map(habit => {
                        const completedToday = habit.completedDates.includes(today)
                        const weekProgress = last7Days.filter(d =>
                            habit.completedDates.includes(d.toDateString())
                        ).length

                        return (
                            <div key={habit.id} className="habit-item">
                                <div className="habit-info">
                                    <div className="habit-name">{habit.name}</div>
                                    <div className="habit-meta">
                                        <span className="habit-category">{habit.category}</span>
                                        <span className="habit-progress">{weekProgress}/{habit.goal} this week</span>
                                    </div>
                                </div>
                                <div className="habit-week">
                                    {last7Days.map(date => {
                                        const dateStr = date.toDateString()
                                        const completed = habit.completedDates.includes(dateStr)
                                        const isToday = dateStr === today

                                        return (
                                            <button
                                                key={dateStr}
                                                onClick={() => toggleHabit(habit.id, date)}
                                                className={`habit-day ${completed ? 'completed' : ''} ${isToday ? 'today' : ''}`}
                                                title={date.toLocaleDateString('en-US', { weekday: 'short' })}
                                            >
                                                {completed ? <Check size={14} /> : date.getDate()}
                                            </button>
                                        )
                                    })}
                                </div>
                            </div>
                        )
                    })}
                </div>
            )}
        </div>
    )
}
