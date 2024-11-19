import { Outlet } from 'react-router-dom'

export function AuthLayout() {
  return (
    <div className="flex flex-col justify-between min-h-screen max-h-screen">
      <header className="bg-primary">
        <h1 className="text-2xl text-white font-bold leading-tight">
          Sala de Reunião
        </h1>
      </header>
      <main>
        <Outlet />
      </main>
      <footer className="bg-primary">
        <span className="text-xs text-gray-400 py-4 text-center block">
          lfqcamargo@gmail.com
        </span>
      </footer>
    </div>
  )
}
