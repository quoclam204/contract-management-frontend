import React from 'react';
import { Eye, Pencil, Trash2, Building2, Inbox } from 'lucide-react';
import { Partner } from '../types/partner.types';
import { formatDate } from '@/lib/utils';

export interface PartnerTableProps {
  partners: Partner[];
  isLoading: boolean;
  onView?: (partner: Partner) => void;
  onEdit?: (partner: Partner) => void;
  onDelete?: (partner: Partner) => void;
}

export const PartnerTable: React.FC<PartnerTableProps> = ({
  partners,
  isLoading,
  onView,
  onEdit,
  onDelete,
}) => {
  return (
    <div className="w-full bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/80 border-b border-slate-200 text-xs font-semibold text-slate-600 tracking-wide uppercase">
              <th scope="col" className="py-3.5 px-4">Mã số thuế</th>
              <th scope="col" className="py-3.5 px-4">Tên đối tác</th>
              <th scope="col" className="py-3.5 px-4">Người đại diện</th>
              <th scope="col" className="py-3.5 px-4">Email liên hệ</th>
              <th scope="col" className="py-3.5 px-4">Địa chỉ</th>
              <th scope="col" className="py-3.5 px-4">Ngày tạo</th>
              <th scope="col" className="py-3.5 px-4 text-center">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-sm">
            {isLoading ? (
              // Skeleton Loading State
              Array.from({ length: 5 }).map((_, idx) => (
                <tr key={`skeleton-${idx}`} className="animate-pulse">
                  <td className="py-4 px-4">
                    <div className="h-4 w-24 bg-slate-200 rounded"></div>
                  </td>
                  <td className="py-4 px-4">
                    <div className="h-4 w-40 bg-slate-200 rounded mb-1"></div>
                    <div className="h-3 w-20 bg-slate-100 rounded"></div>
                  </td>
                  <td className="py-4 px-4">
                    <div className="h-4 w-28 bg-slate-200 rounded"></div>
                  </td>
                  <td className="py-4 px-4">
                    <div className="h-4 w-32 bg-slate-200 rounded"></div>
                  </td>
                  <td className="py-4 px-4">
                    <div className="h-4 w-48 bg-slate-200 rounded"></div>
                  </td>
                  <td className="py-4 px-4">
                    <div className="h-4 w-20 bg-slate-200 rounded"></div>
                  </td>
                  <td className="py-4 px-4 text-center">
                    <div className="inline-flex gap-1.5 justify-center">
                      <div className="h-7 w-7 bg-slate-200 rounded-lg"></div>
                      <div className="h-7 w-7 bg-slate-200 rounded-lg"></div>
                      <div className="h-7 w-7 bg-slate-200 rounded-lg"></div>
                    </div>
                  </td>
                </tr>
              ))
            ) : partners.length === 0 ? (
              // Empty State
              <tr>
                <td colSpan={7} className="py-12 px-4 text-center">
                  <div className="flex flex-col items-center justify-center text-slate-400">
                    <div className="p-3 bg-slate-100 rounded-full mb-3 text-slate-500">
                      <Inbox className="w-8 h-8 stroke-[1.5]" />
                    </div>
                    <p className="text-base font-semibold text-slate-700 mb-1">
                      Không tìm thấy đối tác nào phù hợp
                    </p>
                    <p className="text-xs text-slate-500 max-w-sm">
                      Chưa có dữ liệu đối tác hoặc không có kết quả nào khớp với điều kiện tìm kiếm hiện tại.
                    </p>
                  </div>
                </td>
              </tr>
            ) : (
              // Data Rows
              partners.map((partner) => (
                <tr
                  key={partner.id}
                  className="hover:bg-slate-50/70 transition-colors group"
                >
                  <td className="py-3.5 px-4 font-mono font-semibold text-xs text-slate-800 tracking-wider">
                    {partner.taxCode}
                  </td>
                  <td className="py-3.5 px-4 font-medium text-slate-900">
                    <div className="flex items-center gap-2">
                      <div className="p-1.5 rounded-lg bg-blue-50 text-blue-600 shrink-0 group-hover:bg-blue-100 transition-colors">
                        <Building2 className="w-4 h-4" />
                      </div>
                      <span className="truncate max-w-xs" title={partner.name}>
                        {partner.name}
                      </span>
                    </div>
                  </td>
                  <td className="py-3.5 px-4 text-slate-700">
                    {partner.representative || (
                      <span className="text-slate-400 italic text-xs">Chưa cập nhật</span>
                    )}
                  </td>
                  <td className="py-3.5 px-4 text-slate-600 text-xs">
                    {partner.contactEmail ? (
                      <a
                        href={`mailto:${partner.contactEmail}`}
                        className="text-blue-600 hover:underline inline-block truncate max-w-[180px]"
                        title={partner.contactEmail}
                      >
                        {partner.contactEmail}
                      </a>
                    ) : (
                      <span className="text-slate-400 italic">Chưa cập nhật</span>
                    )}
                  </td>
                  <td className="py-3.5 px-4 text-slate-600 text-xs">
                    <span className="line-clamp-1 max-w-[220px]" title={partner.address}>
                      {partner.address || (
                        <span className="text-slate-400 italic">Chưa cập nhật</span>
                      )}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-slate-600 text-xs whitespace-nowrap">
                    {formatDate(partner.createdAt)}
                  </td>
                  <td className="py-3.5 px-4 text-center whitespace-nowrap">
                    <div className="inline-flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => onView?.(partner)}
                        className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
                        title="Xem chi tiết"
                        aria-label={`Xem chi tiết ${partner.name}`}
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => onEdit?.(partner)}
                        className="p-1.5 text-slate-500 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors cursor-pointer"
                        title="Chỉnh sửa"
                        aria-label={`Chỉnh sửa ${partner.name}`}
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => onDelete?.(partner)}
                        className="p-1.5 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                        title="Xóa đối tác"
                        aria-label={`Xóa đối tác ${partner.name}`}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
