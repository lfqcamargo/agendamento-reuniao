import z from 'zod'

import { UserRole } from '@/domain/users/enterprise/entities/user'

export const roleEnum = z.union([
  z.literal(UserRole.Admin),
  z.literal(UserRole.Member),
])
