import { useParams } from 'react-router-dom'
import { useFetch } from '../hooks/useFetch'

export function PostDetail() {
  const { postId } = useParams()
  const { data, loading, error } = useFetch(`https://jsonplaceholder.typicode.com/posts/${postId}`)

  if (loading) {
    return (
      <div style={{ padding: '20px' }}>
        <h1>Post Detail</h1>
        <p>Loading post...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div style={{ padding: '20px' }}>
        <h1>Post Detail</h1>
        <p style={{ color: 'red' }}>Error: {error}</p>
      </div>
    )
  }

  return (
    <div style={{ padding: '20px' }}>
      <h1>Post Detail</h1>
      {data && (
        <div style={{ marginTop: '20px' }}>
          <h2>{data.title}</h2>
          <p style={{ marginTop: '15px', lineHeight: '1.6' }}>{data.body}</p>
          <p style={{ marginTop: '15px', color: '#666', fontSize: '14px' }}>
            Post ID: {data.id}
          </p>
        </div>
      )}
    </div>
  )
}

