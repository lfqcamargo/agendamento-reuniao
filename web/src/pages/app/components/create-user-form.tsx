import { zodResolver } from '@hookform/resolvers/zod'
import { RefetchOptions, useMutation } from '@tanstack/react-query'
import axios from 'axios'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import * as z from 'zod'

import { createUser } from '@/api/create-user'
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

interface CreateUserFormProps {
  refetch: (options?: RefetchOptions) => Promise<any>
}

const createUserFormSchema = z
  .object({
    email: z.string().email({
      message: 'Email inválido.',
    }),
    userName: z
      .string()
      .min(4, { message: 'Usuário deve conter pelo menos 4 caracters' })
      .max(50, { message: 'Usuário deve conter no máximo 40 caracters.' }),
    nickname: z
      .string()
      .min(4, {
        message: 'Nome da empresa deve conter pelo menos 4 caracters.',
      })
      .max(20, {
        message: 'Nome de usuário deve ter no máximo 20 caracters.',
      }),
    password: z
      .string()
      .min(6, { message: 'Senha deve conter no mínimo 6 caracters' })
      .max(20, {
        message: 'Senha deve conter no máximo 20 caracters',
      }),
    repeatPassword: z
      .string()
      .min(6, { message: 'Senha deve conter no mínimo 6 caracteres.' })
      .max(20, { message: 'Senha deve conter no máximo 20 caracteres.' }),
    role: z.string().min(1).max(2).transform(Number),
  })
  .refine((data) => data.password === data.repeatPassword, {
    message: 'As senhas devem ser iguais.',
    path: ['repeatPassword'],
  })

export type CreateUserForm = z.infer<typeof createUserFormSchema>

const fields = [
  'email',
  'userName',
  'nickname',
  'password',
  'repeatPassword',
  'role',
]

export function CreateUserForm({ refetch }: CreateUserFormProps) {
  const [isDialogOpen, setDialogOpen] = useState(false)

  const createUserFn = useMutation({
    mutationFn: createUser,
  })

  const {
    register,
    handleSubmit,
    watch,
    control,
    reset,
    formState: { errors },
  } = useForm<CreateUserForm>({
    resolver: zodResolver(createUserFormSchema),
    mode: 'onChange',
  })

  const emailWatch = watch('email')
  const userNameWatch = watch('userName')
  const nicknameWatch = watch('nickname')
  const passwordWatch = watch('password')
  const repeatPasswordWatch = watch('repeatPassword')
  const roleWatch = watch('role')

  const isButtonActived = !!(
    emailWatch &&
    userNameWatch &&
    nicknameWatch &&
    passwordWatch &&
    repeatPasswordWatch &&
    roleWatch
  )

  async function handleCreateUser(data: CreateUserForm) {
    try {
      await createUserFn.mutateAsync({
        email: data.email,
        name: data.userName,
        nickname: data.nickname,
        password: data.password,
        role: data.role,
      })

      refetch()
      reset()
      toast.success('Cadastro Realizado.')

      setDialogOpen(false)
    } catch (error) {
      if (axios.isAxiosError(error)) {
        ToastError({ error })
      } else {
        toast.error('Ocorreu um erro inesperado.')
      }
    }
  }

  return (
    <>
      <Dialog open={isDialogOpen} onOpenChange={setDialogOpen}>
        <DialogTrigger asChild>
          <Button> + </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Criar Usuário</DialogTitle>
            <DialogDescription>Preencha os campos abaixo</DialogDescription>
          </DialogHeader>
          <form
            onSubmit={handleSubmit(handleCreateUser)}
            className="flex flex-col items-center py-6 px-4"
          >
            <GenericForm
              fields={fields}
              register={register}
              errors={errors}
              control={control}
            />
            <DialogFooter className="pt-4 w-full">
              <Button disabled={!isButtonActived}>Cadastrar</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  )
}
