import { jwtDecode } from 'jwt-decode'

interface TokenPayload {
  sub: string // ID do usuário
  company: string // ID da companhia
  iat: number // Timestamp de criação do token
  exp: number // Timestamp de expiração do token
}

export function getTokenPayload(): TokenPayload | null {
  const token = localStorage.getItem('access_token')
  if (!token) return null

  try {
    return jwtDecode<TokenPayload>(token)
  } catch (error) {
    console.error('Token inválido:', error)
    return null
  }
}
