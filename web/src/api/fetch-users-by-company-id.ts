import { api } from '@/lib/axios'

export interface FetchUsersByCompanyIdResponse {
  users: [
    {
      id: string
      companyId: string
      name: string
      nickname: string
      email: string
      role: number
      active: boolean
      createdAt: string
      lastLogin: string | null
    },
  ]
}

export async function fetchUsersByCompanyId(): Promise<FetchUsersByCompanyIdResponse> {
  const response = await api.get<FetchUsersByCompanyIdResponse>(`/users/`)

  return response.data
}
