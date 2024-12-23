import { applyDecorators } from '@nestjs/common'
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiProperty,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger'

export const CreateRoomDocs = () => {
  return applyDecorators(
    ApiTags('rooms'),
    ApiBearerAuth(),
    ApiOperation({ summary: 'Create a new room.' }),
    ApiBody({ type: CreateRoomSchemaDto }),
    ApiResponse({
      status: 201,
      description: 'Room created successfully.',
    }),
    ApiResponse({
      status: 409,
      description: 'Conflict - Room name already exists.',
    }),
    ApiResponse({
      status: 404,
      description: 'Resource not found - User not found.',
    }),
    ApiResponse({
      status: 403,
      description: 'User not admin.',
    }),
    ApiResponse({
      status: 401,
      description: 'Unauthorized - User is not an admin.',
    }),
    ApiResponse({
      status: 400,
      description: 'Bad Request - Invalid input data.',
    }),
  )
}

class CreateRoomSchemaDto {
  @ApiProperty({
    example: 'Room 1',
    description: 'Room name',
    type: String,
  })
  name!: string

  @ApiProperty({
    example: true,
    description: 'Active room',
    type: Boolean,
  })
  active!: boolean
}
