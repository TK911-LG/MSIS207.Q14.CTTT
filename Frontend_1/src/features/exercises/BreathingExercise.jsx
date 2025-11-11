import { useState, useEffect } from 'react'
import { useApp } from '../../context/AppContext.jsx'
import { Play, Pause, RotateCcw } from 'lucide-react'

export default function BreathingExercise() {
    const { logExercise } = useApp()
    const [isActive, setIsActive] = useState(false)
    const [phase, setPhase] = useState('Breathe In') // Breathe In, Hold, Breathe Out, Hold
    const [seconds, setSeconds] = useState(0)
    const [cycleCount, setCycleCount] = useState(0)

    const CYCLE = [
        { phase: 'Breathe In', duration: 4 },
        { phase: 'Hold', duration: 4 },
        { phase: 'Breathe Out', duration: 4 },
        { phase: 'Hold', duration: 4 }
    ]

    useEffect(() => {
        if (!isActive) return

        const interval = setInterval(() => {
            setSeconds(prev => {
                const currentPhaseIndex = CYCLE.findIndex(c => c.phase === phase)
                const currentDuration = CYCLE[currentPhaseIndex].duration

                if (prev + 1 >= currentDuration) {
                    const nextIndex = (currentPhaseIndex + 1) % CYCLE.length
                    setPhase(CYCLE[nextIndex].phase)

                    if (nextIndex === 0) {
                        setCycleCount(c => c + 1)
                    }

                    return 0
                }
                return prev + 1
            })
        }, 1000)

        return () => clearInterval(interval)
    }, [isActive, phase])

    const toggle = () => {
        setIsActive(!isActive)
        if (!isActive && cycleCount === 0) {
            // Starting fresh
            setPhase('Breathe In')
            setSeconds(0)
        }
    }

    const reset = () => {
        setIsActive(false)
        setPhase('Breathe In')
        setSeconds(0)
        if (cycleCount > 0) {
            logExercise('Box Breathing', cycleCount * 16) // 16 seconds per cycle
            alert(`Great job! You completed ${cycleCount} breathing cycles ✓`)
        }
        setCycleCount(0)
    }

    return (
        <div className="breathing-exercise">
            <div className="breathing-circle-container">
                <div className={`breathing-circle ${isActive ? 'active' : ''} ${phase.toLowerCase().replace(' ', '-')}`}>
                    <div className="breathing-text">
                        <div className="phase-name">{phase}</div>
                        <div className="phase-count">{CYCLE.find(c => c.phase === phase).duration - seconds}s</div>
                    </div>
                </div>
            </div>

            <div className="breathing-info">
                <p className="text-muted">Box Breathing • 4-4-4-4 pattern</p>
                <p className="cycle-count">Cycles: {cycleCount}</p>
            </div>

            <div className="breathing-controls">
                <button onClick={toggle} className="btn btn-primary btn-lg">
                    {isActive ? <><Pause size={20} /> Pause</> : <><Play size={20} /> Start</>}
                </button>
                <button onClick={reset} className="btn btn-secondary">
                    <RotateCcw size={20} /> Reset
                </button>
            </div>

            <div className="breathing-guide">
                <h4>How to do Box Breathing:</h4>
                <ol>
                    <li>Breathe in through your nose for 4 seconds</li>
                    <li>Hold your breath for 4 seconds</li>
                    <li>Breathe out through your mouth for 4 seconds</li>
                    <li>Hold your breath for 4 seconds</li>
                    <li>Repeat the cycle</li>
                </ol>
            </div>
        </div>
    )
}
