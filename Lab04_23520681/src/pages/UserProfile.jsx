import { useParams } from 'react-router-dom'

export function UserProfile() {
  const { userId } = useParams()

  return (
    <div style={{ padding: '20px' }}>
      <h1>User Profile</h1>
      <p>Viewing profile for user ID: {userId}</p>
    </div>
  )
}

