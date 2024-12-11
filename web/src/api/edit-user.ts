import { api } from '@/lib/axios'

export interface EditUserBody {
  id: string
  name?: string | undefined
  nickname?: string | undefined
  password?: string | undefined
  role?: number | undefined
  active?: boolean | undefined
}

export async function editUser({
  id,
  name,
  nickname,
  password,
  role,
  active,
}: EditUserBody) {
  await api.put('/users/', {
    id,
    name,
    nickname,
    password,
    role,
    active,
  })
}
