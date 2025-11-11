import { createContext, useContext, useEffect, useState, useMemo } from 'react'

const AppContext = createContext(null)
export const useApp = () => useContext(AppContext)

export function AppProvider({ children }) {
    const [moods, setMoods] = useState([])
    const [journals, setJournals] = useState([])
    const [habits, setHabits] = useState([])
    const [exercises, setExercises] = useState([])
    const [streak, setStreak] = useState(0)

    // Load from localStorage
    useEffect(() => {
        try {
            setMoods(JSON.parse(localStorage.getItem('moods') || '[]'))
            setJournals(JSON.parse(localStorage.getItem('journals') || '[]'))
            setHabits(JSON.parse(localStorage.getItem('habits') || '[]'))
            setExercises(JSON.parse(localStorage.getItem('exercises') || '[]'))
            setStreak(parseInt(localStorage.getItem('streak') || '0', 10))
        } catch {}
    }, [])

    // Save to localStorage
    useEffect(() => { localStorage.setItem('moods', JSON.stringify(moods)) }, [moods])
    useEffect(() => { localStorage.setItem('journals', JSON.stringify(journals)) }, [journals])
    useEffect(() => { localStorage.setItem('habits', JSON.stringify(habits)) }, [habits])
    useEffect(() => { localStorage.setItem('exercises', JSON.stringify(exercises)) }, [exercises])
    useEffect(() => { localStorage.setItem('streak', String(streak)) }, [streak])

    // Add mood entry
    const addMood = (score, note = '', tags = [], sleep = 0, activity = '') => {
        const entry = {
            id: Date.now(),
            date: new Date().toISOString(),
            score,
            note,
            tags,
            sleep,
            activity
        }
        const updated = [...moods, entry]
        setMoods(updated)
        updateStreak(updated)
    }

    // Update streak
    const updateStreak = (all) => {
        if (all.length === 0) { setStreak(0); return }
        const days = new Set(all.map(e => new Date(e.date).toDateString()))
        let count = 0
        let d = new Date()
        while (days.has(d.toDateString())) {
            count++
            d.setDate(d.getDate() - 1)
        }
        setStreak(count)
    }

    // Add journal
    const addJournal = (content, prompt = '') => {
        const entry = {
            id: Date.now(),
            date: new Date().toISOString(),
            content,
            prompt
        }
        setJournals(prev => [...prev, entry])
    }

    // Add habit
    const addHabit = (name, category, goal) => {
        const habit = {
            id: Date.now(),
            name,
            category,
            goal,
            completedDates: []
        }
        setHabits(prev => [...prev, habit])
    }

    // Toggle habit completion
    const toggleHabit = (habitId, date = new Date()) => {
        const dateStr = date.toDateString()
        setHabits(prev => prev.map(h => {
            if (h.id === habitId) {
                const completed = h.completedDates.includes(dateStr)
                return {
                    ...h,
                    completedDates: completed
                        ? h.completedDates.filter(d => d !== dateStr)
                        : [...h.completedDates, dateStr]
                }
            }
            return h
        }))
    }

    // Log exercise session
    const logExercise = (type, duration) => {
        const session = {
            id: Date.now(),
            date: new Date().toISOString(),
            type,
            duration
        }
        setExercises(prev => [...prev, session])
    }

    // Statistics
    const stats = useMemo(() => {
        const last7 = moods.filter(m => Date.now() - new Date(m.date) < 7 * 864e5)
        const last30 = moods.filter(m => Date.now() - new Date(m.date) < 30 * 864e5)

        return {
            totalMoods: moods.length,
            avg7: last7.length ? (last7.reduce((s, m) => s + m.score, 0) / last7.length).toFixed(1) : 0,
            avg30: last30.length ? (last30.reduce((s, m) => s + m.score, 0) / last30.length).toFixed(1) : 0,
            totalJournals: journals.length,
            totalExercises: exercises.length,
            activeHabits: habits.filter(h => h.completedDates.length > 0).length
        }
    }, [moods, journals, exercises, habits])

    const value = {
        moods,
        journals,
        habits,
        exercises,
        streak,
        stats,
        addMood,
        addJournal,
        addHabit,
        toggleHabit,
        logExercise
    }

    return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}
