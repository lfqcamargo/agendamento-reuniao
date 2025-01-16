import { applyDecorators } from '@nestjs/common'
import {
  ApiBody,
  ApiOperation,
  ApiProperty,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger'

import { UserRole } from '@/domain/users/enterprise/entities/user'

export const CreateCompanyAndUserDocs = () => {
  return applyDecorators(
    ApiTags('users'),
    ApiOperation({
      summary: 'Create the company and register the admin user.',
    }),
    ApiBody({ type: CreateCompanyAndUserDto }),
    ApiResponse({
      status: 201,
      description: 'Company and user admin created successfully.',
    }),
    ApiResponse({
      status: 409,
      description: 'Conflict - Either the email or the CNPJ already exists.',
      content: {
        'application/json': {
          examples: {
            emailConflict: {
              summary: 'Email already exists',
              value: { message: 'Email already exists.' },
            },
            cnpjConflict: {
              summary: 'CNPJ already exists',
              value: { message: 'CNPJ already exists.' },
            },
          },
        },
      },
    }),
    ApiResponse({
      status: 400,
      description: 'Bad Request - Invalid input data.',
    }),
  )
}

class CreateCompanyAndUserDto {
  @ApiProperty({
    example: 'lfqcamargo@gmail.com',
    description: 'User email',
    type: String,
  })
  email!: string

  @ApiProperty({
    example: 'lfqcamargo',
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
}
