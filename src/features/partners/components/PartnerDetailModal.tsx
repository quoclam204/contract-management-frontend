import React from 'react';
import {
  Building2,
  User,
  Mail,
  MapPin,
  Calendar,
  FileText,
  Pencil,
} from 'lucide-react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Partner } from '../types/partner.types';
import { formatDate } from '@/lib/utils';

export interface PartnerDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  partner: Partner | null;
  onEdit?: (partner: Partner) => void;
}

export const PartnerDetailModal: React.FC<PartnerDetailModalProps> = ({
  isOpen,
  onClose,
  partner,
  onEdit,
}) => {
  if (!partner) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Chi tiết đối tác"
      description="Xem thông tin chi tiết đối tác doanh nghiệp / nhà cung cấp trong hệ thống"
      maxWidth="lg"
    >
      <div className="space-y-6">
        {/* Partner Quick Overview Banner */}
        <div className="p-4 bg-gradient-to-r from-blue-50/80 to-indigo-50/50 border border-blue-100 rounded-xl flex items-start gap-3.5">
          <div className="p-2.5 bg-blue-600 text-white rounded-xl shadow-xs shrink-0">
            <Building2 className="w-6 h-6" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <h4 className="text-base font-bold text-slate-900 truncate">
                {partner.name}
              </h4>
              <Badge variant="info" className="font-mono text-xs">
                MST: {partner.taxCode}
              </Badge>
            </div>
            <p className="text-xs text-slate-500 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              Ngày tạo hồ sơ: {formatDate(partner.createdAt)}
            </p>
          </div>
        </div>

        {/* Detail Info Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Mã số thuế */}
          <div className="p-3.5 bg-slate-50 border border-slate-200/80 rounded-xl">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 mb-1">
              <FileText className="w-3.5 h-3.5 text-slate-400" />
              <span>Mã số thuế</span>
            </div>
            <p className="text-sm font-mono font-bold text-slate-800">
              {partner.taxCode}
            </p>
          </div>

          {/* Người đại diện */}
          <div className="p-3.5 bg-slate-50 border border-slate-200/80 rounded-xl">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 mb-1">
              <User className="w-3.5 h-3.5 text-slate-400" />
              <span>Người đại diện</span>
            </div>
            <p className="text-sm font-medium text-slate-800">
              {partner.representative || (
                <span className="text-slate-400 italic text-xs">Chưa cập nhật</span>
              )}
            </p>
          </div>

          {/* Email liên hệ */}
          <div className="p-3.5 bg-slate-50 border border-slate-200/80 rounded-xl sm:col-span-2">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 mb-1">
              <Mail className="w-3.5 h-3.5 text-slate-400" />
              <span>Email liên hệ</span>
            </div>
            {partner.contactEmail ? (
              <a
                href={`mailto:${partner.contactEmail}`}
                className="text-sm text-blue-600 hover:underline break-all inline-block font-medium"
              >
                {partner.contactEmail}
              </a>
            ) : (
              <span className="text-slate-400 italic text-xs">Chưa cập nhật</span>
            )}
          </div>

          {/* Địa chỉ trụ sở */}
          <div className="p-3.5 bg-slate-50 border border-slate-200/80 rounded-xl sm:col-span-2">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 mb-1">
              <MapPin className="w-3.5 h-3.5 text-slate-400" />
              <span>Địa chỉ trụ sở</span>
            </div>
            <p className="text-sm text-slate-700 leading-relaxed">
              {partner.address || (
                <span className="text-slate-400 italic text-xs">Chưa cập nhật</span>
              )}
            </p>
          </div>
        </div>

        {/* Actions Footer */}
        <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
          <Button type="button" variant="outline" onClick={onClose}>
            Đóng
          </Button>
          {onEdit && (
            <Button
              type="button"
              variant="primary"
              onClick={() => onEdit(partner)}
            >
              <Pencil className="w-3.5 h-3.5 mr-1.5" />
              <span>Chỉnh sửa đối tác</span>
            </Button>
          )}
        </div>
      </div>
    </Modal>
  );
};
