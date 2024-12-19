import {
  Controller,
  Delete,
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
import { DeleteMeetingUseCase } from '@/domain/app/application/use-cases/delete-meeting'

import { ZodValidationPipe } from '../pipes/zod-validation-pipe'

const deleteMeetingSchema = z.object({
  meetingId: z.string().uuid(),
})

@Controller('/meetings')
@ApiTags('meetings')
@ApiBearerAuth()
export class DeleteMeetingController {
  constructor(private deleteMeeting: DeleteMeetingUseCase) {}

  @Delete('/:meetingId')
  @HttpCode(204)
  @ApiOperation({ summary: 'Delete a meeting by ID.' })
  @ApiParam({
    name: 'meetingId',
    type: 'string',
    description: 'Unique identifier of the meeting',
    example: 'ba397f8f-487e-4bdc-9b7d-b397bb246e47',
  })
  @ApiResponse({
    status: 204,
    description: 'Meeting deleted successfully.',
  })
  @ApiResponse({
    status: 404,
    description: 'Meeting not found.',
  })
  async handle(
    @Param('meetingId', new ZodValidationPipe(deleteMeetingSchema))
    param: {
      meetingId: string
    },
  ) {
    const { meetingId } = param

    const result = await this.deleteMeeting.execute({ meetingId })

    if (result.isLeft()) {
      const error = result.value
      if (error instanceof ResourceNotFoundError) {
        throw new NotFoundException(error.message)
      }
    }
  }
}
