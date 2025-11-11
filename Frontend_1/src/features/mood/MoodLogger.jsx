import { useState } from 'react'
import { useApp } from '../../context/AppContext.jsx'

const MOODS = [
    { score: 10, emoji: '😄', label: 'Amazing' },
    { score: 9, emoji: '😊', label: 'Great' },
    { score: 8, emoji: '🙂', label: 'Good' },
    { score: 7, emoji: '😌', label: 'Okay' },
    { score: 6, emoji: '😐', label: 'Neutral' },
    { score: 5, emoji: '😕', label: 'Meh' },
    { score: 4, emoji: '😟', label: 'Not good' },
    { score: 3, emoji: '😔', label: 'Sad' },
    { score: 2, emoji: '😢', label: 'Very sad' },
    { score: 1, emoji: '😭', label: 'Terrible' }
]

export default function MoodLogger() {
    const { addMood } = useApp()
    const [selected, setSelected] = useState(null)
    const [note, setNote] = useState('')
    const [sleep, setSleep] = useState(7)
    const [activity, setActivity] = useState('')
    const [tags, setTags] = useState([])

    const tagOptions = ['Work', 'Family', 'Friends', 'Exercise', 'Health', 'Stress', 'Relaxation']

    const toggleTag = (tag) => {
        setTags(prev => prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag])
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        if (!selected) return
        addMood(selected, note, tags, sleep, activity)
        // Reset form
        setSelected(null)
        setNote('')
        setTags([])
        setActivity('')
        alert('Mood logged successfully! ✓')
    }

    return (
        <form onSubmit={handleSubmit} className="mood-logger">
            <h2>How are you feeling today?</h2>

            <div className="mood-grid">
                {MOODS.map(m => (
                    <button
                        key={m.score}
                        type="button"
                        onClick={() => setSelected(m.score)}
                        className={`mood-btn ${selected === m.score ? 'selected' : ''}`}
                        aria-label={`${m.label} - ${m.score}/10`}
                    >
                        <span className="mood-emoji">{m.emoji}</span>
                        <span className="mood-label">{m.label}</span>
                    </button>
                ))}
            </div>

            {selected && (
                <div className="mood-details">
                    <div className="form-group">
                        <label htmlFor="sleep">Sleep hours: <strong>{sleep}h</strong></label>
                        <input
                            id="sleep"
                            type="range"
                            min="0"
                            max="12"
                            value={sleep}
                            onChange={(e) => setSleep(Number(e.target.value))}
                            className="slider"
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="activity">Activity (optional)</label>
                        <input
                            id="activity"
                            type="text"
                            value={activity}
                            onChange={(e) => setActivity(e.target.value)}
                            placeholder="e.g., Exercise, Reading, Socializing"
                            className="input"
                        />
                    </div>

                    <div className="form-group">
                        <label>Tags</label>
                        <div className="tag-grid">
                            {tagOptions.map(tag => (
                                <button
                                    key={tag}
                                    type="button"
                                    onClick={() => toggleTag(tag)}
                                    className={`tag-btn ${tags.includes(tag) ? 'active' : ''}`}
                                >
                                    {tag}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="form-group">
                        <label htmlFor="note">Note (optional)</label>
                        <textarea
                            id="note"
                            value={note}
                            onChange={(e) => setNote(e.target.value)}
                            rows={3}
                            placeholder="What's on your mind?"
                            className="textarea"
                        />
                    </div>

                    <button type="submit" className="btn btn-primary btn-lg">
                        Save Mood Entry
                    </button>
                </div>
            )}
        </form>
    )
}
