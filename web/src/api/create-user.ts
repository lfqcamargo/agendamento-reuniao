import { api } from '@/lib/axios'

export interface CreateUserBody {
  email: string
  name: string
  nickname: string
  password: string
  role: number
}

export async function createUser({
  email,
  name,
  nickname,
  password,
  role,
}: CreateUserBody) {
  const result = await api.post('/users/', {
    email,
    name,
    nickname,
    password,
    role,
  })
  return result
}
