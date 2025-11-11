import JournalEditor from '../features/journal/JournalEditor.jsx'
import JournalList from '../features/journal/JournalList.jsx'
import Card from '../components/ui/Card.jsx'

export default function JournalPage() {
    return (
        <div className="page">
            <header className="page-header">
                <h1>Journal</h1>
                <p className="subtitle">Express your thoughts and feelings</p>
            </header>

            <Card>
                <JournalEditor />
            </Card>

            <Card title="Previous Entries">
                <JournalList limit={10} />
            </Card>
        </div>
    )
}
