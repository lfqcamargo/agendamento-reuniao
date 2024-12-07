import {
  BadRequestException,
  Controller,
  Get,
  HttpCode,
  NotFoundException,
} from '@nestjs/common'
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger'

import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'
import { GetProfileUseCase } from '@/domain/users/application/use-cases/get-profile'
import { CurrentUser } from '@/infra/auth/current-user.decorator'
import { UserPayload } from '@/infra/auth/jwt.strategy'
import { UserPresenter } from '@/infra/database/prisma/presenters/user-presenter'

@Controller('/me')
@ApiTags('users')
@ApiBearerAuth()
export class GetProfileController {
  constructor(private getProfileUseCase: GetProfileUseCase) {}

  @Get()
  @HttpCode(200)
  @ApiOperation({ summary: 'Find a profile user authenticated.' })
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
  async handle(@CurrentUser() user: UserPayload) {
    const userAuthenticateId = user.sub

    const result = await this.getProfileUseCase.execute({
      userAuthenticateId,
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
