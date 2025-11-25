import { useTheme } from '../context/ThemeContext'

export function ThemeButton() {
  const { theme, toggleTheme } = useTheme()

  const buttonStyle = {
    padding: '10px 20px',
    fontSize: '16px',
    cursor: 'pointer',
    backgroundColor: theme === 'light' ? '#f0f0f0' : '#333',
    color: theme === 'light' ? '#000' : '#fff',
    border: theme === 'light' ? '1px solid #ccc' : '1px solid #666',
    borderRadius: '4px'
  }

  return (
    <div style={{ padding: '20px' }}>
      <h2>Theme Context Example</h2>
      <p>Current theme: {theme}</p>
      <button onClick={toggleTheme} style={buttonStyle}>
        Toggle Theme
      </button>
    </div>
  )
}

