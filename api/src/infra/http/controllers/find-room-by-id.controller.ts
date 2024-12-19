import {
  BadRequestException,
  Controller,
  Get,
  HttpCode,
  NotFoundException,
  Param,
} from '@nestjs/common'
import {
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger'
import { z } from 'zod'

import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'
import { FindRoomByIdUseCase } from '@/domain/app/application/use-cases/find-room-by-id'
import { CurrentUser } from '@/infra/auth/current-user.decorator'
import { UserPayload } from '@/infra/auth/jwt.strategy'
import { RoomPresenter } from '@/infra/http/presenters/room-presenter'

import { ZodValidationPipe } from '../pipes/zod-validation-pipe'

const roomQueryParamSchema = z.object({ id: z.string().uuid() })

type QueryValidationPipe = z.infer<typeof roomQueryParamSchema>

@Controller('/rooms/:id')
@ApiTags('rooms')
@ApiBearerAuth()
export class FindRoomByIdController {
  constructor(private findRoomByIdUseCase: FindRoomByIdUseCase) {}

  @Get()
  @HttpCode(200)
  @ApiOperation({ summary: 'Find a room by their unique ID.' })
  @ApiQuery({
    name: 'id',
    type: 'string',
    description: 'Unique identifier of the room',
    example: 'ba397f8f-487e-4bdc-9b7d-b397bb246e47',
  })
  @ApiResponse({
    status: 200,
    description: 'Room found successfully.',
    content: {
      'application/json': {
        examples: {
          roomFound: {
            summary: 'Room found',
            value: {
              rooms: {
                companyId: '49352d02-d247-4913-909a-c5e71ad03b15',
                id: 'c65bfb98-b288-40f5-a247-d7f604843e09',
                name: 'Lucas Camargo',
                active: true,
              },
            },
          },
        },
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Not Found - The requested room does not exist.',
    content: {
      'application/json': {
        examples: {
          roomNotFound: {
            summary: 'Room not found',
            value: { message: 'Room not found.' },
          },
        },
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Invalid or missing authentication.',
    content: {
      'application/json': {
        examples: {
          unauthorized: {
            summary: 'Unauthorized',
            value: { message: 'Unauthorized.' },
          },
        },
      },
    },
  })
  async handle(
    @Param(new ZodValidationPipe(roomQueryParamSchema))
    params: QueryValidationPipe,
    @CurrentUser()
    user: UserPayload,
  ) {
    const userAuthenticateId = user.sub
    const { id } = params
    const result = await this.findRoomByIdUseCase.execute({
      userAuthenticateId,
      id,
    })

    if (result.isLeft()) {
      const error = result.value

      switch (error.constructor) {
        case ResourceNotFoundError:
          throw new NotFoundException(error.message)
        default:
          throw new BadRequestException(error.message)
      }
    }

    return { room: RoomPresenter.toHTTP(result.value.room) }
  }
}
