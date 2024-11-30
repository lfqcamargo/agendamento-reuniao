import { ApiProperty } from '@nestjs/swagger'

export class DeleteUserSchemaDto {
  @ApiProperty({
    example: 'ba397f8f-487e-4bdc-9b7d-b397bb246e47',
    description: 'User id',
    type: String,
  })
  id!: string
}
