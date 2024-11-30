import { UseCaseError } from '@/core/errors/use-case-error'

export class UserNotCompanyError extends Error implements UseCaseError {
  constructor() {
    super('User is not from the company')
  }
}
