import Card from '../components/ui/Card.jsx'
import { ExternalLink } from 'lucide-react'

export default function ResourcesPage() {
    const resources = [
        {
            title: 'National Suicide Prevention Lifeline',
            description: '24/7 free and confidential support',
            link: 'tel:988',
            linkText: 'Call 988'
        },
        {
            title: 'Crisis Text Line',
            description: 'Text HOME to 741741',
            link: 'sms:741741',
            linkText: 'Text Now'
        },
        {
            title: 'SAMHSA National Helpline',
            description: 'Substance abuse and mental health services',
            link: 'tel:1-800-662-4357',
            linkText: '1-800-662-HELP'
        }
    ]

    const articles = [
        'Understanding Anxiety and Depression',
        'Benefits of Mindfulness Meditation',
        'Sleep Hygiene Tips for Better Mental Health',
        'Building Resilience in Difficult Times',
        'The Science of Gratitude'
    ]

    return (
        <div className="page">
            <header className="page-header">
                <h1>Resources</h1>
                <p className="subtitle">Helpful information and support</p>
            </header>

            <Card title="🆘 Crisis Support">
                <div className="resources-list">
                    {resources.map((resource, i) => (
                        <div key={i} className="resource-item">
                            <div>
                                <h4>{resource.title}</h4>
                                <p className="text-muted">{resource.description}</p>
                            </div>
                            <a href={resource.link} className="btn btn-primary btn-sm">
                                {resource.linkText} <ExternalLink size={14} />
                            </a>
                        </div>
                    ))}
                </div>
            </Card>

            <Card title="📚 Educational Articles">
                <div className="articles-list">
                    {articles.map((article, i) => (
                        <div key={i} className="article-item">
                            <span className="article-icon">📄</span>
                            <span>{article}</span>
                        </div>
                    ))}
                    <p className="text-muted" style={{ marginTop: '16px' }}>
                        More articles coming soon!
                    </p>
                </div>
            </Card>
        </div>
    )
}
