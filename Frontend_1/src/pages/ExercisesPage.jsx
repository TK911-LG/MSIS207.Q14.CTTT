import BreathingExercise from '../features/exercises/BreathingExercise.jsx'
import Card from '../components/ui/Card.jsx'

export default function ExercisesPage() {
    return (
        <div className="page">
            <header className="page-header">
                <h1>Exercises</h1>
                <p className="subtitle">Practice mindfulness and relaxation</p>
            </header>

            <Card title="Box Breathing">
                <BreathingExercise />
            </Card>

            <Card title="More Exercises Coming Soon">
                <div className="coming-soon">
                    <p>🧘 Guided Meditation</p>
                    <p>💭 Thought Challenging</p>
                    <p>✍️ Gratitude Practice</p>
                    <p className="text-muted">Stay tuned for more exercises!</p>
                </div>
            </Card>
        </div>
    )
}
