import { useMutation, useQuery } from '@tanstack/react-query'
import axios from 'axios'
import { useState } from 'react'
import { toast } from 'sonner'

import { createUser } from '@/api/create-user'
import { fetchUsersByCompanyId } from '@/api/fetch-users-by-company-id'
import { CreateUserForm } from '@/components/create-user-form'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

export function User() {
  const [isDialogOpen, setDialogOpen] = useState(false)

  const { data: users, refetch } = useQuery({
    queryKey: ['users'],
    queryFn: () => fetchUsersByCompanyId(),
    staleTime: Infinity,
  })

  const createUserFn = useMutation({
    mutationFn: createUser,
  })

  async function handleCreateUser(data: CreateUserForm) {
    try {
      await createUserFn.mutateAsync({
        email: data.email,
        name: data.name,
        nickname: data.nickname,
        password: data.password,
        role: data.role,
      })

      toast.success('Cadastro Realizado.')
      refetch()
      setDialogOpen(false)
    } catch (error) {
      console.log(error)
      if (axios.isAxiosError(error)) {
        const { response } = error
        if (response) {
          const { status, data } = response
          if (status === 409) {
            toast.error(data.message)
          } else {
            toast.error('Erro ao realizar cadastro.')
          }
        } else {
          toast.error('Erro ao realizar cadastro. Sem resposta do servidor.')
        }
      } else {
        toast.error('Ocorreu um erro inesperado.')
      }
    }
  }

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nome</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Ativo</TableHead>
            <TableHead className="flex justify-end">
              <Dialog open={isDialogOpen} onOpenChange={setDialogOpen}>
                <DialogTrigger asChild>
                  <Button> + </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>Criar Usuário</DialogTitle>
                    <DialogDescription>
                      Preencha os campos abaixo
                    </DialogDescription>
                  </DialogHeader>
                  <CreateUserForm
                    onSubmit={handleCreateUser}
                    isSubmitting={createUserFn.isPending}
                  />
                </DialogContent>
              </Dialog>
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
                <Dialog>
                  <DialogTrigger asChild>
                    <Button> Editar </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                      <DialogTitle>Escolha o horário</DialogTitle>
                      <DialogDescription></DialogDescription>
                    </DialogHeader>
                    <div className="w-2/3 m-auto">07:00</div>
                    <DialogFooter className="w-2/3 m-auto">
                      <Button>Escolher</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </>
  )
}
