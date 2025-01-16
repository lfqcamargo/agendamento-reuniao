import {
  BadRequestException,
  Controller,
  Delete,
  ForbiddenException,
  HttpCode,
  NotFoundException,
  Param,
} from '@nestjs/common'
import { z } from 'zod'

import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'
import { UserNotAdminError } from '@/core/errors/user-not-admin-error'
import { DeleteMeetingUseCase } from '@/domain/app/application/use-cases/delete-meeting'
import { CurrentUser } from '@/infra/auth/current-user.decorator'
import { UserPayload } from '@/infra/auth/jwt.strategy'

import { ZodValidationPipe } from '../pipes/zod-validation-pipe'
import { DeleteMeetingDocs } from './dtos/delete-meeting.dto'

const deleteMeetingParam = z.object({
  meetingId: z.string().uuid(),
})

type DeleteMeetingParam = z.infer<typeof deleteMeetingParam>

@Controller('/meetings')
export class DeleteMeetingController {
  constructor(private deleteMeeting: DeleteMeetingUseCase) {}

  @Delete(':meetingId')
  @HttpCode(204)
  @DeleteMeetingDocs()
  async handle(
    @Param(new ZodValidationPipe(deleteMeetingParam)) param: DeleteMeetingParam,
    @CurrentUser() user: UserPayload,
  ) {
    const { company: companyId, sub: userId } = user
    const { meetingId } = param

    const result = await this.deleteMeeting.execute({
      companyId,
      userId,
      meetingId,
    })

    if (result.isLeft()) {
      const error = result.value

      switch (error.constructor) {
        case ResourceNotFoundError:
          throw new NotFoundException(error.message)
        case UserNotAdminError:
          throw new ForbiddenException(error.message)
        default:
          throw new BadRequestException(error.message)
      }
    }
  }
}
