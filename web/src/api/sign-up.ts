import { api } from '@/lib/axios'

export interface SignUpBody {
  companyName: string
  cnpj: string
  email: string
  userName: string
  nickname: string
  password: string
}

export async function signUp({
  companyName,
  cnpj,
  email,
  userName,
  nickname,
  password,
}: SignUpBody) {
  await api.post('/companies', {
    companyName,
    cnpj,
    email,
    userName,
    nickname,
    password,
  })
}
