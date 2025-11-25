import { Link } from 'react-router-dom'

export function Home() {
  return (
    <div style={{ padding: '20px' }}>
      <h1>Home Page</h1>
      <p>Welcome to the Home page!</p>
      <Link to="/about" style={{ color: 'blue', textDecoration: 'underline' }}>
        Go to About
      </Link>
    </div>
  )
}

