import MoodLogger from '../features/mood/MoodLogger.jsx'
import MoodHistory from '../features/mood/MoodHistory.jsx'
import Card from '../components/ui/Card.jsx'

export default function MoodPage() {
    return (
        <div className="page">
            <header className="page-header">
                <h1>Mood Tracker</h1>
                <p className="subtitle">Track your emotional wellbeing</p>
            </header>

            <Card>
                <MoodLogger />
            </Card>

            <Card title="Recent Entries">
                <MoodHistory limit={10} />
            </Card>
        </div>
    )
}
