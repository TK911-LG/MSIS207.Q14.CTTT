import { useEffect, useState } from 'react'

export function PostFetcher() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchPost = async () => {
      try {
        setLoading(true)
        setError(null)
        const response = await fetch('https://jsonplaceholder.typicode.com/posts/1')
        
        if (!response.ok) {
          throw new Error('Failed to fetch post')
        }
        
        const postData = await response.json()
        setData(postData)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchPost()
  }, [])

  if (loading) {
    return (
      <div style={{ padding: '20px' }}>
        <h2>Post Fetcher</h2>
        <p>Loading...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div style={{ padding: '20px' }}>
        <h2>Post Fetcher</h2>
        <p style={{ color: 'red' }}>Error: {error}</p>
      </div>
    )
  }

  return (
    <div style={{ padding: '20px' }}>
      <h2>Post Fetcher</h2>
      {data && (
        <div>
          <h3>{data.title}</h3>
          <p>{data.body}</p>
        </div>
      )}
    </div>
  )
}

