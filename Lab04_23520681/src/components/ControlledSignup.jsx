import { useState } from 'react'

export function ControlledSignup() {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })

  const handleChange = (event) => {
    const { name, value } = event.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    console.log('Form data:', formData)
    alert(`Email: ${formData.email}, Password: ${formData.password}`)
  }

  return (
    <div style={{ padding: '20px' }}>
      <h2>Controlled Signup Form</h2>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '10px' }}>
          <label>
            Email:
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              style={{ marginLeft: '10px', padding: '5px' }}
            />
          </label>
        </div>
        <div style={{ marginBottom: '10px' }}>
          <label>
            Password:
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              style={{ marginLeft: '10px', padding: '5px' }}
            />
          </label>
        </div>
        <button type="submit" style={{ padding: '5px 15px' }}>
          Sign Up
        </button>
      </form>
    </div>
  )
}

