import {
  BadRequestException,
  Controller,
  Get,
  HttpCode,
  NotFoundException,
  Query,
} from '@nestjs/common'
import { z } from 'zod'

import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'
import { FetchRoomsByCompanyIdUseCase } from '@/domain/app/application/use-cases/fetch-rooms-by-company-id'
import { CurrentUser } from '@/infra/auth/current-user.decorator'
import { UserPayload } from '@/infra/auth/jwt.strategy'
import { RoomPresenter } from '@/infra/http/presenters/room-presenter'

import { ZodValidationPipe } from '../pipes/zod-validation-pipe'
import { FetchRoomsByCompanyIdDocs } from './dtos/fetch-rooms-by-company-id.dto'

const pageQueryParamSchema = z.object({
  page: z
    .string()
    .optional()
    .default('1')
    .transform(Number)
    .pipe(z.number().min(1)),
  itemsPerPage: z
    .string()
    .optional()
    .default('20')
    .transform(Number)
    .pipe(z.number().min(1).max(100)),
})

const queryValidationPipe = new ZodValidationPipe(pageQueryParamSchema)

@Controller('/rooms')
export class FetchRoomsByCompanyIdController {
  constructor(
    private fetchRoomsByCompanyIdUseCase: FetchRoomsByCompanyIdUseCase,
  ) {}

  @Get()
  @HttpCode(200)
  @FetchRoomsByCompanyIdDocs()
  async handle(
    @Query(queryValidationPipe) query: { page: number; itemsPerPage: number },
    @CurrentUser() user: UserPayload,
  ) {
    const companyId = user.company
    const { page, itemsPerPage } = query

    const result = await this.fetchRoomsByCompanyIdUseCase.execute({
      companyId,
      page,
      itemsPerPage,
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

    const { rooms, meta } = result.value

    return {
      rooms: rooms.map(RoomPresenter.toHTTP),
      meta,
    }
  }
}
