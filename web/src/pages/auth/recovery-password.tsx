import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { toast } from 'sonner'
import * as z from 'zod'

import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

const recoveryPasswordFormSchema = z.object({
  email: z.string().email(),
})

type RecoveryPasswordForm = z.infer<typeof recoveryPasswordFormSchema>

export function RecoveryPassword() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()

  const {
    register,
    handleSubmit,
    watch,
    formState: { isSubmitting, isValid },
  } = useForm<RecoveryPasswordForm>({
    resolver: zodResolver(recoveryPasswordFormSchema),
    mode: 'onChange',
    defaultValues: {
      email: searchParams.get('email') ?? '',
    },
  })

  function handleRecoveryPassword(data: RecoveryPasswordForm) {
    console.log(data)
    toast.success('Email enviado.', {
      action: {
        label: 'Login',
        onClick: () => navigate(`/sign-in?email=${emailWatch}`),
      },
    })
  }

  const emailWatch = watch('email')

  return (
    <>
      <Card className="h-[350px] w-[300px] m-auto">
        <form
          onSubmit={handleSubmit(handleRecoveryPassword)}
          className="flex flex-col items-center p-4"
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
            </div>

            <div className="flex flex-col w-full ">
              <Button disabled={isSubmitting || !isValid}>Enviar email</Button>
            </div>
          </div>
        </form>
        <div className="w-full flex-1 flex mt-16">
          <span className="text-sm text-gray-300 font-medium text-center m-auto">
            Para voltar a tela login
            <Button className="block w-full" variant={'link'}>
              <Link
                to={emailWatch ? `/sign-in?email=${emailWatch}` : `/sign-in`}
                className="text-color-bg-primary hover:underline"
              >
                Clique Aqui!
              </Link>
            </Button>
          </span>
        </div>
      </Card>
    </>
  )
}
