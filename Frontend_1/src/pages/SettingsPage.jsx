import Card from '../components/ui/Card.jsx'
import { Download, Trash2 } from 'lucide-react'

export default function SettingsPage() {
    const handleExport = () => {
        const data = {
            moods: JSON.parse(localStorage.getItem('moods') || '[]'),
            journals: JSON.parse(localStorage.getItem('journals') || '[]'),
            habits: JSON.parse(localStorage.getItem('habits') || '[]'),
            exercises: JSON.parse(localStorage.getItem('exercises') || '[]')
        }

        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `mindcare-data-${new Date().toISOString().split('T')[0]}.json`
        a.click()
        URL.revokeObjectURL(url)
    }

    const handleClear = () => {
        if (window.confirm('Are you sure you want to delete ALL data? This cannot be undone.')) {
            localStorage.clear()
            window.location.reload()
        }
    }

    return (
        <div className="page">
            <header className="page-header">
                <h1>Settings</h1>
                <p className="subtitle">Manage your data and preferences</p>
            </header>

            <Card title="Data Management">
                <div className="settings-section">
                    <div className="setting-item">
                        <div>
                            <h4>Export Your Data</h4>
                            <p className="text-muted">Download all your data as JSON</p>
                        </div>
                        <button onClick={handleExport} className="btn btn-secondary">
                            <Download size={16} /> Export
                        </button>
                    </div>

                    <div className="setting-item">
                        <div>
                            <h4>Clear All Data</h4>
                            <p className="text-muted">Delete all moods, journals, and habits</p>
                        </div>
                        <button onClick={handleClear} className="btn btn-danger">
                            <Trash2 size={16} /> Clear Data
                        </button>
                    </div>
                </div>
            </Card>

            <Card title="Privacy">
                <p>🔒 All your data is stored locally on your device</p>
                <p>🚫 No data is sent to external servers</p>
                <p>👤 Your information remains completely private</p>
            </Card>

            <Card title="About">
                <p><strong>MindCare</strong> - Mental Health Support App</p>
                <p className="text-muted">Version 1.0.0</p>
                <p className="text-muted">Built with React, Recharts, and Lucide Icons</p>
            </Card>
        </div>
    )
}
