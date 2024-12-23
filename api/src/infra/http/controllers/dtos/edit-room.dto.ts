import { applyDecorators } from '@nestjs/common'
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiProperty,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger'

export const EditRoomDocs = () => {
  return applyDecorators(
    ApiTags('rooms'),
    ApiBearerAuth(),
    ApiOperation({ summary: 'Edit a new room.' }),
    ApiBody({ type: EditRoomSchemaDto }),
    ApiResponse({
      status: 201,
      description: 'Room editd successfully.',
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

class EditRoomSchemaDto {
  @ApiProperty({
    example: 'Room 1',
    description: 'Room name',
    type: String,
  })
  name!: string

  @ApiProperty({
    example: 'true',
    description: 'Room active',
    type: Number,
  })
  active!: number
}
