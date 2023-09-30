import { LoginPage, RegisterPage, DashboardPage, NotFoundPage } from './pages'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { UserProfileProvider } from './context/UserProfileContext'
import './App.css'

function App() {

  const router = createBrowserRouter([
    {
      path: '/',
      element: <LoginPage onSubmit={function (): void {
        throw new Error('Function not implemented.')
      } } />
    },
    {
      path: '/register',
      element: <RegisterPage />
    },
    {
      path: '/dashboard',
      element: <DashboardPage />
    },
    {
      path: '*',
      element: <NotFoundPage />
    }
  ])

  return (
    <>
      <UserProfileProvider>
        <RouterProvider router={router} />
      </UserProfileProvider>
    </>
  )
}

export default App
