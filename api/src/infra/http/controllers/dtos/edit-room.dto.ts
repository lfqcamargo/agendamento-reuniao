import { ApiProperty } from '@nestjs/swagger'

export class EditRoomSchemaDto {
  @ApiProperty({
    example: 'Room 1',
    description: 'Room name',
    type: String,
  })
  name!: string

  @ApiProperty({
    example: 'true',
    description: 'Room active',
    type: Number,
  })
  active!: number
}
