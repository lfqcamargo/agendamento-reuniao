import { AlreadyExistsError } from '@/core/errors/already-exists-error'

export class AlreadyExistsCnpjError extends AlreadyExistsError {
  constructor() {
    super('Already exists cnpj.')
  }
}
