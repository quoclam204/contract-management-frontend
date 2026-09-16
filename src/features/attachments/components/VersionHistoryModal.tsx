import React from 'react';
import { Download, Clock, User, CheckCircle2 } from 'lucide-react';
import { Attachment } from '../types/attachment.types';
import { formatFileSize } from '../utils/attachment.utils';
import { formatDate } from '@/lib/utils';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';

export interface VersionHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  attachment: Attachment | null;
  onDownload: (id: string, fileName?: string) => void;
}

export const VersionHistoryModal: React.FC<VersionHistoryModalProps> = ({
  isOpen,
  onClose,
  attachment,
  onDownload,
}) => {
  const sortedVersions = React.useMemo(() => {
    return [...(attachment?.versions || [])].sort((a, b) => {
      const verA = a.versionNumber ?? 0;
      const verB = b.versionNumber ?? 0;
      if (verB !== verA) {
        return verB - verA; // Sắp xếp giảm dần theo số phiên bản (mới nhất lên đầu)
      }
      const dateA = a.uploadedAt ? new Date(a.uploadedAt).getTime() : 0;
      const dateB = b.uploadedAt ? new Date(b.uploadedAt).getTime() : 0;
      return dateB - dateA; // Ngày tải lên mới nhất lên đầu
    });
  }, [attachment?.versions]);

  const maxVersionNumber = React.useMemo(() => {
    if (!sortedVersions.length) return -1;
    return Math.max(...sortedVersions.map((v) => v.versionNumber ?? 0));
  }, [sortedVersions]);

  if (!attachment) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Lịch Sử Phiên Bản Tệp"
      description={`Theo dõi các bản ghi phiên bản lưu trữ của "${attachment.fileName}"`}
      maxWidth="lg"
    >
      <div className="space-y-4">
        {/* Header info */}
        <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between text-xs">
          <div>
            <span className="text-slate-500">Hợp đồng:</span>{' '}
            <strong className="text-slate-800 font-semibold">
              {attachment.contractNumber} — {attachment.contractTitle}
            </strong>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-slate-500">Tổng số:</span>
            <Badge variant="info">{sortedVersions.length} phiên bản</Badge>
          </div>
        </div>

        {/* Timeline list */}
        <div className="space-y-3 max-h-[55vh] overflow-y-auto pr-1">
          {sortedVersions.map((ver, idx) => {
            const isLatest = ver.versionNumber === maxVersionNumber && idx === 0;

            return (
              <div
                key={ver.id || `ver-${idx}`}
                className={`p-4 rounded-xl border transition-all ${
                  isLatest
                    ? 'bg-blue-50/40 border-blue-200 shadow-2xs'
                    : 'bg-white border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <div className="flex flex-col items-center">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold ${
                          isLatest
                            ? 'bg-blue-600 text-white'
                            : 'bg-slate-200 text-slate-700'
                        }`}
                      >
                        {ver.versionString || `v${ver.versionNumber}`}
                      </span>
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-semibold text-slate-900 break-all">
                          {ver.fileName}
                        </p>
                        {isLatest && (
                          <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200/60">
                            <CheckCircle2 className="w-3 h-3" /> Bản mới nhất
                          </span>
                        )}
                      </div>

                      <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 pt-0.5">
                        <span className="flex items-center gap-1">
                          <User className="w-3.5 h-3.5 text-slate-400" />
                          {ver.uploadedBy || 'Người dùng hệ thống'}
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5 text-slate-400" />
                          {formatDate(ver.uploadedAt)}
                        </span>
                        <span>•</span>
                        <span className="font-mono text-slate-600">
                          {formatFileSize(ver.fileSize)}
                        </span>
                      </div>

                      {ver.notes && (
                        <div className="mt-2 p-2.5 bg-white/80 border border-slate-200/80 rounded-lg text-xs text-slate-700">
                          <span className="font-medium text-slate-500 block text-[11px]">
                            Ghi chú thay đổi:
                          </span>
                          <p className="mt-0.5 italic">{ver.notes}</p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Action */}
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => onDownload(attachment.id, ver.fileName)}
                    className="shrink-0 text-xs"
                    title={`Tải về phiên bản ${ver.versionString || `v${ver.versionNumber}`}`}
                  >
                    <Download className="w-3.5 h-3.5 mr-1 text-slate-600" />
                    <span>Tải về</span>
                  </Button>
                </div>
              </div>
            );
          })}
        </div>

        <div className="flex justify-end pt-3 border-t border-slate-100">
          <Button type="button" variant="outline" size="sm" onClick={onClose}>
            Đóng
          </Button>
        </div>
      </div>
    </Modal>
  );
};
