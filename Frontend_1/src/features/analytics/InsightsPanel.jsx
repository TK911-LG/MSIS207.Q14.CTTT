import { useApp } from '../../context/AppContext.jsx'
import { TrendingUp, TrendingDown, Minus } from 'lucide-react'

export default function InsightsPanel() {
    const { moods } = useApp()

    if (moods.length < 3) {
        return (
            <div className="insights-panel">
                <h3>Insights</h3>
                <p className="text-muted">Log more moods to see personalized insights</p>
            </div>
        )
    }

    const last7 = moods.filter(m => Date.now() - new Date(m.date) < 7 * 864e5)
    const last14 = moods.filter(m => Date.now() - new Date(m.date) < 14 * 864e5)
    const prev7 = last14.filter(m => Date.now() - new Date(m.date) >= 7 * 864e5)

    const avg7 = last7.length ? last7.reduce((s, m) => s + m.score, 0) / last7.length : 0
    const avgPrev7 = prev7.length ? prev7.reduce((s, m) => s + m.score, 0) / prev7.length : 0
    const trend = avg7 - avgPrev7

    const allTags = moods.flatMap(m => m.tags)
    const tagCounts = allTags.reduce((acc, tag) => {
        acc[tag] = (acc[tag] || 0) + 1
        return acc
    }, {})
    const topTag = Object.entries(tagCounts).sort((a, b) => b[1] - a[1])[0]

    const avgSleep = last7.length && last7.filter(m => m.sleep > 0).length
        ? last7.filter(m => m.sleep > 0).reduce((s, m) => s + m.sleep, 0) / last7.filter(m => m.sleep > 0).length
        : 0

    const insights = []

    if (trend > 0.5) {
        insights.push({
            icon: <TrendingUp className="insight-icon positive" />,
            text: `Your mood is trending upward! +${trend.toFixed(1)} compared to last week.`
        })
    } else if (trend < -0.5) {
        insights.push({
            icon: <TrendingDown className="insight-icon negative" />,
            text: `Your mood has declined by ${Math.abs(trend).toFixed(1)} points. Consider reaching out for support.`
        })
    } else {
        insights.push({
            icon: <Minus className="insight-icon neutral" />,
            text: 'Your mood has been stable this week.'
        })
    }

    if (topTag && topTag[1] > 2) {
        insights.push({
            icon: '🏷️',
            text: `Most common tag: "${topTag[0]}" (${topTag[1]} times)`
        })
    }

    if (avgSleep > 0) {
        if (avgSleep < 6) {
            insights.push({
                icon: '😴',
                text: `You averaged ${avgSleep.toFixed(1)}h sleep. Consider getting more rest.`
            })
        } else if (avgSleep > 8) {
            insights.push({
                icon: '✨',
                text: `Great sleep! You averaged ${avgSleep.toFixed(1)}h this week.`
            })
        }
    }

    return (
        <div className="insights-panel">
            <h3>Insights</h3>
            <div className="insights-list">
                {insights.map((insight, i) => (
                    <div key={i} className="insight-item">
                        <span className="insight-icon-wrapper">{insight.icon}</span>
                        <span className="insight-text">{insight.text}</span>
                    </div>
                ))}
            </div>
        </div>
    )
}
