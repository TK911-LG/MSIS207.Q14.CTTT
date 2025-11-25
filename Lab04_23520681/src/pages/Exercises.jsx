import { MouseTracker } from '../components/MouseTracker'
import { UncontrolledLogin } from '../components/UncontrolledLogin'
import { PostFetcher } from '../components/PostFetcher'
import { ControlledSignup } from '../components/ControlledSignup'
import { ThemeButton } from '../components/ThemeButton'
import { PersistentCounter } from '../components/PersistentCounter'

export function Exercises() {
  return (
    <div style={{ padding: '20px' }}>
      <h1>Lab 4 Exercises</h1>
      <div style={{ marginTop: '30px' }}>
        <MouseTracker />
      </div>
      <div style={{ marginTop: '30px', borderTop: '1px solid #ccc', paddingTop: '20px' }}>
        <UncontrolledLogin />
      </div>
      <div style={{ marginTop: '30px', borderTop: '1px solid #ccc', paddingTop: '20px' }}>
        <PostFetcher />
      </div>
      <div style={{ marginTop: '30px', borderTop: '1px solid #ccc', paddingTop: '20px' }}>
        <ControlledSignup />
      </div>
      <div style={{ marginTop: '30px', borderTop: '1px solid #ccc', paddingTop: '20px' }}>
        <ThemeButton />
      </div>
      <div style={{ marginTop: '30px', borderTop: '1px solid #ccc', paddingTop: '20px' }}>
        <PersistentCounter />
      </div>
    </div>
  )
}

