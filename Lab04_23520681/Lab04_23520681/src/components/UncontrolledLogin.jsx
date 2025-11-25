import { useRef } from 'react'

export function UncontrolledLogin() {
  const usernameRef = useRef(null)

  const handleSubmit = (event) => {
    event.preventDefault()
    const username = usernameRef.current.value
    alert(`Username submitted: ${username}`)
    console.log('Username from ref:', username)
  }

  return (
    <div style={{ padding: '20px' }}>
      <h2>Uncontrolled Login Form</h2>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '10px' }}>
          <label>
            Username:
            <input
              type="text"
              ref={usernameRef}
              style={{ marginLeft: '10px', padding: '5px' }}
            />
          </label>
        </div>
        <button type="submit" style={{ padding: '5px 15px' }}>
          Submit
        </button>
      </form>
    </div>
  )
}

