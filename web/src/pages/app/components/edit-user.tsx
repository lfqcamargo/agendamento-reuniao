import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import axios from 'axios'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import * as z from 'zod'

import { deleteUser } from '@/api/delete-user'
import { editUser } from '@/api/edit-user'
import { GenericForm } from '@/components/generic-form'
import { ToastError } from '@/components/toast-error'
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

interface PropsEditUser {
  id: string
  userName: string
  nickname: string
  role: number
  active: boolean
  refetch: any
}

const EditUserFormSchema = z
  .object({
    userName: z
      .string()
      .max(50, { message: 'Usuário deve conter no máximo 40 caracters.' })
      .optional(),
    nickname: z
      .string()
      .max(20, {
        message: 'Nome de usuário deve ter no máximo 20 caracters.',
      })
      .optional(),
    password: z
      .string()
      .max(20, {
        message: 'Senha deve conter no máximo 20 caracters',
      })
      .optional(),
    repeatPassword: z
      .string()
      .max(20, { message: 'Senha deve conter no máximo 20 caracteres.' })
      .optional(),
    role: z.string().max(2).transform(Number).optional(),
    active: z.boolean().optional(),
  })
  .refine(
    (data) => {
      if (data.password !== null && data.repeatPassword !== null) {
        return data.password === data.repeatPassword
      }
      return true
    },
    {
      message: 'As senhas devem ser iguais.',
      path: ['repeatPassword'],
    },
  )

export type EditUserForm = z.infer<typeof EditUserFormSchema>

const fields = [
  'userName',
  'nickname',
  'password',
  'repeatPassword',
  'role',
  'active',
]

export function EditUser({
  id,
  userName,
  nickname,
  role,
  active,
  refetch,
}: PropsEditUser) {
  const [isDialogOpen, setDialogOpen] = useState(false)

  const editUserFn = useMutation({
    mutationFn: editUser,
  })

  const { mutateAsync: deleteUserFn, isPending: isPendingUser } = useMutation({
    mutationFn: deleteUser,
  })

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<EditUserForm>({
    resolver: zodResolver(EditUserFormSchema),
    mode: 'onChange',
    defaultValues: { userName, nickname, role, active },
  })

  async function handleEditUser(data: EditUserForm) {
    try {
      await editUserFn.mutateAsync({
        id,
        name: data.userName,
        nickname: data.nickname,
        password: data.password,
        role: data.role,
        active: data.active,
      })

      toast.success('Edição Realizada.')
      refetch()
      setDialogOpen(false)
    } catch (error) {
      if (axios.isAxiosError(error)) {
        ToastError({ error })
      } else {
        toast.error('Ocorreu um erro inesperado.')
      }
    }
  }

  async function handleDeleteUser() {
    try {
      const result = await deleteUserFn({ id })
      refetch()
      setDialogOpen(false)
      console.log(result)
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.log(error)
        ToastError({ error })
      } else {
        toast.error('Ocorreu um erro inesperado.')
      }
    }
  }

  return (
    <Dialog open={isDialogOpen} onOpenChange={setDialogOpen}>
      <DialogTrigger asChild>
        <Button> Editar </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Editar</DialogTitle>
          <DialogDescription>Edição do Usuário {userName}</DialogDescription>
        </DialogHeader>
        <form
          onSubmit={handleSubmit(handleEditUser)}
          className="flex flex-col items-center py-6 px-4"
        >
          <div className="flex flex-col items-center gap-4 w-full">
            <GenericForm
              fields={fields}
              register={register}
              errors={errors}
              control={control}
            />
            <DialogFooter className="w-full flex flex-row flex-1 gap-2">
              <Button
                className="w-full"
                disabled={isSubmitting || isPendingUser}
              >
                Editar
              </Button>
              <Button
                type="button"
                className="w-full"
                variant={'destructive'}
                onClick={handleDeleteUser}
                disabled={isPendingUser}
              >
                Excluir
              </Button>
            </DialogFooter>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
