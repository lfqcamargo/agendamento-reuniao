import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import axios from 'axios'
import { cnpj } from 'cpf-cnpj-validator'
import { useForm } from 'react-hook-form'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import * as z from 'zod'

import { signUp } from '@/api/sign-up'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

import { ErrorField } from './components/error-field'

const signupFormSchema = z
  .object({
    companyName: z
      .string()
      .min(4, {
        message: 'Nome da empresa deve conter pelo menos 4 caracters.',
      })
      .max(50, {
        message: 'Nome da empresa deve conter no máximo 50 caracters.',
      }),
    cnpj: z
      .string()
      .refine((value) => cnpj.isValid(value), { message: 'CNPJ inválido.' }),
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
  })
  .refine((data) => data.password === data.repeatPassword, {
    message: 'As senhas devem ser iguais.',
    path: ['repeatPassword'],
  })

type SignUpForm = z.infer<typeof signupFormSchema>

export function SignUp() {
  const navigate = useNavigate()

  const { mutateAsync: signUpFn } = useMutation({
    mutationFn: signUp,
  })

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<SignUpForm>({
    resolver: zodResolver(signupFormSchema),
    mode: 'onChange',
  })

  async function handleSignUp(data: SignUpForm) {
    try {
      await signUpFn({
        companyName: data.companyName,
        cnpj: data.cnpj.replace(/\D/g, ''),
        email: data.email,
        userName: data.userName,
        nickname: data.nickname,
        password: data.password,
      })

      reset()
      toast.success('Cadastro Realizado.', {
        action: {
          label: 'Login',
          onClick: () => navigate(`/sign-in?email=${emailWatch}`),
        },
      })
    } catch (error) {
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

  const nameWatch = watch('companyName')
  const cnpjWatch = watch('cnpj')
  const emailWatch = watch('email')
  const userNameWatch = watch('userName')
  const nicknameWatch = watch('nickname')
  const passwordWatch = watch('password')
  const repeatPasswordWatch = watch('repeatPassword')

  const isButtonActived = !!(
    nameWatch &&
    cnpjWatch &&
    emailWatch &&
    userNameWatch &&
    nicknameWatch &&
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
              <Label className="p-2" htmlFor="companyName">
                Nome da Empresa
              </Label>
              <Input
                id="companyName"
                placeholder="Digite nome da empresa..."
                {...register('companyName')}
              />
              <ErrorField error={errors.companyName} />
            </div>

            <div className="flex flex-col w-full">
              <Label className="p-2" htmlFor="cnpj">
                CNPJ
              </Label>
              <Input
                id="cnpj"
                placeholder="Digite o cnpj..."
                {...register('cnpj', {
                  onChange: (e) => {
                    const rawValue = e.target.value.replace(/\D/g, '')
                    e.target.value = cnpj.format(rawValue)
                  },
                })}
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
              <Label className="p-2" htmlFor="userName">
                Nome Completo do Usuário
              </Label>
              <Input
                id="userName"
                placeholder="Digite o nome copleto..."
                {...register('userName')}
              />
              <ErrorField error={errors.userName} />
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
