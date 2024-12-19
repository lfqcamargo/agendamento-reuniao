import {
  Controller,
  Delete,
  ForbiddenException,
  HttpCode,
  NotFoundException,
  Param,
} from '@nestjs/common'
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger'
import { z } from 'zod'

import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'
import { SystemDoesNotAllowError } from '@/core/errors/system-does-not-allow'
import { DeleteParticipantUseCase } from '@/domain/app/application/use-cases/delete-participant'

import { ZodValidationPipe } from '../pipes/zod-validation-pipe'

const deleteParticipantSchema = z.object({
  userAuthenticateId: z.string().uuid(),
  meetingParticipantId: z.string().uuid(),
})

@Controller('/meetings')
@ApiTags('meetings')
@ApiBearerAuth()
export class DeleteParticipantController {
  constructor(private deleteParticipant: DeleteParticipantUseCase) {}

  @Delete('/participants/:meetingParticipantId')
  @HttpCode(204)
  @ApiOperation({ summary: 'Delete a participant from a meeting.' })
  @ApiParam({
    name: 'meetingParticipantId',
    type: 'string',
    description: 'Unique identifier of the meeting participant',
    example: 'ba397f8f-487e-4bdc-9b7d-b397bb246e47',
  })
  @ApiResponse({
    status: 204,
    description: 'Participant deleted successfully.',
  })
  @ApiResponse({
    status: 404,
    description: 'Participant not found.',
  })
  @ApiResponse({
    status: 403,
    description: 'User is not authorized to delete this participant.',
  })
  async handle(
    @Param(
      'meetingParticipantId',
      new ZodValidationPipe(deleteParticipantSchema),
    )
    param: { meetingParticipantId: string },
    @Param('userAuthenticateId', new ZodValidationPipe(deleteParticipantSchema))
    paramAuth: { userAuthenticateId: string },
  ) {
    const { meetingParticipantId } = param
    const { userAuthenticateId } = paramAuth

    const result = await this.deleteParticipant.execute({
      userAuthenticateId,
      meetingParticipantId,
    })

    if (result.isLeft()) {
      const error = result.value
      if (error instanceof ResourceNotFoundError) {
        throw new NotFoundException(error.message)
      }
      if (error instanceof SystemDoesNotAllowError) {
        throw new ForbiddenException(error.message)
      }
    }
  }
}
