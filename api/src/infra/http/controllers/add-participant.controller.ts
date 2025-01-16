import {
  BadRequestException,
  ConflictException,
  Controller,
  ForbiddenException,
  HttpCode,
  NotFoundException,
  Param,
  Post,
} from '@nestjs/common'
import { z } from 'zod'

import { AlreadyExistsError } from '@/core/errors/already-exists-error'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'
import { UserNotAdminError } from '@/core/errors/user-not-admin-error'
import { AddParticipantUseCase } from '@/domain/app/application/use-cases/add-participant'
import { CurrentUser } from '@/infra/auth/current-user.decorator'
import { UserPayload } from '@/infra/auth/jwt.strategy'

import { ZodValidationPipe } from '../pipes/zod-validation-pipe'
import { AddParticipantDocs } from './dtos/add-participant.dto'

const addParticipantParams = z.object({
  meetingId: z.string().uuid(),
  participantId: z.string().uuid(),
})

type AddParticipantParams = z.infer<typeof addParticipantParams>

@Controller('/meetings')
export class AddParticipantController {
  constructor(private addParticipant: AddParticipantUseCase) {}

  @Post(':meetingId/:participantId')
  @HttpCode(200)
  @AddParticipantDocs()
  async handle(
    @Param(new ZodValidationPipe(addParticipantParams))
    params: AddParticipantParams,
    @CurrentUser() user: UserPayload,
  ) {
    const { company: companyId, sub: userId } = user

    const { meetingId, participantId } = params

    console.log(`${meetingId}/${participantId}`)
    const result = await this.addParticipant.execute({
      companyId,
      userId,
      participantId,
      meetingId,
    })

    if (result.isLeft()) {
      const error = result.value

      switch (error.constructor) {
        case ResourceNotFoundError:
          throw new NotFoundException(error.message)
        case AlreadyExistsError:
          throw new ConflictException(error.message)
        case UserNotAdminError:
          throw new ForbiddenException(error.message)
        default:
          throw new BadRequestException(error.message)
      }
    }
  }
}
