import { useApp } from '../../context/AppContext.jsx'

export default function JournalList({ limit = 10 }) {
    const { journals } = useApp()

    const recentJournals = journals
        .slice(-limit)
        .reverse()

    if (recentJournals.length === 0) {
        return (
            <div className="empty-state">
                <p>📖 No journal entries yet</p>
                <p className="text-muted">Start writing to track your thoughts and feelings</p>
            </div>
        )
    }

    return (
        <div className="journal-list">
            {recentJournals.map(entry => (
                <div key={entry.id} className="journal-entry">
                    <div className="journal-header">
                        <div className="journal-date">
                            {new Date(entry.date).toLocaleDateString('en-US', {
                                weekday: 'short',
                                month: 'short',
                                day: 'numeric',
                                year: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                            })}
                        </div>
                    </div>
                    {entry.prompt && (
                        <div className="journal-prompt">Prompt: {entry.prompt}</div>
                    )}
                    <div className="journal-content">{entry.content}</div>
                </div>
            ))}
        </div>
    )
}
