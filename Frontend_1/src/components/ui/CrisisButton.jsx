import { Phone } from 'lucide-react'

export default function CrisisButton() {
    return (
        <a
            href="tel:0932636402"
            className="crisis-button"
            aria-label="Crisis hotline - Call 0932636402"
            title="Need help? Call 0932636402"
        >
            <Phone size={24} />
        </a>
    )
}
