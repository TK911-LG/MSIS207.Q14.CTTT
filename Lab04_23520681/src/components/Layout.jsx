import { Outlet, Link } from 'react-router-dom'

export function Layout() {
  return (
    <div>
      <nav style={{ padding: '10px 20px', borderBottom: '1px solid #ccc' }}>
        <Link to="/" style={{ marginRight: '15px', textDecoration: 'none', color: 'blue' }}>
          Home
        </Link>
        <Link to="/about" style={{ marginRight: '15px', textDecoration: 'none', color: 'blue' }}>
          About
        </Link>
        <Link to="/users/1" style={{ marginRight: '15px', textDecoration: 'none', color: 'blue' }}>
          User 1
        </Link>
        <Link to="/users/2" style={{ marginRight: '15px', textDecoration: 'none', color: 'blue' }}>
          User 2
        </Link>
        <Link to="/exercises" style={{ marginRight: '15px', textDecoration: 'none', color: 'blue' }}>
          Exercises
        </Link>
        <Link to="/blog" style={{ textDecoration: 'none', color: 'blue' }}>
          BlogDash
        </Link>
      </nav>
      <Outlet />
    </div>
  )
}

