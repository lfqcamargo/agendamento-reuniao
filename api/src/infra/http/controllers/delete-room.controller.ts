import {
  BadRequestException,
  Controller,
  Delete,
  HttpCode,
  Param,
  UnauthorizedException,
} from '@nestjs/common'
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger'
import { z } from 'zod'

import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'
import { UserNotAdminError } from '@/core/errors/user-not-admin'
import { UserNotCompanyError } from '@/core/errors/user-not-company'
import { DeleteRoomUseCase } from '@/domain/app/application/use-cases/delete-room'
import { CurrentUser } from '@/infra/auth/current-user.decorator'
import { UserPayload } from '@/infra/auth/jwt.strategy'

import { ZodValidationPipe } from '../pipes/zod-validation-pipe'

const deleteRoomSchema = z.object({
  id: z.string().uuid(),
})

type DeleteRoomSchema = z.infer<typeof deleteRoomSchema>

@Controller('/rooms/:id')
@ApiTags('rooms')
@ApiBearerAuth()
export class DeleteRoomController {
  constructor(private deleteRoomUseCase: DeleteRoomUseCase) {}

  @Delete()
  @HttpCode(204)
  @ApiOperation({ summary: 'Delete a room.' })
  @ApiParam({
    name: 'id',
    type: 'string',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiResponse({
    status: 204,
    description: 'Room deleted successfully.',
  })
  @ApiResponse({
    status: 404,
    description: 'Resource not found - User or room not found.',
  })
  @ApiResponse({
    status: 401,
    description:
      'Unauthorized - User is not an admin or not part of the company.',
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request - Invalid input data.',
  })
  async handle(
    @Param(new ZodValidationPipe(deleteRoomSchema)) param: DeleteRoomSchema,
    @CurrentUser()
    user: UserPayload,
  ) {
    const { id } = param
    const userId = user.sub

    const result = await this.deleteRoomUseCase.execute({ userId, roomId: id })

    if (result.isLeft()) {
      const error = result.value

      switch (error.constructor) {
        case ResourceNotFoundError:
          throw new BadRequestException(error.message)
        case UserNotAdminError:
          throw new UnauthorizedException(error.message)
        case UserNotCompanyError:
          throw new UnauthorizedException(error.message)
        default:
          throw new BadRequestException()
      }
    }
  }
}
