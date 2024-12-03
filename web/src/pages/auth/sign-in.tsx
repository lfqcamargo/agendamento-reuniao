import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { Link, useSearchParams } from 'react-router-dom'
import { toast } from 'sonner'
import * as z from 'zod'

import { signIn } from '@/api/sign-in'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

const signInFormSchema = z.object({
  email: z.string().email(),
  password: z.string().min(5),
})

type SignInForm = z.infer<typeof signInFormSchema>

export function SignIn() {
  const [searchParams] = useSearchParams()

  const { mutateAsync: signInFn } = useMutation({
    mutationFn: signIn,
  })

  const {
    register,
    handleSubmit,
    watch,
    formState: { isSubmitting, isValid },
  } = useForm<SignInForm>({
    resolver: zodResolver(signInFormSchema),
    mode: 'onChange',
    defaultValues: {
      email: searchParams.get('email') ?? '',
    },
  })

  async function handleSignIn(data: SignInForm) {
    try {
      const response = await signInFn({
        email: data.email,
        password: data.password,
      })
      if (response.access_token) {
        localStorage.setItem('access_token', response.access_token)
        window.location.href = '/'
        toast.success('Login realizado com sucesso!')
      }
    } catch (error) {
      console.log(error)
      toast.error('Credenciais Inválidas!')
    }
  }

  const emailWatch = watch('email')

  return (
    <>
      <Card className="h-[450px] w-[350px] m-auto flex flex-1 flex-col justify-around">
        <div className="p-4">
          <form onSubmit={handleSubmit(handleSignIn)}>
            <div className="flex flex-col items-center gap-6 w-full">
              <div className="flex flex-col w-full">
                <Label className="p-2" htmlFor="email">
                  Email
                </Label>
                <Input
                  id="email"
                  placeholder="Digite seu email..."
                  {...register('email')}
                />
              </div>

              <div className="flex flex-col w-full">
                <Label className="p-2" htmlFor="password">
                  Senha
                </Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Digite sua senha..."
                  {...register('password')}
                />
              </div>

              <div className="flex w-full flex-col">
                <Button disabled={isSubmitting || !isValid}>Acessar</Button>
              </div>
            </div>
          </form>
          <div>
            <span className="text-sm mt-2 text-gray-300 font-medium flex flex-1 items-center justify-between">
              Problemas para acessar?
              <Button variant={'link'}>
                <Link
                  to={
                    emailWatch
                      ? `/recovery-password?email=${emailWatch}`
                      : `/recovery-password`
                  }
                  className="text-color-bg-primary hover:underline"
                >
                  Recuperar senha
                </Link>
              </Button>
            </span>
          </div>
        </div>
        <div className="w-full flex-1 flex">
          <span className="text-sm text-gray-300 font-medium text-center m-auto">
            Não tem uma conta?{' '}
            <Button className="block w-full" variant={'link'}>
              <Link
                to={'/sign-up'}
                className="text-color-bg-primary hover:underline"
              >
                Cadastra-se!
              </Link>
            </Button>
          </span>
        </div>
      </Card>
    </>
  )
}
