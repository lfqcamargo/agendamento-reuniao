import { UseCaseError } from '@/core/errors/use-case-error'

export class SystemDoesNotAllowError extends Error implements UseCaseError {
  constructor() {
    super('System does not allow')
  }
}
