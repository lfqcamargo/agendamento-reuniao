import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import * as z from 'zod'

import { ErrorField } from './error-field'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Label } from './ui/label'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select'

const createUserFormSchema = z
  .object({
    email: z.string().email({
      message: 'Email inválido.',
    }),
    name: z
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

interface CreateUserFormProps {
  onSubmit: (data: CreateUserForm) => void
  isSubmitting: boolean
}

export function CreateUserForm({
  onSubmit,
  isSubmitting,
}: CreateUserFormProps) {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<CreateUserForm>({
    resolver: zodResolver(createUserFormSchema),
    mode: 'onChange',
    defaultValues: { role: 1 },
  })

  const emailWatch = watch('email')
  const nameWatch = watch('name')
  const nicknameWatch = watch('nickname')
  const passwordWatch = watch('password')
  const repeatPasswordWatch = watch('repeatPassword')

  const isButtonActived = !!(
    emailWatch &&
    nameWatch &&
    nicknameWatch &&
    passwordWatch &&
    repeatPasswordWatch
  )

  return (
    <>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col items-center py-6 px-4"
      >
        <div className="flex flex-col items-center gap-4 w-full">
          <div className="flex flex-col w-full">
            <Label className="p-2" htmlFor="email">
              Email
            </Label>
            <Input
              id="email"
              placeholder="Digite seu email..."
              {...register('email')}
            />
            <ErrorField error={errors.email} />
          </div>

          <div className="flex flex-col w-full">
            <Label className="p-2" htmlFor="name">
              Nome Completo do Usuário
            </Label>
            <Input
              id="name"
              placeholder="Digite o nome copleto..."
              {...register('name')}
            />
            <ErrorField error={errors.name} />
          </div>

          <div className="flex flex-col w-full">
            <Label className="p-2" htmlFor="nickname">
              Nome de usuário
            </Label>
            <Input
              id="nickname"
              placeholder="Digite um apelido..."
              {...register('nickname')}
            />
            <ErrorField error={errors.nickname} />
          </div>

          <div className="flex flex-col w-full">
            <Label className="p-2" htmlFor="password">
              Senha
            </Label>
            <Input
              id="password"
              type="password"
              placeholder="Digite uma senha..."
              {...register('password')}
            />
            <ErrorField error={errors.password} />
          </div>

          <div className="flex flex-col w-full">
            <Label className="p-2" htmlFor="repeatPassword">
              Repita a Senha
            </Label>
            <Input
              id="repeatPassword"
              type="password"
              placeholder="Repita a senha..."
              {...register('repeatPassword')}
            />
            <ErrorField error={errors.repeatPassword} />
          </div>

          <div className="flex flex-col w-full">
            <Label>Tipo de Usuário</Label>
            <Select>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Admin" {...register('role')} />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="1">Admin</SelectItem>
                  <SelectItem value="2">Usuário</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-col w-full pt-2 ">
            <Button disabled={isSubmitting || !isButtonActived}>
              Cadastrar
            </Button>
          </div>
        </div>
      </form>
    </>
  )
}
