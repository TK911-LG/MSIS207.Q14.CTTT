import { useApp } from '../../context/AppContext.jsx'
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts'

export default function TrendAnalysis() {
    const { moods } = useApp()

    if (moods.length < 7) {
        return (
            <div className="empty-state">
                <p>Not enough data for trend analysis</p>
                <p className="text-muted">Log moods for at least 7 days</p>
            </div>
        )
    }

    // Group by day of week
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
    const byDay = moods.reduce((acc, m) => {
        const day = new Date(m.date).getDay()
        if (!acc[day]) acc[day] = []
        acc[day].push(m.score)
        return acc
    }, {})

    const dayData = dayNames.map((name, i) => ({
        day: name,
        avg: byDay[i] ? (byDay[i].reduce((a, b) => a + b, 0) / byDay[i].length).toFixed(1) : 0
    }))

    // Group by tags
    const taggedMoods = moods.filter(m => m.tags.length > 0)
    const tagScores = taggedMoods.reduce((acc, m) => {
        m.tags.forEach(tag => {
            if (!acc[tag]) acc[tag] = []
            acc[tag].push(m.score)
        })
        return acc
    }, {})

    const tagData = Object.entries(tagScores)
        .map(([tag, scores]) => ({
            tag,
            avg: (scores.reduce((a, b) => a + b, 0) / scores.length).toFixed(1),
            count: scores.length
        }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 5)

    return (
        <div className="trend-analysis">
            <div className="trend-section">
                <h3>Average Mood by Day of Week</h3>
                <ResponsiveContainer width="100%" height={250}>
                    <BarChart data={dayData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                        <XAxis dataKey="day" tick={{ fontSize: 12 }} />
                        <YAxis domain={[0, 10]} tick={{ fontSize: 12 }} />
                        <Tooltip />
                        <Bar dataKey="avg" fill="#3b82f6" radius={[8, 8, 0, 0]} />
                    </BarChart>
                </ResponsiveContainer>
            </div>

            {tagData.length > 0 && (
                <div className="trend-section">
                    <h3>Average Mood by Tag</h3>
                    <ResponsiveContainer width="100%" height={250}>
                        <BarChart data={tagData} layout="horizontal">
                            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                            <XAxis type="number" domain={[0, 10]} tick={{ fontSize: 12 }} />
                            <YAxis type="category" dataKey="tag" tick={{ fontSize: 12 }} width={80} />
                            <Tooltip />
                            <Bar dataKey="avg" fill="#10b981" radius={[0, 8, 8, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            )}
        </div>
    )
}
