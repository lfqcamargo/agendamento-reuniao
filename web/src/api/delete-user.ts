import { api } from '@/lib/axios'

export interface DeleteUserParams {
  id: string
}

export async function deleteUser({ id }: DeleteUserParams) {
  const response = await api.delete(`/users/${id}/`)

  return response
}
