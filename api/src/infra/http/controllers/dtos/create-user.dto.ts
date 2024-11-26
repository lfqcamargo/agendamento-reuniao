import { ApiProperty } from '@nestjs/swagger'

export class CreateUserSchemaDto {
  @ApiProperty({
    example: 'lfqcamargo@gmail.com',
    description: 'User email',
    type: String,
  })
  email!: string

  @ApiProperty({
    example: 'lfqcamargo',
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
}
