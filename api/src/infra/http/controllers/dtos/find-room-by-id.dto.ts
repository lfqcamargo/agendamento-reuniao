import { applyDecorators } from '@nestjs/common'
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger'

export const FindRoomByIdDocs = () => {
  return applyDecorators(
    ApiTags('rooms'),
    ApiBearerAuth(),
    ApiOperation({ summary: 'Find a room by their unique ID.' }),
    ApiParam({
      name: 'id',
      type: 'string',
      description: 'Unique identifier of the room',
      example: 'ba397f8f-487e-4bdc-9b7d-b397bb246e47',
    }),
    ApiResponse({
      status: 200,
      description: 'Room found successfully.',
      content: {
        'application/json': {
          examples: {
            roomFound: {
              summary: 'Room found',
              value: {
                id: 'ba397f8f-487e-4bdc-9b7d-b397bb246e47',
                name: 'Room 1',
                active: true,
              },
            },
          },
        },
      },
    }),
    ApiResponse({
      status: 404,
      description: 'Room not found.',
    }),
    ApiResponse({
      status: 401,
      description: 'Unauthorized.',
    }),
  )
}
