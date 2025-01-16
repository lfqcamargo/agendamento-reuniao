import { applyDecorators } from '@nestjs/common'
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiProperty,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger'

import { UserRole } from '@/domain/users/enterprise/entities/user'

export const EditUserDocs = () => {
  return applyDecorators(
    ApiTags('users'),
    ApiBearerAuth(),
    ApiOperation({ summary: 'Edit an existing user in the company.' }),
    ApiParam({
      name: 'userId',
      type: 'string',
      description: 'Unique identifier of the user',
      example: 'ba397f8f-487e-4bdc-9b7d-b397bb246e47',
    }),
    ApiBody({ type: EditUserSchemaDto }),
    ApiResponse({
      status: 200,
      description: 'User edited successfully.',
    }),
    ApiResponse({
      status: 409,
      description: 'Already exists nickname.',
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
    ApiResponse({
      status: 400,
      description: 'Bad Request - Invalid input data.',
    }),
  )
}

class EditUserSchemaDto {
  @ApiProperty({
    example: 'Lucas Camargo',
    description: 'User name',
    type: String,
  })
  name!: string

  @ApiProperty({
    example: 'lfqcamargo',
    description: 'User nickname',
    type: String,
  })
  nickname!: string

  @ApiProperty({
    example: '123456789lfqcamargo',
    description: 'User password',
    type: String,
  })
  password!: string

  @ApiProperty({
    example: UserRole.Admin,
    description: 'User permission level',
    enum: UserRole,
    enumName: 'UserRole',
  })
  role!: UserRole

  @ApiProperty({
    example: 'true',
    description: 'User active',
    type: Number,
  })
  active!: number

  @ApiProperty({
    description: 'Profile photo uploaded by the user',
    type: 'string',
    format: 'binary',
  })
  profilePhoto?: Buffer
}
