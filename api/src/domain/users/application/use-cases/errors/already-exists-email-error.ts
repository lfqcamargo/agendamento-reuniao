import { AlreadyExistsError } from '@/core/errors/already-exists-error'

export class AlreadyExistsEmailError extends AlreadyExistsError {
  constructor() {
    super('Already exists email.')
  }
}
