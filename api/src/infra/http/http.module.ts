import { Module } from '@nestjs/common'

// import { AddParticipantUseCase } from '@/domain/app/application/use-cases/add-participant'
// import { CreateMeetingUseCase } from '@/domain/app/application/use-cases/create-meeting'
// import { CreateRoomUseCase } from '@/domain/app/application/use-cases/create-room'
// import { DeleteMeetingUseCase } from '@/domain/app/application/use-cases/delete-meeting'
// import { DeleteParticipantUseCase } from '@/domain/app/application/use-cases/delete-participant'
// import { DeleteRoomUseCase } from '@/domain/app/application/use-cases/delete-room'
// import { EditRoomUseCase } from '@/domain/app/application/use-cases/edit-room'
// import { FetchRoomsByCompanyIdUseCase } from '@/domain/app/application/use-cases/fetch-rooms-by-company-id'
// import { FindRoomByIdUseCase } from '@/domain/app/application/use-cases/find-room-by-id'
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

// import { AddParticipantController } from './controllers/add-participant.controller'
import { AuthenticateController } from './controllers/authenticate.controller'
import { CreateCompanyAndUserController } from './controllers/create-company-and-user.controller'
// import { CreateMeetingController } from './controllers/create-meeting.controller'
// import { CreateRoomController } from './controllers/create-room.controller'
import { CreateUserController } from './controllers/create-user.controller'
// import { DeleteMeetingController } from './controllers/delete-meeting.controller'
// import { DeleteParticipantController } from './controllers/delete-participant.controller'
// import { DeleteRoomController } from './controllers/delete-room.controller'
import { DeleteUserController } from './controllers/delete-user.controller'
// import { EditRoomController } from './controllers/edit-room.controller'
import { EditUserController } from './controllers/edit-user.controller'
// import { FetchRoomsByCompanyIdController } from './controllers/fetch-rooms-by-company-id.controller'
import { FetchUsersByCompanyIdController } from './controllers/fetch-users-by-company-id.controller'
// import { FindRoomByIdController } from './controllers/find-room-by-id.controller'
import { FindUserByIdController } from './controllers/find-user-by-id.controller'
import { GetProfileController } from './controllers/get-profile.controller'

@Module({
  imports: [DatabaseModule, CryptographyModule],
  controllers: [
    AuthenticateController,
    GetProfileController,
    CreateCompanyAndUserController,
    CreateUserController,
    EditUserController,
    DeleteUserController,
    FindUserByIdController,
    FetchUsersByCompanyIdController,
    // CreateRoomController,
    // DeleteRoomController,
    // EditRoomController,
    // FetchRoomsByCompanyIdController,
    // FindRoomByIdController,
    // CreateMeetingController,
    // DeleteMeetingController,
    // AddParticipantController,
    // DeleteParticipantController,
  ],
  providers: [
    AuthenticateUserUseCase,
    GetProfileUseCase,
    CreateCompanyAndUserUseCase,
    CreateUserUseCase,
    EditUserUseCase,
    DeleteUserUseCase,
    FindUserByIdUseCase,
    FetchUsersByCompanyIdUseCase,
    // CreateRoomUseCase,
    // DeleteRoomUseCase,
    // EditRoomUseCase,
    // FetchRoomsByCompanyIdUseCase,
    // FindRoomByIdUseCase,
    // CreateMeetingUseCase,
    // DeleteMeetingUseCase,
    // AddParticipantUseCase,
    // DeleteParticipantUseCase,
  ],
})
export class HttpModule {}
