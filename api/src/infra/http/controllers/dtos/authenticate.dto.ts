import { ApiProperty } from '@nestjs/swagger'

export class AuthenticateBodySchemaDto {
  @ApiProperty({
    example: 'lfqcamargo@gmail.com',
    description: 'Email of the user',
    type: String,
  })
  email!: string

  @ApiProperty({
    example: '123456',
    description: 'Password of the user',
    type: String,
  })
  password!: string
}
