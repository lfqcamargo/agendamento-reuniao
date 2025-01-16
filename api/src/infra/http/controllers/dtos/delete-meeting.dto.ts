import { applyDecorators } from '@nestjs/common'
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger'

export const DeleteMeetingDocs = () => {
  return applyDecorators(
    ApiTags('meetings'),
    ApiBearerAuth(),
    ApiOperation({ summary: 'Delete an existing meeting in the company.' }),
    ApiParam({
      name: 'meetingId',
      type: 'string',
      description: 'Unique identifier of the meeting',
      example: 'ba397f8f-487e-4bdc-9b7d-b397bb246e47',
    }),
    ApiResponse({
      status: 204,
      description: 'Meeting deleteed successfully.',
    }),
    ApiResponse({
      status: 404,
      description: 'Not Found - The requested meeting does not exist.',
      content: {
        'application/json': {
          examples: {
            meetingNotFound: {
              summary: 'Meeting not found',
              value: { message: 'Meeting not found.' },
            },
            adminNotFound: {
              summary: 'User not found',
              value: { message: 'User not found.' },
            },
          },
        },
      },
    }),
    ApiResponse({
      status: 403,
      description: 'User not admin.',
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
