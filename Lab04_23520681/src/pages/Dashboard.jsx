import { Link } from 'react-router-dom'
import { useFetch } from '../hooks/useFetch'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'

export function Dashboard() {
  const { data, loading, error } = useFetch('https://jsonplaceholder.typicode.com/posts')
  const { logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  if (loading) {
    return (
      <div style={{ padding: '20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h1>Dashboard</h1>
          <button onClick={handleLogout} style={{ padding: '5px 15px' }}>
            Logout
          </button>
        </div>
        <p>Loading posts...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div style={{ padding: '20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h1>Dashboard</h1>
          <button onClick={handleLogout} style={{ padding: '5px 15px' }}>
            Logout
          </button>
        </div>
        <p style={{ color: 'red' }}>Error: {error}</p>
      </div>
    )
  }

  return (
    <div style={{ padding: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h1>Dashboard</h1>
        <button onClick={handleLogout} style={{ padding: '5px 15px' }}>
          Logout
        </button>
      </div>
      <h2>Posts</h2>
      {data && Array.isArray(data) && (
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {data.slice(0, 10).map(post => (
            <li key={post.id} style={{ marginBottom: '15px', padding: '15px', border: '1px solid #ccc', borderRadius: '4px' }}>
              <h3 style={{ marginBottom: '10px' }}>{post.title}</h3>
              <p style={{ marginBottom: '10px', color: '#666' }}>{post.body.substring(0, 100)}...</p>
              <Link 
                to={`/dashboard/post/${post.id}`}
                style={{ color: 'blue', textDecoration: 'underline' }}
              >
                Read more
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

