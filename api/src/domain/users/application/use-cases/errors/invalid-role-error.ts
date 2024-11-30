import { AlreadyExistsError } from '@/core/errors/already-exists-error'

export class InvalidRoleError extends AlreadyExistsError {
  constructor() {
    super('Invalid role.')
  }
}
