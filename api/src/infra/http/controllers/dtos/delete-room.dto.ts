import { applyDecorators } from '@nestjs/common'
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger'

export const DeleteRoomDocs = () => {
  return applyDecorators(
    ApiTags('rooms'),
    ApiBearerAuth(),
    ApiOperation({ summary: 'Delete an existing room in the company.' }),
    ApiParam({
      name: 'roomId',
      type: 'string',
      description: 'Unique identifier of the room',
      example: 'ba397f8f-487e-4bdc-9b7d-b397bb246e47',
    }),
    ApiResponse({
      status: 204,
      description: 'Room deleteed successfully.',
    }),
    ApiResponse({
      status: 404,
      description: 'Not Found - The requested room does not exist.',
      content: {
        'application/json': {
          examples: {
            roomNotFound: {
              summary: 'Room not found',
              value: { message: 'Room not found.' },
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
