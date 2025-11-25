import { useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export function Login() {
  const usernameRef = useRef(null)
  const navigate = useNavigate()
  const { login } = useAuth()

  useEffect(() => {
    if (usernameRef.current) {
      usernameRef.current.focus()
    }
  }, [])

  const handleLogin = (event) => {
    event.preventDefault()
    login()
    navigate('/dashboard')
  }

  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      minHeight: '100vh',
      flexDirection: 'column'
    }}>
      <div style={{ 
        padding: '40px', 
        border: '1px solid #ccc', 
        borderRadius: '8px',
        maxWidth: '400px',
        width: '100%'
      }}>
        <h1>BlogDash Login</h1>
        <form onSubmit={handleLogin} style={{ marginTop: '20px' }}>
          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px' }}>
              Username:
            </label>
            <input
              type="text"
              ref={usernameRef}
              style={{ 
                width: '100%', 
                padding: '8px', 
                fontSize: '16px',
                border: '1px solid #ccc',
                borderRadius: '4px'
              }}
            />
          </div>
          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px' }}>
              Password:
            </label>
            <input
              type="password"
              style={{ 
                width: '100%', 
                padding: '8px', 
                fontSize: '16px',
                border: '1px solid #ccc',
                borderRadius: '4px'
              }}
            />
          </div>
          <button
            type="submit"
            style={{ 
              width: '100%', 
              padding: '10px', 
              fontSize: '16px',
              backgroundColor: '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Log In
          </button>
        </form>
      </div>
    </div>
  )
}

