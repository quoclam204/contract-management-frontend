export interface Partner {
  id: string;
  name: string;
  taxCode: string;
  representative?: string;
  contactEmail?: string;
  address?: string;
  createdAt: string;
}

export interface PagedResult<T> {
  items: T[];
  totalCount: number;
  pageNumber: number;
  pageSize: number;
  totalPages: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}

export interface PartnerQueryParams {
  pageNumber?: number;
  pageSize?: number;
  searchTerm?: string;
}
