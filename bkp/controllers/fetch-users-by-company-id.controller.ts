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
import { FetchUsersByCompanyIdUseCase } from '@/domain/users/application/use-cases/fetch-users-by-company-id'
import { CurrentUser } from '@/infra/auth/current-user.decorator'
import { UserPayload } from '@/infra/auth/jwt.strategy'
import { UserPresenter } from '@/infra/database/prisma/presenters/user-presenter'

import { ZodValidationPipe } from '../pipes/zod-validation-pipe'

const pageQueryParamSchema = z
  .string()
  .optional()
  .default('1')
  .transform(Number)
  .pipe(z.number().min(1))

const queryValidationPipe = new ZodValidationPipe(pageQueryParamSchema)

@Controller('/users')
@ApiTags('users')
@ApiBearerAuth()
export class FetchUsersByCompanyIdController {
  constructor(
    private fetchUsersByCompanyIdUseCase: FetchUsersByCompanyIdUseCase,
  ) {}

  @Get()
  @HttpCode(200)
  @ApiOperation({ summary: 'Find a user by their unique ID.' })
  @ApiQuery({
    name: 'page',
    type: Number,
    required: false,
    description: 'Page number for pagination',
    example: 1,
  })
  @ApiResponse({
    status: 200,
    description: 'User found successfully.',
    content: {
      'application/json': {
        examples: {
          userFound: {
            summary: 'User found',
            value: {
              users: [
                {
                  companyId: '49352d02-d247-4913-909a-c5e71ad03b15',
                  id: 'c65bfb98-b288-40f5-a247-d7f604843e09',
                  email: 'lfqcamargo@gmail.com.br',
                  name: 'Lucas Camargo',
                  nickname: 'lfqcamargo',
                  role: 1,
                  active: true,
                  createdAt: '2024-12-07T00:56:03.479Z',
                  lastLogin: null,
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
    description: 'Not Found - The requested user does not exist.',
    content: {
      'application/json': {
        examples: {
          userNotFound: {
            summary: 'User not found',
            value: { message: 'User not found.' },
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

    const result = await this.fetchUsersByCompanyIdUseCase.execute({
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

    const { users } = result.value

    return { users: users.map(UserPresenter.toHTTP) }
  }
}
