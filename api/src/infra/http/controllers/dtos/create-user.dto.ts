import { applyDecorators } from '@nestjs/common'
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiProperty,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger'

import { UserRole } from '@/domain/users/enterprise/entities/user'

export const CreateUserDocs = () => {
  return applyDecorators(
    ApiTags('users'),
    ApiBearerAuth(),
    ApiOperation({ summary: 'Create a user.' }),
    ApiBearerAuth(),
    ApiBody({ type: CreateUserSchemaDto }),
    ApiResponse({
      status: 201,
      description: 'User created successfully.',
    }),
    ApiResponse({
      status: 409,
      description:
        'Conflict - Either the email or the nickname already exists.',
      content: {
        'application/json': {
          examples: {
            emailConflict: {
              summary: 'Email already exists',
              value: { message: 'Email already exists.' },
            },
            nicknameConflict: {
              summary: 'Nickname already exists',
              value: { message: 'Nickname already exists.' },
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

export class CreateUserSchemaDto {
  @ApiProperty({
    example: 'admin@company.com',
    description: 'Email of the user.',
    type: String,
  })
  email!: string

  @ApiProperty({
    example: 'Lucas Camargo',
    description: 'Name of the user.',
    type: String,
  })
  name!: string

  @ApiProperty({
    example: 'lfqcamargo',
    description: 'Nickname of the user.',
    type: String,
  })
  nickname!: string

  @ApiProperty({
    example: '12345678',
    description: 'Password of the user.',
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
}
