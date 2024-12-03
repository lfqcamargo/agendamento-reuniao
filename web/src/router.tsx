import { createBrowserRouter } from 'react-router-dom'

import { AppLayout } from './_layouts/app'
import { AuthLayout } from './_layouts/auth'
import { SettingsLayout } from './_layouts/settings'
import { Home } from './pages/app/home'
import { Account } from './pages/app/settings/account'
import { Rooms } from './pages/app/settings/rooms'
import { Users } from './pages/app/settings/users'
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
            path: 'settings',
            element: <SettingsLayout />,
            children: [
              {
                path: 'rooms',
                element: <Rooms />,
              },
              {
                path: 'users',
                element: <Users />,
              },
              {
                path: 'account',
                element: <Account />,
              },
            ],
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
