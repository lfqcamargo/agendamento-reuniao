import { ApiProperty } from '@nestjs/swagger'

export class CreateCompanyAndUserSchemaDto {
  @ApiProperty({
    example: '16877866000115',
    description: 'Company CNPJ',
    type: String,
  })
  cnpj!: string

  @ApiProperty({
    example: 'Tech Enterprise',
    description: 'Company name',
    type: String,
  })
  companyName!: string

  @ApiProperty({
    example: 'lfqcamargo@gmail.com',
    description: 'Admin user email',
    type: String,
  })
  email!: string

  @ApiProperty({
    example: 'lfqcamargo',
    description: 'Admin name',
    type: String,
  })
  name!: string

  @ApiProperty({
    example: 'lfqcamargo',
    description: 'Admin username',
    type: String,
  })
  userName!: string

  @ApiProperty({
    example: '123456789lfqcamargo',
    description: 'Admin user password',
    type: String,
  })
  password!: string
}
