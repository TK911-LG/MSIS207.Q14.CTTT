import { useParams } from 'react-router-dom'

export function UserProfile() {
  const { userId } = useParams()

  return (
    <div style={{ padding: '20px' }}>
      <h1>Profile for User: {userId}</h1>
    </div>
  )
}

