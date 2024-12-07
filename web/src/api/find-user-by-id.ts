import { api } from '@/lib/axios'

export interface FindUserByIdResponse {
  id: string
  companyId: string
  name: string
  nickname: string
  email: string
  role: number
  active: boolean
  createdAt: string
  lastLogin: string | null
}

export interface FindUserByIdRequest {
  id: string
}

export async function findUserById({
  id,
}: FindUserByIdRequest): Promise<FindUserByIdResponse> {
  const response = await api.get<FindUserByIdResponse>(`/users/${id}`)

  return response.data
}
