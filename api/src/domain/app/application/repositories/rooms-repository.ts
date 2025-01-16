import { Room } from '@/domain/app/enterprise/entities/room'

export abstract class RoomsRepository {
  abstract create(room: Room): Promise<void>
  abstract findById(companyId: string, id: string): Promise<Room | null>
  abstract findByName(companyId: string, name: string): Promise<Room | null>
  abstract fetchByCompanyId(
    companyId: string,
    page: number,
    itemsPerPage: number,
  ): Promise<{
    data: Room[] | null
    meta: {
      totalItems: number
      itemCount: number
      itemsPerPage: number
      totalPages: number
      currentPage: number
    }
  } | null>

  abstract save(room: Room): Promise<void>
  abstract delete(room: Room): Promise<void>
}
