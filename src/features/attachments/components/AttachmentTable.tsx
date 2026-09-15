import React from 'react';
import {
  FileText,
  FileSpreadsheet,
  Image as ImageIcon,
  File,
  Download,
  UploadCloud,
  History,
  Trash2,
  Inbox,
} from 'lucide-react';
import { Attachment } from '../types/attachment.types';
import { formatFileSize, getFileTypeMetadata } from '../utils/attachment.utils';
import { formatDate } from '@/lib/utils';
import { Badge } from '@/components/ui/Badge';

export interface AttachmentTableProps {
  attachments: Attachment[];
  isLoading: boolean;
  onDownload: (attachment: Attachment) => void;
  onUploadNewVersion: (attachment: Attachment) => void;
  onViewHistory: (attachment: Attachment) => void;
  onDelete: (attachment: Attachment) => void;
}

export const AttachmentTable: React.FC<AttachmentTableProps> = ({
  attachments,
  isLoading,
  onDownload,
  onUploadNewVersion,
  onViewHistory,
  onDelete,
}) => {
  const renderFileIcon = (fileType: string) => {
    const meta = getFileTypeMetadata(fileType);
    return (
      <div
        className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${meta.bgColor} transition-transform group-hover:scale-105`}
      >
        {meta.label === 'PDF' && <FileText className={`w-4 h-4 ${meta.iconColor}`} />}
        {meta.label === 'DOCX' && <FileText className={`w-4 h-4 ${meta.iconColor}`} />}
        {meta.label === 'XLSX' && <FileSpreadsheet className={`w-4 h-4 ${meta.iconColor}`} />}
        {meta.label === 'IMAGE' && <ImageIcon className={`w-4 h-4 ${meta.iconColor}`} />}
        {!['PDF', 'DOCX', 'XLSX', 'IMAGE'].includes(meta.label) && (
          <File className="w-4 h-4 text-slate-500" />
        )}
      </div>
    );
  };

  return (
    <div className="w-full bg-white border border-slate-200 rounded-2xl shadow-xs overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/80 border-b border-slate-200 text-xs font-semibold text-slate-600 tracking-wider uppercase">
              <th scope="col" className="py-3.5 px-4">Tên tệp</th>
              <th scope="col" className="py-3.5 px-4">Loại tệp</th>
              <th scope="col" className="py-3.5 px-4">Dung lượng</th>
              <th scope="col" className="py-3.5 px-4 text-center">Phiên bản</th>
              <th scope="col" className="py-3.5 px-4">Người tải lên</th>
              <th scope="col" className="py-3.5 px-4">Ngày tạo</th>
              <th scope="col" className="py-3.5 px-4 text-center">Thao tác</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100 text-sm">
            {isLoading ? (
              // Skeleton Loading State
              Array.from({ length: 4 }).map((_, idx) => (
                <tr key={`skeleton-att-${idx}`} className="animate-pulse">
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 bg-slate-200 rounded-xl"></div>
                      <div className="space-y-1.5">
                        <div className="h-4 w-44 bg-slate-200 rounded"></div>
                        <div className="h-3 w-28 bg-slate-100 rounded"></div>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <div className="h-5 w-14 bg-slate-200 rounded-full"></div>
                  </td>
                  <td className="py-4 px-4">
                    <div className="h-4 w-16 bg-slate-200 rounded"></div>
                  </td>
                  <td className="py-4 px-4 text-center">
                    <div className="h-5 w-10 bg-slate-200 rounded-full mx-auto"></div>
                  </td>
                  <td className="py-4 px-4">
                    <div className="h-4 w-28 bg-slate-200 rounded"></div>
                  </td>
                  <td className="py-4 px-4">
                    <div className="h-4 w-24 bg-slate-200 rounded"></div>
                  </td>
                  <td className="py-4 px-4 text-center">
                    <div className="inline-flex gap-1.5 justify-center">
                      <div className="h-8 w-8 bg-slate-200 rounded-lg"></div>
                      <div className="h-8 w-8 bg-slate-200 rounded-lg"></div>
                      <div className="h-8 w-8 bg-slate-200 rounded-lg"></div>
                      <div className="h-8 w-8 bg-slate-200 rounded-lg"></div>
                    </div>
                  </td>
                </tr>
              ))
            ) : attachments.length === 0 ? (
              // Empty State
              <tr>
                <td colSpan={7} className="py-14 px-4 text-center">
                  <div className="flex flex-col items-center justify-center text-slate-400">
                    <div className="p-3.5 bg-slate-100 rounded-2xl mb-3 text-slate-500">
                      <Inbox className="w-8 h-8 stroke-[1.5]" />
                    </div>
                    <p className="text-base font-semibold text-slate-700 mb-1">
                      Chưa có tệp đính kèm nào
                    </p>
                    <p className="text-xs text-slate-500 max-w-sm">
                      Kéo thả tệp vào vùng upload phía trên hoặc thay đổi bộ lọc tìm kiếm để xem danh sách tài liệu.
                    </p>
                  </div>
                </td>
              </tr>
            ) : (
              // Data Rows
              attachments.map((item) => {
                const meta = getFileTypeMetadata(item.fileName || item.fileType);
                const versionCount = item.versions?.length || 1;

                return (
                  <tr
                    key={item.id}
                    className="hover:bg-slate-50/70 transition-colors group"
                  >
                    {/* Tên tệp */}
                    <td className="py-3.5 px-4 font-medium text-slate-900">
                      <div className="flex items-center gap-3">
                        {renderFileIcon(item.fileName || item.fileType)}
                        <div className="min-w-0 max-w-xs">
                          <p
                            className="font-semibold text-slate-900 truncate hover:text-blue-600 transition-colors cursor-pointer"
                            title={item.fileName}
                            onClick={() => onDownload(item)}
                          >
                            {item.fileName}
                          </p>
                          <div className="flex items-center gap-1 text-xs text-slate-500 truncate mt-0.5">
                            <span className="font-mono text-[11px] text-blue-700 bg-blue-50 px-1.5 py-0.2 rounded border border-blue-100">
                              {item.contractNumber || 'HĐ'}
                            </span>
                            <span className="truncate" title={item.contractTitle}>
                              {item.contractTitle || 'Hợp đồng liên kết'}
                            </span>
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Loại tệp */}
                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-semibold border ${meta.badgeBg} ${meta.badgeText} ${meta.badgeBorder}`}
                      >
                        {meta.label}
                      </span>
                    </td>

                    {/* Dung lượng */}
                    <td className="py-3.5 px-4 text-xs font-mono text-slate-600 whitespace-nowrap">
                      {formatFileSize(item.fileSize)}
                    </td>

                    {/* Phiên bản */}
                    <td className="py-3.5 px-4 text-center whitespace-nowrap">
                      <button
                        type="button"
                        onClick={() => onViewHistory(item)}
                        className="inline-flex items-center gap-1 cursor-pointer group/badge"
                        title={`Bấm để xem lịch sử (${versionCount} phiên bản)`}
                      >
                        <Badge
                          variant="info"
                          className="font-mono font-bold hover:bg-blue-100 transition-colors"
                        >
                          {item.versionString || `v${item.currentVersion || 1}`}
                        </Badge>
                        {versionCount > 1 && (
                          <span className="text-[11px] text-slate-400 group-hover/badge:text-blue-600">
                            ({versionCount})
                          </span>
                        )}
                      </button>
                    </td>

                    {/* Người tải lên */}
                    <td className="py-3.5 px-4 text-xs text-slate-700">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-slate-200 text-slate-700 flex items-center justify-center font-semibold text-[10px] shrink-0">
                          {item.uploadedBy?.charAt(0)?.toUpperCase() || 'U'}
                        </div>
                        <span className="truncate max-w-[140px]" title={item.uploadedBy}>
                          {item.uploadedBy || 'Người dùng'}
                        </span>
                      </div>
                    </td>

                    {/* Ngày tạo */}
                    <td className="py-3.5 px-4 text-xs text-slate-600 whitespace-nowrap">
                      {formatDate(item.createdAt)}
                    </td>

                    {/* Thao tác */}
                    <td className="py-3.5 px-4 text-center whitespace-nowrap">
                      <div className="inline-flex items-center gap-1 justify-center">
                        {/* Download button */}
                        <button
                          type="button"
                          onClick={() => onDownload(item)}
                          className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
                          title="Tải tệp về máy"
                          aria-label={`Tải về ${item.fileName}`}
                        >
                          <Download className="w-4 h-4" />
                        </button>

                        {/* Upload new version button */}
                        <button
                          type="button"
                          onClick={() => onUploadNewVersion(item)}
                          className="p-1.5 text-slate-500 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors cursor-pointer"
                          title="Tải bản mới (ghi đè và tăng version)"
                          aria-label={`Tải phiên bản mới cho ${item.fileName}`}
                        >
                          <UploadCloud className="w-4 h-4" />
                        </button>

                        {/* Version history button */}
                        <button
                          type="button"
                          onClick={() => onViewHistory(item)}
                          className="p-1.5 text-slate-500 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors cursor-pointer"
                          title="Lịch sử các phiên bản"
                          aria-label={`Xem lịch sử phiên bản của ${item.fileName}`}
                        >
                          <History className="w-4 h-4" />
                        </button>

                        {/* Delete button */}
                        <button
                          type="button"
                          onClick={() => onDelete(item)}
                          className="p-1.5 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                          title="Xóa tệp đính kèm"
                          aria-label={`Xóa tệp ${item.fileName}`}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
