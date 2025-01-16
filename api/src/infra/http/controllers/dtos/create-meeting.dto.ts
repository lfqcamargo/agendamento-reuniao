import { applyDecorators } from '@nestjs/common'
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiProperty,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger'

export const CreateMeetingDocs = () => {
  return applyDecorators(
    ApiTags('meetings'),
    ApiBearerAuth(),
    ApiOperation({ summary: 'Create a new meeting.' }),
    ApiBody({ type: CreateMeetingSchemaDto }),
    ApiResponse({
      status: 201,
      description: 'Meeting created successfully.',
    }),
    ApiResponse({
      status: 409,
      description: 'Conflict - There is already a schedule.',
    }),
    ApiResponse({
      status: 404,
      description: 'Resource not found',
      content: {
        'application/json': {
          examples: {
            roomNotFound: {
              summary: 'Room not found',
              value: { message: 'Room not found.' },
            },
            creatorNotFound: {
              summary: 'Users creator not found',
              value: { message: 'Users creator not found.' },
            },
            userNotFound: {
              summary: 'User participant not found',
              value: { message: 'User participant not found.' },
            },
          },
        },
      },
    }),
    ApiResponse({
      status: 403,
      description: 'Forbidden  - User is not active.',
    }),
    ApiResponse({
      status: 401,
      description: 'Unauthorized - User is not an admin.',
    }),
    ApiResponse({
      status: 400,
      description: 'Bad Request - Invalid input data.',
    }),
  )
}

class CreateMeetingSchemaDto {
  @ApiProperty({
    example: '2d5a6b8c-f87a-4b68-a0c5-5bfa7c6f8e78',
    description: 'Room ID where the meeting will be held.',
    type: String,
    format: 'uuid',
  })
  roomId!: string

  @ApiProperty({
    example: '2024-12-01T10:00:00Z',
    description: 'Start time of the meeting.',
    type: String,
    format: 'date-time',
  })
  startTime!: string

  @ApiProperty({
    example: '2024-12-01T11:00:00Z',
    description: 'End time of the meeting.',
    type: String,
    format: 'date-time',
  })
  endTime!: string

  @ApiProperty({
    example: ['2d5a6b8c-f87a-4b68-a0c5-5bfa7c6f8e78'],
    description: 'List of participant IDs.',
    type: [String],
    isArray: true,
    format: 'uuid',
  })
  participantsIds!: string[]
}
