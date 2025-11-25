import { useNavigate } from 'react-router-dom'

export function About() {
  const navigate = useNavigate()

  return (
    <div style={{ padding: '20px' }}>
      <h1>About Page</h1>
      <p>This is the About page.</p>
      <button
        onClick={() => navigate('/')}
        style={{ padding: '5px 15px', marginTop: '10px' }}
      >
        Go Back to Home
      </button>
    </div>
  )
}

