import {
  BadRequestException,
  Controller,
  Get,
  HttpCode,
  NotFoundException,
  Query,
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
import { FetchRoomsByCompanyIdUseCase } from '@/domain/app/application/use-cases/fetch-rooms-by-company-id'
import { CurrentUser } from '@/infra/auth/current-user.decorator'
import { UserPayload } from '@/infra/auth/jwt.strategy'
import { RoomPresenter } from '@/infra/http/presenters/room-presenter'

import { ZodValidationPipe } from '../pipes/zod-validation-pipe'

const pageQueryParamSchema = z
  .string()
  .optional()
  .default('1')
  .transform(Number)
  .pipe(z.number().min(1))

const queryValidationPipe = new ZodValidationPipe(pageQueryParamSchema)

@Controller('/rooms')
@ApiTags('rooms')
@ApiBearerAuth()
export class FetchRoomsByCompanyIdController {
  constructor(
    private fetchRoomsByCompanyIdUseCase: FetchRoomsByCompanyIdUseCase,
  ) {}

  @Get()
  @HttpCode(200)
  @ApiOperation({ summary: 'Find a room by their unique ID.' })
  @ApiQuery({
    name: 'page',
    type: Number,
    required: false,
    description: 'Page number for pagination',
    example: 1,
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
              rooms: [
                {
                  companyId: '49352d02-d247-4913-909a-c5e71ad03b15',
                  id: 'c65bfb98-b288-40f5-a247-d7f604843e09',
                  name: 'Lucas Camargo',
                  active: true,
                },
              ],
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
    @Query('page', queryValidationPipe) page: number,
    @CurrentUser() user: UserPayload,
  ) {
    const userAuthenticateId = user.sub

    const result = await this.fetchRoomsByCompanyIdUseCase.execute({
      userAuthenticateId,
      page,
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

    const { rooms } = result.value

    return { rooms: rooms.map(RoomPresenter.toHTTP) }
  }
}
