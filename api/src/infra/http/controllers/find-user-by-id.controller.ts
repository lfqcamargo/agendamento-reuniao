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
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger'
import { z } from 'zod'

import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'
import { FindUserByIdUseCase } from '@/domain/users/application/use-cases/find-user-by-id'
import { CurrentUser } from '@/infra/auth/current-user.decorator'
import { UserPayload } from '@/infra/auth/jwt.strategy'
import { UserPresenter } from '@/infra/database/prisma/presenters/user-presenter'

import { ZodValidationPipe } from '../pipes/zod-validation-pipe'

const findUserByIdSchema = z.object({
  id: z.string().uuid(),
})

type FindUserByIdSchema = z.infer<typeof findUserByIdSchema>

@Controller('/users/:id')
@ApiTags('users')
@ApiBearerAuth()
export class FindUserByIdController {
  constructor(private findUserByIdUseCase: FindUserByIdUseCase) {}

  @Get()
  @HttpCode(200)
  @ApiOperation({ summary: 'Find a user by their unique ID.' })
  @ApiParam({
    name: 'id',
    type: 'string',
    description: 'Unique identifier of the user',
    example: 'ba397f8f-487e-4bdc-9b7d-b397bb246e47',
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
              id: 'ba397f8f-487e-4bdc-9b7d-b397bb246e47',
              name: 'Lucas Camargo',
              email: 'lfqcamargo@gmail.com',
              role: 1,
              active: true,
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
    @Param(new ZodValidationPipe(findUserByIdSchema))
    params: FindUserByIdSchema,
    @CurrentUser() user: UserPayload,
  ) {
    const userAuthenticateId = user.sub
    const { id } = params

    const result = await this.findUserByIdUseCase.execute({
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

    return { user: UserPresenter.toHTTP(result.value.user) }
  }
}
