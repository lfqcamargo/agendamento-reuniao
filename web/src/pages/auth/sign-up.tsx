import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import * as z from 'zod'

import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

import { ErrorField } from './components/error-field'

const signupFormSchema = z.object({
  name: z
    .string()
    .min(4, { message: 'Nome da empresa deve conter pelo menos 4 caracters.' })
    .max(50, {
      message: 'Nome da empresa deve conter no máximo 50 caracters.',
    }),
  cnpj: z
    .string()
    .min(14, {
      message: 'CNPJ Inválido.',
    })
    .max(14, {
      message: 'CNPJ Inválido.',
    }),
  email: z.string().email({
    message: 'Email inválido.',
  }),
  user: z
    .string()
    .min(4, { message: 'Usuário deve conter pelo menos 4 caracters' })
    .max(20, { message: 'Usuário deve conter no máximo 20 caracters.' }),
  password: z
    .string()
    .min(6, { message: 'Senha deve conter no mínimo 6 caracters' })
    .max(20, {
      message: 'Senha deve conter no máximo 20 caracters',
    }),
  repeatPassword: z
    .string()
    .min(6, { message: 'Senha deve conter no mínimo 6 caracters' })
    .max(20, {
      message: 'Senha deve conter no máximo 20 caracters',
    }),
})

type SignUpForm = z.infer<typeof signupFormSchema>

export function SignUp() {
  const navigate = useNavigate()

  const {
    register,
    handleSubmit,
    watch,

    formState: { errors, isSubmitting },
  } = useForm<SignUpForm>({
    resolver: zodResolver(signupFormSchema),
    mode: 'onChange',
  })

  function handleSignUp(data: SignUpForm) {
    console.log(data)
    toast.success('Email enviado.', {
      action: {
        label: 'Login',
        onClick: () => navigate(`/sign-in?email=${emailWatch}`),
      },
    })
  }

  const nameWatch = watch('name')
  const cnpjWatch = watch('cnpj')
  const emailWatch = watch('email')
  const userWatch = watch('user')
  const passwordWatch = watch('password')
  const repeatPasswordWatch = watch('repeatPassword')

  const isButtonActived = !!(
    nameWatch &&
    cnpjWatch &&
    emailWatch &&
    userWatch &&
    passwordWatch &&
    repeatPasswordWatch
  )

  return (
    <>
      <Card className="h-full w-[350px] m-auto">
        <form
          onSubmit={handleSubmit(handleSignUp)}
          className="flex flex-col items-center py-6 px-4"
        >
          <div className="flex flex-col items-center gap-4 w-full">
            <div className="flex flex-col w-full">
              <Label className="p-2" htmlFor="name">
                Nome
              </Label>
              <Input
                id="name"
                placeholder="Digite nome da empresa..."
                {...register('name')}
              />
              <ErrorField error={errors.name} />
            </div>

            <div className="flex flex-col w-full">
              <Label className="p-2" htmlFor="cnpj">
                CNPJ
              </Label>
              <Input
                id="cnpj"
                placeholder="Digite o cnpj..."
                {...register('cnpj')}
              />
              <ErrorField error={errors.cnpj} />
            </div>

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
              <Label className="p-2" htmlFor="user">
                Usuário
              </Label>
              <Input
                id="user"
                placeholder="Digite um usuário..."
                {...register('user')}
              />
              <ErrorField error={errors.user} />
            </div>

            <div className="flex flex-col w-full">
              <Label className="p-2" htmlFor="password">
                Senha
              </Label>
              <Input
                id="password"
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
                placeholder="Repita a senha..."
                {...register('repeatPassword')}
              />
              <ErrorField error={errors.repeatPassword} />
            </div>

            <div className="flex flex-col w-full pt-2 ">
              <Button disabled={isSubmitting || !isButtonActived}>
                Cadastrar
              </Button>
            </div>
          </div>
        </form>
        <div className="w-full flex-1 flex p-2">
          <span className="text-sm text-gray-300 font-medium text-center m-auto">
            Jás tem uma conta?
            <Button className="block w-full" variant={'link'}>
              <Link
                to={emailWatch ? `/sign-in?email=${emailWatch}` : `/sign-in`}
                className="text-color-bg-primary hover:underline"
              >
                Acessar!
              </Link>
            </Button>
          </span>
        </div>
      </Card>
    </>
  )
}
