import { RoomScheduling } from '@/domain/app/enterprise/entities/room-scheduling'

export class RoomSchedulingPresenter {
  static toHTTP(roomscheduling: RoomScheduling) {
    return {
      companyId: roomscheduling.companyId.toString(),
      id: roomscheduling.id.toString(),
      creatorId: roomscheduling.creatorId.toString(),
      roomId: roomscheduling.roomId.toString(),
      startTime: roomscheduling.startTime,
      endTime: roomscheduling.endTime,
    }
  }
}
