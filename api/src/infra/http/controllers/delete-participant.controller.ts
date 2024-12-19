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
import { CurrentUser } from '@/infra/auth/current-user.decorator'
import { UserPayload } from '@/infra/auth/jwt.strategy'

import { ZodValidationPipe } from '../pipes/zod-validation-pipe'

const participantQueryParamSchema = z.object({ id: z.string().uuid() })

type QueryValidationPipe = z.infer<typeof participantQueryParamSchema>

@Controller('/meetings')
@ApiTags('meetings')
@ApiBearerAuth()
export class DeleteParticipantController {
  constructor(private deleteParticipant: DeleteParticipantUseCase) {}

  @Delete('/participants/:id')
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
    @CurrentUser()
    user: UserPayload,
    @Param(new ZodValidationPipe(participantQueryParamSchema))
    params: QueryValidationPipe,
  ) {
    const userId = user.sub
    const { id } = params

    const result = await this.deleteParticipant.execute({
      userAuthenticateId: userId,
      meetingParticipantId: id,
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
