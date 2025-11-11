import { useApp } from '../../context/AppContext.jsx'

export default function MoodHistory({ limit = 10 }) {
    const { moods } = useApp()

    const recentMoods = moods
        .slice(-limit)
        .reverse()

    if (recentMoods.length === 0) {
        return <div className="empty-state">No mood entries yet</div>
    }

    const getMoodEmoji = (score) => {
        if (score >= 9) return '😄'
        if (score >= 7) return '🙂'
        if (score >= 5) return '😐'
        if (score >= 3) return '😔'
        return '😢'
    }

    return (
        <div className="mood-history">
            {recentMoods.map(mood => (
                <div key={mood.id} className="mood-history-item">
                    <div className="mood-info">
                        <span className="mood-emoji-lg">{getMoodEmoji(mood.score)}</span>
                        <div>
                            <div className="mood-score">Score: {mood.score}/10</div>
                            <div className="mood-date">
                                {new Date(mood.date).toLocaleDateString('en-US', {
                                    month: 'short',
                                    day: 'numeric',
                                    hour: '2-digit',
                                    minute: '2-digit'
                                })}
                            </div>
                        </div>
                    </div>
                    {mood.note && <div className="mood-note">{mood.note}</div>}
                    {mood.tags.length > 0 && (
                        <div className="mood-tags">
                            {mood.tags.map(tag => (
                                <span key={tag} className="tag-small">{tag}</span>
                            ))}
                        </div>
                    )}
                </div>
            ))}
        </div>
    )
}
