import { AlreadyExistsError } from '@/core/errors/already-exists-error'

export class AlreadyExistsNicknameError extends AlreadyExistsError {
  constructor() {
    super('Already exists nickname.')
  }
}
