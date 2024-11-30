import { ApiProperty } from '@nestjs/swagger'

export class EditUserSchemaDto {
  @ApiProperty({
    example: 'ba397f8f-487e-4bdc-9b7d-b397bb246e47',
    description: 'User id',
    type: String,
  })
  id!: string

  @ApiProperty({
    example: 'Lucas Camargo',
    description: 'User name',
    type: String,
  })
  name!: string

  @ApiProperty({
    example: 'lfqcamargo',
    description: 'User nickname',
    type: String,
  })
  nickname!: string

  @ApiProperty({
    example: '123456789lfqcamargo',
    description: 'User password',
    type: String,
  })
  password!: string

  @ApiProperty({
    example: '1',
    description: 'User permission level',
    type: Number,
  })
  role!: number

  @ApiProperty({
    example: 'true',
    description: 'User active',
    type: Number,
  })
  active!: number
}
