import {
  BadRequestException,
  Body,
  ConflictException,
  Controller,
  ForbiddenException,
  HttpCode,
  NotFoundException,
  Param,
  Put,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common'
import { FileFieldsInterceptor } from '@nestjs/platform-express'
import { z } from 'zod'

import { AlreadyExistsError } from '@/core/errors/already-exists-error'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'
import { SystemDoesNotAllowError } from '@/core/errors/system-does-not-allow'
import { EditUserUseCase } from '@/domain/users/application/use-cases/edit-user'
import { CurrentUser } from '@/infra/auth/current-user.decorator'
import { UserPayload } from '@/infra/auth/jwt.strategy'

import { ZodValidationPipe } from '../pipes/zod-validation-pipe'
import { EditUserDocs } from './dtos/edit-user.dto'

const editUserParam = z.object({
  userId: z.string().uuid(),
})

type EditUserParam = z.infer<typeof editUserParam>

const editUserSchema = z.object({
  name: z.string().max(50).optional(),
  nickname: z.string().max(20).optional(),
  password: z.string().max(20).optional(),
  role: z.coerce.number().optional(),
  active: z.coerce.boolean().optional(),
  profilePhoto: z.instanceof(Buffer).optional().nullable(),
})

type EditUserSchema = z.infer<typeof editUserSchema>

@Controller('/users')
export class EditUserController {
  constructor(private editUserUseCase: EditUserUseCase) {}

  @Put(':userId')
  @HttpCode(204)
  @UseInterceptors(
    FileFieldsInterceptor([{ name: 'profilePhoto', maxCount: 1 }]),
  )
  @EditUserDocs()
  async handle(
    @CurrentUser() user: UserPayload,
    @Param(new ZodValidationPipe(editUserParam)) params: EditUserParam,
    @Body(new ZodValidationPipe(editUserSchema))
    body: EditUserSchema,
    @UploadedFiles()
    files: { profilePhoto?: Express.Multer.File[] },
  ) {
    const { company: companyId, sub: userAuthenticateId } = user
    const { userId } = params

    const profilePhoto = files.profilePhoto
      ? files.profilePhoto[0]?.buffer
      : null

    const { name, nickname, password, role, active } = body

    const result = await this.editUserUseCase.execute({
      companyId,
      userAuthenticateId,
      userId,
      name,
      nickname,
      password,
      role,
      active,
      profilePhoto,
    })

    if (result.isLeft()) {
      const error = result.value

      switch (error.constructor) {
        case AlreadyExistsError:
          throw new ConflictException(error.message)
        case ResourceNotFoundError:
          throw new NotFoundException(error.message)
        case SystemDoesNotAllowError:
          throw new ForbiddenException(error.message)
        default:
          throw new BadRequestException(error.message)
      }
    }
  }
}
