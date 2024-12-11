import { useQuery } from '@tanstack/react-query'

import { fetchUsersByCompanyId } from '@/api/fetch-users-by-company-id'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { CreateUserForm } from '@/pages/app/components/create-user-form'

import { EditUser } from './components/edit-user'

export function User() {
  const { data: users, refetch } = useQuery({
    queryKey: ['users'],
    queryFn: () => fetchUsersByCompanyId(),
    staleTime: Infinity,
  })

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nome</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Ativo</TableHead>
            <TableHead className="flex justify-end">
              <CreateUserForm refetch={refetch} />
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users?.users.map((user) => (
            <TableRow key={user.id}>
              <TableCell>{user.name}</TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>{user.active ? 'Sim' : 'Não'}</TableCell>
              <TableCell>
                <EditUser
                  id={user.id}
                  userName={user.name}
                  nickname={user.nickname}
                  role={user.role}
                  active={user.active}
                  refetch={refetch}
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </>
  )
}
