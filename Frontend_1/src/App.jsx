import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AppProvider } from './context/AppContext.jsx'
import Navbar from './components/layout/Navbar.jsx'
import HomePage from './pages/HomePage.jsx'
import MoodPage from './pages/MoodPage.jsx'
import JournalPage from './pages/JournalPage.jsx'
import ExercisesPage from './pages/ExercisesPage.jsx'
import AnalyticsPage from './pages/AnalyticsPage.jsx'
import HabitsPage from './pages/HabitsPage.jsx'
import ResourcesPage from './pages/ResourcesPage.jsx'
import SettingsPage from './pages/SettingsPage.jsx'
import CrisisButton from './components/ui/CrisisButton.jsx'

export default function App() {
    return (
        <AppProvider>
            <BrowserRouter>
                <div className="app-wrapper">
                    <Navbar />
                    <main className="main-content">
                        <Routes>
                            <Route path="/" element={<HomePage />} />
                            <Route path="/mood" element={<MoodPage />} />
                            <Route path="/journal" element={<JournalPage />} />
                            <Route path="/exercises" element={<ExercisesPage />} />
                            <Route path="/analytics" element={<AnalyticsPage />} />
                            <Route path="/habits" element={<HabitsPage />} />
                            <Route path="/resources" element={<ResourcesPage />} />
                            <Route path="/settings" element={<SettingsPage />} />
                        </Routes>
                    </main>
                    <CrisisButton />
                </div>
            </BrowserRouter>
        </AppProvider>
    )
}
