import { createBrowserRouter } from 'react-router-dom'
import { Layout } from '../components/Layout'
import { Home } from '../pages/Home'
import { About } from '../pages/About'
import { UserProfile } from '../pages/UserProfile'
import { Exercises } from '../pages/Exercises'
import { Login } from '../pages/Login'
import { Dashboard } from '../pages/Dashboard'
import { PostDetail } from '../pages/PostDetail'
import { ProtectedRoute } from '../components/ProtectedRoute'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Login />
  },
  {
    element: <Layout />,
    children: [
      {
        path: 'home',
        element: <Home />
      },
      {
        path: 'about',
        element: <About />
      },
      {
        path: 'users/:userId',
        element: <UserProfile />
      },
      {
        path: 'exercises',
        element: <Exercises />
      },
      {
        element: <ProtectedRoute />,
        children: [
          {
            path: 'dashboard',
            element: <Dashboard />
          },
          {
            path: 'dashboard/post/:postId',
            element: <PostDetail />
          }
        ]
      }
    ]
  }
])

