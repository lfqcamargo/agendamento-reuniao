import {
  BadRequestException,
  Body,
  ConflictException,
  Controller,
  ForbiddenException,
  HttpCode,
  NotFoundException,
  Post,
} from '@nestjs/common'
import { z } from 'zod'

import { AlreadyExistsError } from '@/core/errors/already-exists-error'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'
import { SystemDoesNotAllowError } from '@/core/errors/system-does-not-allow'
import { CreateMeetingUseCase } from '@/domain/app/application/use-cases/create-meeting'
import { CurrentUser } from '@/infra/auth/current-user.decorator'
import { UserPayload } from '@/infra/auth/jwt.strategy'

import { ZodValidationPipe } from '../pipes/zod-validation-pipe'
import { CreateMeetingDocs } from './dtos/create-meeting.dto'

const createMeetingSchema = z.object({
  roomId: z.string().uuid(),
  startTime: z.string().datetime(),
  endTime: z.string().datetime(),
  participantsIds: z.array(z.string().uuid()).nonempty(),
})

@Controller('/meetings')
export class CreateMeetingController {
  constructor(private createMeeting: CreateMeetingUseCase) {}

  @Post()
  @HttpCode(201)
  @CreateMeetingDocs()
  async handle(
    @Body(new ZodValidationPipe(createMeetingSchema))
    body: z.infer<typeof createMeetingSchema>,
    @CurrentUser() user: UserPayload,
  ) {
    const { company: companyId, sub: creatorId } = user

    const { roomId, startTime, endTime, participantsIds } = body

    const result = await this.createMeeting.execute({
      companyId,
      creatorId,
      roomId,
      startTime: new Date(startTime),
      endTime: new Date(endTime),
      participantsIds,
    })

    if (result.isLeft()) {
      const error = result.value

      switch (error.constructor) {
        case ResourceNotFoundError:
          throw new NotFoundException(error.message)
        case AlreadyExistsError:
          throw new ConflictException(error.message)
        case SystemDoesNotAllowError:
          throw new ForbiddenException(error.message)
        default:
          throw new BadRequestException(error.message)
      }
    }
  }
}
