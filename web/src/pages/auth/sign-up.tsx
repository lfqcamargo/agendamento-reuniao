import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import axios from 'axios'
import { cnpj } from 'cpf-cnpj-validator'
import { useForm } from 'react-hook-form'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import * as z from 'zod'

import { signUp } from '@/api/sign-up'
import { GenericForm } from '@/components/generic-form'
import { ToastError } from '@/components/toast-error'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'

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

const fields = [
  'companyName',
  'cnpj',
  'email',
  'userName',
  'nickname',
  'password',
  'repeatPassword',
]

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
    control,
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
        ToastError({ error })
      } else {
        toast.error('Ocorreu um erro inesperado.')
      }
    }
  }

  const companyNameWatch = watch('companyName')
  const cnpjWatch = watch('cnpj')
  const emailWatch = watch('email')
  const userNameWatch = watch('userName')
  const nicknameWatch = watch('nickname')
  const passwordWatch = watch('password')
  const repeatPasswordWatch = watch('repeatPassword')

  const isButtonActived = !!(
    companyNameWatch &&
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
          <GenericForm
            fields={fields}
            register={register}
            errors={errors}
            control={control}
          />
          <div className="flex flex-col w-full pt-6 ">
            <Button disabled={isSubmitting || !isButtonActived}>
              Cadastrar
            </Button>
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
