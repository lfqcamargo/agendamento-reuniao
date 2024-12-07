import { api } from '@/lib/axios'

export interface GetProfileResponse {
  user: {
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
}

export async function getProfile(): Promise<GetProfileResponse> {
  const response = await api.get<GetProfileResponse>(`/me/`)

  return response.data
}
