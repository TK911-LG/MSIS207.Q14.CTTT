import { useLocalStorage } from '../hooks/useLocalStorage'

export function PersistentCounter() {
  const [count, setCount] = useLocalStorage('myCounter', 0)

  return (
    <div style={{ padding: '20px' }}>
      <h2>Persistent Counter</h2>
      <p>Count: {count}</p>
      <div style={{ marginTop: '10px' }}>
        <button
          onClick={() => setCount(count + 1)}
          style={{ marginRight: '10px', padding: '5px 15px' }}
        >
          Increment
        </button>
        <button
          onClick={() => setCount(count - 1)}
          style={{ marginRight: '10px', padding: '5px 15px' }}
        >
          Decrement
        </button>
        <button
          onClick={() => setCount(0)}
          style={{ padding: '5px 15px' }}
        >
          Reset
        </button>
      </div>
      <p style={{ marginTop: '10px', fontSize: '14px', color: '#666' }}>
        The count persists across page refreshes!
      </p>
    </div>
  )
}

