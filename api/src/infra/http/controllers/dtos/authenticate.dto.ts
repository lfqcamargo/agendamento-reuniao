import { applyDecorators } from '@nestjs/common'
import {
  ApiBody,
  ApiOperation,
  ApiProperty,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger'

export const AuthenticateUserDocs = () => {
  return applyDecorators(
    ApiTags('users'),
    ApiOperation({ summary: 'Authenticate user and generate access token' }),
    ApiBody({ type: AuthenticateBodySchemaDto }),
    ApiResponse({
      status: 200,
      description: 'User authenticated successfully and access token generated',
      schema: {
        example: {
          access_token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
        },
      },
    }),
    ApiResponse({
      status: 401,
      description: 'Invalid credentials',
    }),
    ApiResponse({
      status: 400,
      description: 'Bad request - Invalid input data',
    }),
  )
}

class AuthenticateBodySchemaDto {
  @ApiProperty({
    example: 'lfqcamargo@gmail.com',
    description: 'Email of the user',
    type: String,
  })
  email!: string

  @ApiProperty({
    example: '123456789lfqcamargo',
    description: 'Password of the user',
    type: String,
  })
  password!: string
}
