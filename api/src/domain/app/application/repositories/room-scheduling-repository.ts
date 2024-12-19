import { RoomScheduling } from '@/domain/app/enterprise/entities/room-scheduling'

export abstract class RoomSchedulingRepository {
  abstract create(roomscheduling: RoomScheduling): Promise<void>
  abstract findById(id: string): Promise<RoomScheduling | null>
  abstract fetchScheduledTimes(
    companyId: string,
    roomId: string,
    startTime: Date | null,
    endTime: Date | null,
  ): Promise<RoomScheduling[] | null>

  abstract save(roomscheduling: RoomScheduling): Promise<void>
  abstract delete(roomscheduling: RoomScheduling): Promise<void>
}
