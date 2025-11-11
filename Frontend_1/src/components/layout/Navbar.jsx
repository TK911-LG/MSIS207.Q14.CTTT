import { Link, useLocation } from 'react-router-dom'
import { Heart, Home, BookOpen, Activity, TrendingUp, Target, BookMarked, Settings } from 'lucide-react'

export default function Navbar() {
    const { pathname } = useLocation()

    const NavItem = ({ to, icon: Icon, label }) => {
        const isActive = pathname === to
        return (
            <Link
                to={to}
                className={`nav-item ${isActive ? 'active' : ''}`}
                aria-current={isActive ? 'page' : undefined}
            >
                <Icon size={20} />
                <span className="nav-label">{label}</span>
            </Link>
        )
    }

    return (
        <nav className="navbar">
            <div className="nav-container">
                <div className="brand">
                    <Heart className="brand-icon" />
                    <span className="brand-text">MindCare</span>
                </div>
                <div className="nav-links">
                    <NavItem to="/" icon={Home} label="Home" />
                    <NavItem to="/mood" icon={Heart} label="Mood" />
                    <NavItem to="/journal" icon={BookOpen} label="Journal" />
                    <NavItem to="/exercises" icon={Activity} label="Exercises" />
                    <NavItem to="/analytics" icon={TrendingUp} label="Analytics" />
                    <NavItem to="/habits" icon={Target} label="Habits" />
                    <NavItem to="/resources" icon={BookMarked} label="Resources" />
                    <NavItem to="/settings" icon={Settings} label="Settings" />
                </div>
            </div>
        </nav>
    )
}
