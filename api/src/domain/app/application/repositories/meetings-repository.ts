import { Meeting } from '@/domain/app/enterprise/entities/meeting'

export abstract class MeetingsRepository {
  abstract create(meeting: Meeting): Promise<void>
  abstract findById(companyId: string, id: string): Promise<Meeting | null>

  abstract fetchScheduledTimes(
    companyId: string,
    roomId: string,
    startTime: Date | null,
    endTime: Date | null,
    page: number,
    itemsPerPage: number,
  ): Promise<{
    data: Meeting[] | null
    meta: {
      totalItems: number
      itemCount: number
      itemsPerPage: number
      totalPages: number
      currentPage: number
    }
  } | null>

  abstract save(meeting: Meeting): Promise<void>
  abstract delete(meeting: Meeting): Promise<void>
  abstract deleteByRoomId(companyId: string, roomId: string): Promise<void>
}
