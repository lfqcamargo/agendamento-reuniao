import { Link, Outlet } from 'react-router-dom'

import { Card } from '@/components/ui/card'

export function SettingsLayout() {
  return (
    <>
      <div>
        <nav>
          <ul className="flex flex-col">
            <Link to={'/settings/rooms'}>Salas</Link>
            <Link to={'/settings/users'}>Usuários</Link>
            <Link to={'/settings/account'}>Conta</Link>
          </ul>
        </nav>
      </div>

      <Card className="flex flex-1">
        <Outlet />
      </Card>
    </>
  )
}
