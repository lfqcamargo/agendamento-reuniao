import { Room } from '@/domain/app/enterprise/entities/room'

export abstract class RoomRepository {
  abstract create(room: Room): Promise<void>
  abstract findById(id: string): Promise<Room | null>
  abstract findByName(companyId: string, name: string): Promise<Room | null>
  abstract fetchByCompany(
    companyId: string,
    page: number,
  ): Promise<Room[] | null>

  abstract save(room: Room): Promise<void>
  abstract delete(room: Room): Promise<void>
}
