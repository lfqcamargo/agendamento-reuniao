import { applyDecorators } from '@nestjs/common'
import {
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger'

export const FetchRoomsByCompanyIdDocs = () => {
  return applyDecorators(
    ApiTags('rooms'),
    ApiBearerAuth(),
    ApiOperation({
      summary: 'Fetch rooms by company ID with pagination.',
    }),
    ApiQuery({
      name: 'page',
      type: Number,
      description: 'Page number for pagination.',
      example: 1,
      required: false,
    }),
    ApiQuery({
      name: 'itemsPerPage',
      type: Number,
      description: 'Number of items per page.',
      example: 20,
      required: false,
    }),
    ApiResponse({
      status: 200,
      description: 'Rooms fetched successfully.',
      content: {
        'application/json': {
          examples: {
            roomsFound: {
              summary: 'Rooms found',
              value: {
                rooms: [
                  {
                    id: 'ba397f8f-487e-4bdc-9b7d-b397bb246e47',
                    name: 'Room 1',
                    active: true,
                  },
                ],
                meta: {
                  totalItems: 50,
                  itemCount: 20,
                  itemsPerPage: 20,
                  totalPages: 3,
                  currentPage: 1,
                },
              },
            },
          },
        },
      },
    }),
    ApiResponse({
      status: 404,
      description: 'Company or rooms not found.',
    }),
    ApiResponse({
      status: 401,
      description: 'Unauthorized.',
    }),
    ApiResponse({
      status: 400,
      description: 'Invalid request parameters.',
    }),
  )
}
