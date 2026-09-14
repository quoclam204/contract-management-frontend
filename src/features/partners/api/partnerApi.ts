import { apiClient, ApiError } from '@/api/client';
import { Partner, PagedResult, PartnerQueryParams } from '../types/partner.types';

export async function getPartners(
  params: PartnerQueryParams = {}
): Promise<PagedResult<Partner>> {
  try {
    const searchParams = new URLSearchParams();

    if (params.pageNumber !== undefined && params.pageNumber > 0) {
      searchParams.append('pageNumber', params.pageNumber.toString());
    }
    if (params.pageSize !== undefined && params.pageSize > 0) {
      searchParams.append('pageSize', params.pageSize.toString());
    }
    if (params.searchTerm && params.searchTerm.trim() !== '') {
      searchParams.append('searchTerm', params.searchTerm.trim());
    }

    const queryString = searchParams.toString() ? `?${searchParams.toString()}` : '';
    const endpoint = `/api/v1/partners${queryString}`;

    const data = await apiClient.get<PagedResult<Partner>>(endpoint);

    return {
      items: Array.isArray(data?.items) ? data.items : [],
      totalCount: typeof data?.totalCount === 'number' ? data.totalCount : 0,
      pageNumber: typeof data?.pageNumber === 'number' ? data.pageNumber : (params.pageNumber ?? 1),
      pageSize: typeof data?.pageSize === 'number' ? data.pageSize : (params.pageSize ?? 10),
      totalPages: typeof data?.totalPages === 'number' ? data.totalPages : 1,
      hasPreviousPage: Boolean(data?.hasPreviousPage),
      hasNextPage: Boolean(data?.hasNextPage),
    };
  } catch (error: unknown) {
    if (error instanceof ApiError) {
      throw new Error(`Lỗi máy chủ (${error.status}): ${error.message}`);
    }

    if (error instanceof TypeError && error.message.includes('fetch')) {
      throw new Error(
        'Không thể kết nối đến máy chủ backend (kết nối thất bại). Vui lòng đảm bảo dịch vụ API đang hoạt động.'
      );
    }

    if (error instanceof Error) {
      throw new Error(error.message || 'Không thể tải danh sách đối tác. Vui lòng thử lại sau.');
    }

    throw new Error('Đã xảy ra lỗi không xác định khi tải dữ liệu đối tác.');
  }
}
