import { UseCaseError } from '@/core/errors/use-case-error'

export class MissingAdminError extends Error implements UseCaseError {
  constructor() {
    super('You must have at least one administrator user')
  }
}
