import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts'
import { useApp } from '../../context/AppContext.jsx'

export default function MoodChart({ days = 30 }) {
    const { moods } = useApp()

    const data = moods
        .slice(-days)
        .map(m => ({
            date: new Date(m.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
            mood: m.score,
            fullDate: new Date(m.date).toLocaleDateString()
        }))

    if (data.length === 0) {
        return (
            <div className="empty-state">
                <p>📊 No mood data yet</p>
                <p className="text-muted">Start logging your mood to see trends!</p>
            </div>
        )
    }

    return (
        <div className="chart-container">
            <ResponsiveContainer width="100%" height={320}>
                <LineChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 10 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis
                        dataKey="date"
                        tick={{ fontSize: 12, fill: '#6b7280' }}
                        tickMargin={8}
                    />
                    <YAxis
                        domain={[0, 10]}
                        tick={{ fontSize: 12, fill: '#6b7280' }}
                        tickMargin={8}
                    />
                    <Tooltip
                        contentStyle={{
                            background: '#fff',
                            border: '1px solid #e5e7eb',
                            borderRadius: '8px',
                            padding: '8px 12px'
                        }}
                    />
                    <Line
                        type="monotone"
                        dataKey="mood"
                        stroke="#3b82f6"
                        strokeWidth={3}
                        dot={{ fill: '#3b82f6', r: 5 }}
                        activeDot={{ r: 7 }}
                    />
                </LineChart>
            </ResponsiveContainer>
        </div>
    )
}
