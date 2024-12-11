import {
  BadRequestException,
  Body,
  ConflictException,
  Controller,
  ForbiddenException,
  HttpCode,
  NotFoundException,
  Put,
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
import { EditUserUseCase } from '@/domain/users/application/use-cases/edit-user'
import { AlreadyExistsNicknameError } from '@/domain/users/application/use-cases/errors/already-exists-nickname-error'
import { InvalidRoleError } from '@/domain/users/application/use-cases/errors/invalid-role-error'
import { MissingAdminError } from '@/domain/users/application/use-cases/errors/missing-admin'
import { CurrentUser } from '@/infra/auth/current-user.decorator'
import { UserPayload } from '@/infra/auth/jwt.strategy'

import { ZodValidationPipe } from '../pipes/zod-validation-pipe'
import { EditUserSchemaDto } from './dtos/edit-user.dto'

const editUserSchema = z.object({
  id: z.string().uuid(),
  name: z.string().max(50).optional(),
  nickname: z.string().max(20).optional(),
  password: z.string().max(20).optional(),
  role: z.number().optional(),
  active: z.boolean().optional(),
})

type EditUserSchema = z.infer<typeof editUserSchema>

@Controller('/users')
@ApiTags('users')
@ApiBearerAuth()
export class EditUserController {
  constructor(private editUserUseCase: EditUserUseCase) {}

  @Put()
  @HttpCode(200)
  @ApiOperation({ summary: 'Edit an existing user in the company.' })
  @ApiBody({ type: EditUserSchemaDto })
  @ApiResponse({
    status: 200,
    description: 'User edited successfully.',
  })
  @ApiResponse({
    status: 409,
    description: 'Conflict - The nickname already exists.',
    content: {
      'application/json': {
        examples: {
          nicknameConflict: {
            summary: 'Nickname already exists',
            value: { message: 'Nickname already exists.' },
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
    status: 403,
    description:
      'Forbidden - User lacks permissions for the requested operation.',
    content: {
      'application/json': {
        examples: {
          forbidden: {
            summary: 'Operation not allowed',
            value: {
              message: 'You are not authorized to perform this action.',
            },
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
  @ApiResponse({
    status: 400,
    description: 'Bad Request - Invalid input data or business rule violation.',
    content: {
      'application/json': {
        examples: {
          invalidInput: {
            summary: 'Invalid input data',
            value: { message: 'Role must be either 1 or 2.' },
          },
          missingAdmin: {
            summary: 'Missing admin in the company',
            value: { message: 'Cannot remove the last admin.' },
          },
        },
      },
    },
  })
  async handle(
    @Body(new ZodValidationPipe(editUserSchema))
    body: EditUserSchema,
    @CurrentUser() user: UserPayload,
  ) {
    const { id, name, nickname, password, role, active } = body
    const userAuthenticateId = user.sub

    const result = await this.editUserUseCase.execute({
      userAuthenticateId,
      id,
      name,
      nickname,
      password,
      role,
      active,
    })

    if (result.isLeft()) {
      const error = result.value

      switch (error.constructor) {
        case AlreadyExistsNicknameError:
          throw new ConflictException(error.message)
        case ResourceNotFoundError:
          throw new NotFoundException(error.message)
        case SystemDoesNotAllowError:
          throw new ForbiddenException(error.message)
        case InvalidRoleError:
          throw new BadRequestException(error.message)
        case MissingAdminError:
          throw new BadRequestException(error.message)
        default:
          throw new BadRequestException(error.message)
      }
    }
  }
}
