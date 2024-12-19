import { ApiProperty } from '@nestjs/swagger'

export class CreateRoomSchemaDto {
  @ApiProperty({
    example: 'Room 1',
    description: 'Room name',
    type: String,
  })
  name!: string

  @ApiProperty({
    example: true,
    description: 'Active room',
    type: Boolean,
  })
  active!: boolean
}
