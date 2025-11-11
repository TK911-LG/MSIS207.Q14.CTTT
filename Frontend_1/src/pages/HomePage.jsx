import { useApp } from '../context/AppContext.jsx'
import { Link } from 'react-router-dom'
import Card from '../components/ui/Card.jsx'
import MoodChart from '../features/mood/MoodChart.jsx'
import { ArrowRight } from 'lucide-react'

export default function HomePage() {
    const { stats, streak } = useApp()

    return (
        <div className="page">
            <header className="page-header">
                <h1>Welcome to MindCare</h1>
                <p className="subtitle">Your mental wellness companion</p>
            </header>

            <div className="stats-grid">
                <Card title="Current Streak">
                    <div className="stat-value">🔥 {streak} days</div>
                    <p className="text-muted">Keep it going!</p>
                </Card>

                <Card title="7-Day Average">
                    <div className="stat-value">{stats.avg7}/10</div>
                    <p className="text-muted">Mood score</p>
                </Card>

                <Card title="Total Entries">
                    <div className="stat-value">{stats.totalMoods}</div>
                    <p className="text-muted">Mood logs</p>
                </Card>

                <Card title="Active Habits">
                    <div className="stat-value">{stats.activeHabits}</div>
                    <p className="text-muted">This week</p>
                </Card>
            </div>

            <Card title="Mood Trend (Last 30 Days)">
                <MoodChart days={30} />
            </Card>

            <div className="quick-actions">
                <h2>Quick Actions</h2>
                <div className="action-grid">
                    <Link to="/mood" className="action-card">
                        <span className="action-icon">😊</span>
                        <span className="action-text">Log Mood</span>
                        <ArrowRight size={16} />
                    </Link>
                    <Link to="/journal" className="action-card">
                        <span className="action-icon">📖</span>
                        <span className="action-text">Write Journal</span>
                        <ArrowRight size={16} />
                    </Link>
                    <Link to="/exercises" className="action-card">
                        <span className="action-icon">🧘</span>
                        <span className="action-text">Practice Breathing</span>
                        <ArrowRight size={16} />
                    </Link>
                    <Link to="/habits" className="action-card">
                        <span className="action-icon">🎯</span>
                        <span className="action-text">Check Habits</span>
                        <ArrowRight size={16} />
                    </Link>
                </div>
            </div>
        </div>
    )
}
