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
import { CreateMeetingUseCase } from '@/domain/app/application/use-cases/create-meeting'

import { ZodValidationPipe } from '../pipes/zod-validation-pipe'

const createMeetingSchema = z.object({
  creatorId: z.string().uuid(),
  roomId: z.string().uuid(),
  startTime: z.string().datetime(),
  endTime: z.string().datetime(),
  participantsIds: z.array(z.string().uuid()).nonempty(),
})

@Controller('/meetings')
@ApiTags('meetings')
@ApiBearerAuth()
export class CreateMeetingController {
  constructor(private createMeeting: CreateMeetingUseCase) {}

  @Post()
  @HttpCode(201)
  @ApiOperation({ summary: 'Create a new meeting.' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        creatorId: { type: 'string', format: 'uuid' },
        roomId: { type: 'string', format: 'uuid' },
        startTime: { type: 'string', format: 'date-time' },
        endTime: { type: 'string', format: 'date-time' },
        participantsIds: {
          type: 'array',
          items: { type: 'string', format: 'uuid' },
        },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Meeting created successfully.',
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request - Invalid input data.',
  })
  async handle(
    @Body(new ZodValidationPipe(createMeetingSchema))
    body: z.infer<typeof createMeetingSchema>,
  ) {
    const { creatorId, roomId, startTime, endTime, participantsIds } = body

    const result = await this.createMeeting.execute({
      creatorId,
      roomId,
      startTime: new Date(startTime),
      endTime: new Date(endTime),
      participantsIds,
    })

    if (result.isLeft()) {
      const error = result.value
      if (
        error instanceof ResourceNotFoundError ||
        error instanceof AlreadyExistsError
      ) {
        throw new BadRequestException(error.message)
      }
    }
  }
}
