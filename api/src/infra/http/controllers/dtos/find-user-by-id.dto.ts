import { applyDecorators } from '@nestjs/common'
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger'

export const FindUserByIdDocs = () => {
  return applyDecorators(
    ApiTags('users'),
    ApiBearerAuth(),
    ApiOperation({ summary: 'Find a user by their unique ID.' }),
    ApiParam({
      name: 'id',
      type: 'string',
      description: 'Unique identifier of the user',
      example: 'ba397f8f-487e-4bdc-9b7d-b397bb246e47',
    }),
    ApiResponse({
      status: 200,
      description: 'User found successfully.',
      content: {
        'application/json': {
          examples: {
            userFound: {
              summary: 'User found',
              value: {
                id: 'ba397f8f-487e-4bdc-9b7d-b397bb246e47',
                name: 'Lucas Camargo',
                email: 'lfqcamargo@gmail.com',
                role: 1,
                active: true,
                profilePhoto: 'buffer',
              },
            },
          },
        },
      },
    }),
    ApiResponse({
      status: 404,
      description: 'User not found.',
    }),
    ApiResponse({
      status: 401,
      description: 'Unauthorized.',
    }),
  )
}
