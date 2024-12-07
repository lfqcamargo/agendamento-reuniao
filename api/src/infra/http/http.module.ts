import { Module } from '@nestjs/common'

import { AuthenticateUserUseCase } from '@/domain/users/application/use-cases/authenticate-user'
import { CreateCompanyAndUserUseCase } from '@/domain/users/application/use-cases/create-company-and-user'
import { CreateUserUseCase } from '@/domain/users/application/use-cases/create-user'
import { DeleteUserUseCase } from '@/domain/users/application/use-cases/delete-user'
import { EditUserUseCase } from '@/domain/users/application/use-cases/edit-user'
import { FetchUsersByCompanyIdUseCase } from '@/domain/users/application/use-cases/fetch-users-by-company-id'
import { FindUserByIdUseCase } from '@/domain/users/application/use-cases/find-user-by-id'
import { GetProfileUseCase } from '@/domain/users/application/use-cases/get-profile'
import { CryptographyModule } from '@/infra/cryptography/cryptography.module'
import { DatabaseModule } from '@/infra/database/database.module'

import { AuthenticateController } from './controllers/authenticate.controller'
import { CreateCompanyAndUserController } from './controllers/create-company-and-user.controller'
import { CreateUserController } from './controllers/create-user.controller'
import { DeleteUserController } from './controllers/delete-user.controller'
import { EditUserController } from './controllers/edit-user.controller'
import { FetchUsersByCompanyIdController } from './controllers/fetch-users-by-company-id.controller'
import { FindUserByIdController } from './controllers/find-user-by-id.controller'
import { GetProfileController } from './controllers/get-profile.controller'

@Module({
  imports: [DatabaseModule, CryptographyModule],
  controllers: [
    AuthenticateController,
    CreateCompanyAndUserController,
    CreateUserController,
    EditUserController,
    DeleteUserController,
    FindUserByIdController,
    FetchUsersByCompanyIdController,
    GetProfileController,
  ],
  providers: [
    AuthenticateUserUseCase,
    CreateCompanyAndUserUseCase,
    CreateUserUseCase,
    EditUserUseCase,
    DeleteUserUseCase,
    FindUserByIdUseCase,
    FetchUsersByCompanyIdUseCase,
    GetProfileUseCase,
  ],
})
export class HttpModule {}
