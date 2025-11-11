import { useState } from 'react'
import { useApp } from '../../context/AppContext.jsx'
import { RefreshCw } from 'lucide-react'

const PROMPTS = [
    'What made you smile today?',
    'What was one challenge and how did you handle it?',
    'Name three things you are grateful for.',
    'What is something you learned today?',
    'Describe a moment when you felt proud of yourself.',
    'What would you tell your younger self?',
    'What is one thing you want to improve tomorrow?',
    'Who made a positive impact on your day?'
]

export default function JournalEditor() {
    const { addJournal } = useApp()
    const [content, setContent] = useState('')
    const [promptIndex, setPromptIndex] = useState(0)

    const currentPrompt = PROMPTS[promptIndex]

    const nextPrompt = () => {
        setPromptIndex((promptIndex + 1) % PROMPTS.length)
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        if (!content.trim()) return
        addJournal(content.trim(), currentPrompt)
        setContent('')
        alert('Journal entry saved! ✓')
    }

    return (
        <form onSubmit={handleSubmit} className="journal-editor">
            <div className="prompt-section">
                <div className="prompt-text">{currentPrompt}</div>
                <button
                    type="button"
                    onClick={nextPrompt}
                    className="btn btn-ghost btn-sm"
                    aria-label="Get new prompt"
                >
                    <RefreshCw size={16} />
                    New prompt
                </button>
            </div>

            <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={8}
                placeholder="Write your thoughts here..."
                className="textarea journal-textarea"
                aria-label="Journal entry"
            />

            <div className="journal-footer">
                <small className="privacy-note">🔒 Your journal stays private on this device</small>
                <button type="submit" className="btn btn-primary" disabled={!content.trim()}>
                    Save Entry
                </button>
            </div>
        </form>
    )
}
