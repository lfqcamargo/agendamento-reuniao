import { Module } from '@nestjs/common'

import { AuthenticateUserUseCase } from '@/domain/users/application/use-cases/authenticate-user'
import { CreateCompanyAndUserUseCase } from '@/domain/users/application/use-cases/create-company-and-user'
import { CreateUserUseCase } from '@/domain/users/application/use-cases/create-user'
import { CryptographyModule } from '@/infra/cryptography/cryptography.module'
import { DatabaseModule } from '@/infra/database/database.module'

import { AuthenticateController } from './controllers/authenticate.controller'
import { CreateCompanyAndUserController } from './controllers/create-company-and-user.controller'
import { CreateUserController } from './controllers/create-user.controller'

@Module({
  imports: [DatabaseModule, CryptographyModule],
  controllers: [
    AuthenticateController,
    CreateCompanyAndUserController,
    CreateUserController,
  ],
  providers: [
    AuthenticateUserUseCase,
    CreateCompanyAndUserUseCase,
    CreateUserUseCase,
  ],
})
export class HttpModule {}
