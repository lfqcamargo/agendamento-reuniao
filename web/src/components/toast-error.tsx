import { AxiosError } from 'axios'
import { toast } from 'sonner'

interface ServerErrorResponse {
  message: string
}

export function ToastError({
  error,
}: {
  error: AxiosError<ServerErrorResponse>
}) {
  const response = error.response

  if (response) {
    const status = response.status
    const data = response.data

    switch (status) {
      case 409: {
        const message = data?.message || ''

        switch (true) {
          case message.includes('cnpj'):
            toast.error('CNPJ já cadastrado')
            break
          case message.includes('email'):
            toast.error('Email já cadastrado')
            break
          case message.includes('nickname'):
            toast.error('Nome de usuário já cadastrado')
            break
          default:
            toast.error(message)
        }
        break
      }
      case 403:
        toast.error('Operação não permitida.')
        break
      default:
        toast.error('Erro ao realizar procedimento.')
        break
    }
  } else {
    toast.error('Erro ao realizar procedimento. Sem resposta do servidor.')
  }
}
