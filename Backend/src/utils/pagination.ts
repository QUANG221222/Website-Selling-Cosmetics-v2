export interface PaginationParams {
  page: number
  limit: number
}

export interface PaginatedResponse<T> {
  data: T[]
  pagination: {
    currentPage: number
    totalPages: number
    totalItems: number
    itemsPerPage: number
    hasNextPage: boolean
    hasPrevPage: boolean
  }
}

export const calculatePagination = (
  totalItems: number,
  page: number,
  limit: number
) => {
  const totalPages = Math.ceil(totalItems / limit)
  const skip = (page - 1) * limit

  return {
    skip,
    limit,
    currentPage: page,
    totalPages,
    totalItems,
    hasNextPage: page < totalPages,
    hasPrevPage: page > 1
  }
}