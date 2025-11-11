import MoodChart from '../features/mood/MoodChart.jsx'
import InsightsPanel from '../features/analytics/InsightsPanel.jsx'
import TrendAnalysis from '../features/analytics/TrendAnalysis.jsx'
import Card from '../components/ui/Card.jsx'

export default function AnalyticsPage() {
    return (
        <div className="page">
            <header className="page-header">
                <h1>Analytics</h1>
                <p className="subtitle">Understand your patterns and progress</p>
            </header>

            <InsightsPanel />

            <Card title="Mood Over Time">
                <MoodChart days={90} />
            </Card>

            <Card title="Trend Analysis">
                <TrendAnalysis />
            </Card>
        </div>
    )
}
