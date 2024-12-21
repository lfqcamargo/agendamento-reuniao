import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  Post,
} from '@nestjs/common'
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger'
import { z } from 'zod'

import { AlreadyExistsError } from '@/core/errors/already-exists-error'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'
import { UserNotCompanyError } from '@/core/errors/user-not-company'
import { AddParticipantUseCase } from '@/domain/app/application/use-cases/add-participant'

import { ZodValidationPipe } from '../pipes/zod-validation-pipe'

const addParticipantSchema = z.object({
  participantId: z.string().uuid(),
  roomSchedulesId: z.string().uuid(),
})

@Controller('/meetings')
@ApiTags('meetings')
@ApiBearerAuth()
export class AddParticipantController {
  constructor(private addParticipant: AddParticipantUseCase) {}

  @Post('/add-participant')
  @HttpCode(200)
  @ApiOperation({ summary: 'Add a participant to a meeting.' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        participantId: { type: 'string', format: 'uuid' },
        roomSchedulesId: { type: 'string', format: 'uuid' },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Participant added successfully.',
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request - Invalid input data or other errors.',
  })
  async handle(
    @Body(new ZodValidationPipe(addParticipantSchema))
    body: z.infer<typeof addParticipantSchema>,
  ) {
    const { participantId, roomSchedulesId } = body

    const result = await this.addParticipant.execute({
      participantId,
      roomSchedulesId,
    })

    if (result.isLeft()) {
      const error = result.value
      if (
        error instanceof ResourceNotFoundError ||
        error instanceof AlreadyExistsError ||
        error instanceof UserNotCompanyError
      ) {
        throw new BadRequestException(error.message)
      }
    }
  }
}
