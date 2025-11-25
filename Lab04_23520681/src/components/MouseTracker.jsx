import { useEffect, useState } from 'react'

export function MouseTracker() {
  const [position, setPosition] = useState({ x: 0, y: 0 })

  useEffect(() => {
    const handleMouseMove = (event) => {
      setPosition({ x: event.clientX, y: event.clientY })
      console.log(`Mouse position: x=${event.clientX}, y=${event.clientY}`)
    }

    window.addEventListener('mousemove', handleMouseMove)

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
    }
  }, [])

  return (
    <div style={{ padding: '20px' }}>
      <h2>Mouse Tracker</h2>
      <p>Move your mouse around to see the position update.</p>
      <p>X: {position.x}, Y: {position.y}</p>
    </div>
  )
}

