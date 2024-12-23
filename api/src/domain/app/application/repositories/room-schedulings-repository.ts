import { RoomScheduling } from '@/domain/app/enterprise/entities/room-scheduling'

export abstract class RoomSchedulingsRepository {
  abstract create(roomscheduling: RoomScheduling): Promise<void>
  abstract findById(
    companyId: string,
    id: string,
  ): Promise<RoomScheduling | null>

  abstract fetchScheduledTimes(
    companyId: string,
    roomId: string,
    startTime: Date | null,
    endTime: Date | null,
  ): Promise<RoomScheduling[] | null>

  abstract save(roomscheduling: RoomScheduling): Promise<void>
  abstract delete(roomscheduling: RoomScheduling): Promise<void>
  abstract deleteByRoomId(companyId: string, roomId: string): Promise<void>
}
