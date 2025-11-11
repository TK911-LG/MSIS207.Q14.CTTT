import HabitTracker from '../features/habits/HabitTracker.jsx'
import Card from '../components/ui/Card.jsx'

export default function HabitsPage() {
    return (
        <div className="page">
            <header className="page-header">
                <h1>Habit Tracker</h1>
                <p className="subtitle">Build positive habits for better wellbeing</p>
            </header>

            <Card>
                <HabitTracker />
            </Card>

            <Card title="Tips for Building Habits">
                <div className="tips-list">
                    <div className="tip-item">
                        <strong>Start Small:</strong> Begin with habits that take less than 2 minutes
                    </div>
                    <div className="tip-item">
                        <strong>Be Consistent:</strong> Same time, same place every day
                    </div>
                    <div className="tip-item">
                        <strong>Track Progress:</strong> Use this tracker to visualize your streak
                    </div>
                    <div className="tip-item">
                        <strong>Be Patient:</strong> It takes about 66 days to form a new habit
                    </div>
                </div>
            </Card>
        </div>
    )
}
