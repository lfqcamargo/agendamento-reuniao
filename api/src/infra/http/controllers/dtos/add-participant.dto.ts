import { applyDecorators } from '@nestjs/common'
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger'

export const AddParticipantDocs = () => {
  return applyDecorators(
    ApiTags('participants'),
    ApiBearerAuth(),
    ApiOperation({ summary: 'Add participant in the meeting.' }),
    ApiParam({
      name: 'meetingId/participantId',
      type: 'string',
      description: 'Unique identifier of the participant',
      example: 'ba397f8f-487e-4bdc-9b7d-b397bb246e47',
    }),
    ApiResponse({
      status: 200,
      description: 'Participant add successfully.',
    }),
    ApiResponse({
      status: 404,
      description: 'Not Found - The requested participant does not exist.',
      content: {
        'application/json': {
          examples: {
            participantNotFound: {
              summary: 'Participant not found',
              value: { message: 'Participant not found.' },
            },
            adminNotFound: {
              summary: 'Participant admin not found',
              value: { message: 'Participant admin not found.' },
            },
          },
        },
      },
    }),
    ApiResponse({
      status: 403,
      description: 'Participant not admin.',
    }),
    ApiResponse({
      status: 401,
      description: 'Unauthorized.',
    }),
    ApiResponse({
      status: 400,
      description: 'Bad Request - Invalid input data.',
    }),
  )
}
