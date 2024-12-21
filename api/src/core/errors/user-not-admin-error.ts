import { UseCaseError } from '@/core/errors/use-case-error'

export class UserNotAdminError extends Error implements UseCaseError {
  constructor() {
    super('User not admin.')
  }
}
