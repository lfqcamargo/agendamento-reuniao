import { applyDecorators } from '@nestjs/common'
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger'

export const DeleteUserDocs = () => {
  return applyDecorators(
    ApiTags('users'),
    ApiBearerAuth(),
    ApiOperation({ summary: 'Delete an existing user in the company.' }),
    ApiParam({
      name: 'userId',
      type: 'string',
      description: 'Unique identifier of the user',
      example: 'ba397f8f-487e-4bdc-9b7d-b397bb246e47',
    }),
    ApiResponse({
      status: 200,
      description: 'User deleteed successfully.',
    }),
    ApiResponse({
      status: 404,
      description: 'Not Found - The requested user does not exist.',
      content: {
        'application/json': {
          examples: {
            userNotFound: {
              summary: 'User not found',
              value: { message: 'User not found.' },
            },
            adminNotFound: {
              summary: 'User admin not found',
              value: { message: 'User admin not found.' },
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
  )
}
