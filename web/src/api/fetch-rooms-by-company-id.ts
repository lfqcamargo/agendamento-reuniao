import { api } from '@/lib/axios'

export interface FetchroomsByCompanyIdResponse {
  rooms: [
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

export async function fetchroomsByCompanyId(): Promise<FetchroomsByCompanyIdResponse> {
  const response = await api.get<FetchroomsByCompanyIdResponse>(`/rooms/`)

  return response.data
}
