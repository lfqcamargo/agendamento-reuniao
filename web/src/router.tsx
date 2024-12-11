import { createBrowserRouter } from 'react-router-dom'

import { AppLayout } from './_layouts/app'
import { AuthLayout } from './_layouts/auth'
import { Home } from './pages/app/home'
import { Rooms } from './pages/app/rooms'
import { User } from './pages/app/user'
import { RecoveryPassword } from './pages/auth/recovery-password'
import { SignIn } from './pages/auth/sign-in'
import { SignUp } from './pages/auth/sign-up'
import { ProtectedRoute } from './utils/auth'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <ProtectedRoute />,
    children: [
      {
        path: '/',
        element: <AppLayout />,
        children: [
          {
            index: true,
            element: <Home />,
          },
          {
            path: 'users',
            element: <User />,
          },
          {
            path: 'rooms',
            element: <Rooms />,
          },
        ],
      },
    ],
  },
  {
    path: '/',
    element: <AuthLayout />,
    children: [
      { path: 'sign-in', element: <SignIn /> },
      { path: 'sign-up', element: <SignUp /> },
      { path: 'recovery-password', element: <RecoveryPassword /> },
    ],
  },
])
