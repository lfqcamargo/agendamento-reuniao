import { useQuery } from '@tanstack/react-query'

import { fetchroomsByCompanyId } from '@/api/fetch-rooms-by-company-id'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

export function Rooms() {
  const { data: rooms, refetch } = useQuery({
    queryKey: ['rooms'],
    queryFn: () => fetchroomsByCompanyId(),
    staleTime: Infinity,
  })

  return (
    <>
      <>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Ativo</TableHead>
              <TableHead className="flex justify-end"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rooms?.rooms.map((user) => (
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
    </>
  )
}
