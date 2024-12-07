import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  ForbiddenException,
  HttpCode,
  NotFoundException,
} from '@nestjs/common'
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger'
import { z } from 'zod'

import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'
import { SystemDoesNotAllowError } from '@/core/errors/system-does-not-allow'
import { UserNotAdminError } from '@/core/errors/user-not-admin'
import { UserNotCompanyError } from '@/core/errors/user-not-company'
import { DeleteUserUseCase } from '@/domain/users/application/use-cases/delete-user'
import { CurrentUser } from '@/infra/auth/current-user.decorator'
import { UserPayload } from '@/infra/auth/jwt.strategy'

import { ZodValidationPipe } from '../pipes/zod-validation-pipe'
import { DeleteUserSchemaDto } from './dtos/delete-user.dto'

const deleteUserSchema = z.object({
  id: z.string().uuid(),
})

type DeleteUserSchema = z.infer<typeof deleteUserSchema>

@Controller('/users')
@ApiTags('users')
@ApiBearerAuth()
export class DeleteUserController {
  constructor(private deleteUserUseCase: DeleteUserUseCase) {}

  @Delete()
  @HttpCode(200)
  @ApiOperation({ summary: 'Delete an existing user in the company.' })
  @ApiBody({ type: DeleteUserSchemaDto })
  @ApiResponse({
    status: 200,
    description: 'User deleteed successfully.',
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
    status: 403,
    description: 'Forbidden - Operation not allowed by the system or user.',
    content: {
      'application/json': {
        examples: {
          systemNotAllow: {
            summary: 'System Does Not Allow',
            value: {
              message:
                'The system does not allow this operation at the moment.',
            },
          },
          userNotCompany: {
            summary: 'User Not Associated with Company',
            value: {
              message: 'User is not associated with the company.',
            },
          },
        },
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request - Validation errors or user is not an admin.',
    content: {
      'application/json': {
        examples: {
          validationError: {
            summary: 'Validation Error',
            value: { message: 'Invalid input data.' },
          },
          userNotAdmin: {
            summary: 'User Not Admin',
            value: { message: 'User is not an admin and cannot delete users.' },
          },
        },
      },
    },
  })
  async handle(
    @Body(new ZodValidationPipe(deleteUserSchema))
    body: DeleteUserSchema,
    @CurrentUser() user: UserPayload,
  ) {
    const { id } = body
    const userAuthenticateId = user.sub

    const result = await this.deleteUserUseCase.execute({
      userAuthenticateId,
      id,
    })

    if (result.isLeft()) {
      const error = result.value

      switch (error.constructor) {
        case ResourceNotFoundError:
          throw new NotFoundException(error.message)
        case UserNotAdminError:
          throw new BadRequestException(error.message)
        case SystemDoesNotAllowError:
          throw new ForbiddenException(error.message)
        case UserNotCompanyError:
          throw new ForbiddenException(error.message)
        default:
          throw new BadRequestException(error.message)
      }
    }
  }
}
