import React, { useState, useRef, ChangeEvent, DragEvent } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { message } from 'antd';
import {
  UploadCloud,
  FileText,
  FileSpreadsheet,
  Image as ImageIcon,
  File,
  X,
  AlertCircle,
  ArrowRight,
} from 'lucide-react';
import { Attachment } from '../types/attachment.types';
import { uploadNewVersion } from '../api/attachmentApi';
import { formatFileSize, getFileTypeMetadata } from '../utils/attachment.utils';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';

const MAX_FILE_SIZE = 25 * 1024 * 1024;
const ACCEPTED_EXTENSIONS = ['pdf', 'docx', 'xlsx', 'png'];

export interface UploadNewVersionModalProps {
  isOpen: boolean;
  onClose: () => void;
  attachment: Attachment | null;
}

export const UploadNewVersionModal: React.FC<UploadNewVersionModalProps> = ({
  isOpen,
  onClose,
  attachment,
}) => {
  const queryClient = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [newFile, setNewFile] = useState<File | null>(null);
  const [versionNotes, setVersionNotes] = useState<string>('');
  const [isDragOver, setIsDragOver] = useState<boolean>(false);
  const [errorText, setErrorText] = useState<string | null>(null);

  const currentVersionNumber = attachment?.currentVersion || 1;
  const nextVersionNumber = currentVersionNumber + 1;
  const nextVersionString = `v${nextVersionNumber}`;

  const handleClose = () => {
    setNewFile(null);
    setVersionNotes('');
    setErrorText(null);
    onClose();
  };

  const mutation = useMutation({
    mutationFn: async () => {
      if (!attachment) throw new Error('Không tìm thấy tệp đính kèm');
      if (!newFile) throw new Error('Vui lòng chọn tệp phiên bản mới');
      const formData = new FormData();
      formData.append('file', newFile);
      if (versionNotes.trim()) {
        formData.append('notes', versionNotes.trim());
      }
      return await uploadNewVersion(attachment.contractId, formData);
    },
    onSuccess: () => {
      message.success(
        `Đã tải lên phiên bản mới (${nextVersionString}) cho tệp "${attachment?.fileName || ''}"!`
      );
      queryClient.invalidateQueries({ queryKey: ['attachments'] });
      handleClose();
    },
    onError: (err: Error) => {
      message.error(err.message || 'Không thể tải lên phiên bản mới. Vui lòng thử lại.');
    },
  });

  const validateFile = (file: File): boolean => {
    setErrorText(null);
    const ext = file.name.split('.').pop()?.toLowerCase() || '';

    if (!ACCEPTED_EXTENSIONS.includes(ext)) {
      setErrorText(
        `Định dạng .${ext || 'unknown'} không được hỗ trợ. Vui lòng chọn .pdf, .docx, .xlsx, .png`
      );
      return false;
    }

    if (file.size > MAX_FILE_SIZE) {
      setErrorText(
        `Dung lượng tệp ${formatFileSize(file.size)} vượt quá giới hạn tối đa 25MB.`
      );
      return false;
    }

    return true;
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      if (validateFile(file)) {
        setNewFile(file);
      }
    }
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      if (validateFile(file)) {
        setNewFile(file);
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFile) {
      setErrorText('Vui lòng chọn tệp phiên bản mới');
      return;
    }
    mutation.mutate();
  };

  if (!attachment) return null;

  const meta = newFile ? getFileTypeMetadata(newFile.name) : null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Tải Lên Phiên Bản Mới"
      description={`Cập nhật tệp thay thế và tự động nâng cấp phiên bản cho "${attachment.fileName}"`}
      maxWidth="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Version change banner */}
        <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between">
          <div className="text-xs">
            <span className="text-slate-500 block mb-0.5">Phiên bản hiện tại</span>
            <span className="font-semibold text-slate-800">{attachment.versionString || `v${currentVersionNumber}`}</span>
          </div>
          <ArrowRight className="w-4 h-4 text-blue-500" />
          <div className="text-xs text-right">
            <span className="text-slate-500 block mb-0.5">Phiên bản tiếp theo</span>
            <Badge variant="info" className="font-bold">
              {nextVersionString}
            </Badge>
          </div>
        </div>

        {/* File Dropzone */}
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-xl p-5 text-center cursor-pointer transition-colors ${
            isDragOver
              ? 'border-blue-500 bg-blue-50/50'
              : newFile
              ? 'border-emerald-300 bg-emerald-50/20'
              : 'border-slate-300 hover:border-blue-400 hover:bg-slate-50'
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,.docx,.xlsx,.png"
            onChange={handleFileChange}
            className="hidden"
          />

          {!newFile ? (
            <div className="pointer-events-none">
              <UploadCloud className="w-8 h-8 text-blue-500 mx-auto mb-2" />
              <p className="text-sm font-medium text-slate-800">
                Nhấp để chọn hoặc kéo tệp phiên bản mới vào đây
              </p>
              <p className="text-xs text-slate-400 mt-0.5">
                Hỗ trợ .pdf, .docx, .xlsx, .png (Tối đa 25MB)
              </p>
            </div>
          ) : (
            <div
              className="flex items-center justify-between p-2.5 bg-white border border-emerald-200 rounded-lg pointer-events-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center gap-2.5 text-left truncate">
                <div className={`p-1.5 rounded-lg shrink-0 ${meta?.bgColor}`}>
                  {meta?.label === 'PDF' && <FileText className={`w-4 h-4 ${meta.iconColor}`} />}
                  {meta?.label === 'DOCX' && <FileText className={`w-4 h-4 ${meta.iconColor}`} />}
                  {meta?.label === 'XLSX' && <FileSpreadsheet className={`w-4 h-4 ${meta.iconColor}`} />}
                  {meta?.label === 'IMAGE' && <ImageIcon className={`w-4 h-4 ${meta.iconColor}`} />}
                  {!['PDF', 'DOCX', 'XLSX', 'IMAGE'].includes(meta?.label || '') && (
                    <File className="w-4 h-4 text-slate-500" />
                  )}
                </div>
                <div className="truncate">
                  <p className="text-xs font-semibold text-slate-900 truncate">{newFile.name}</p>
                  <p className="text-[11px] text-slate-500">{formatFileSize(newFile.size)}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  setNewFile(null);
                  if (fileInputRef.current) fileInputRef.current.value = '';
                }}
                className="p-1 rounded-md text-slate-400 hover:text-rose-600 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>

        {errorText && (
          <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg flex items-center gap-2 text-rose-700 text-xs">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
            <span>{errorText}</span>
          </div>
        )}

        {/* Change Notes */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1.5">
            Ghi chú thay đổi phiên bản
          </label>
          <textarea
            rows={2}
            value={versionNotes}
            onChange={(e) => setVersionNotes(e.target.value)}
            placeholder="Mô tả các nội dung chỉnh sửa, bổ sung so với phiên bản trước..."
            className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:bg-white resize-none transition-all"
          />
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-slate-100">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleClose}
            disabled={mutation.isPending}
          >
            Hủy bỏ
          </Button>
          <Button
            type="submit"
            variant="primary"
            size="sm"
            disabled={!newFile || mutation.isPending}
            isLoading={mutation.isPending}
          >
            Lưu Phiên Bản Mới
          </Button>
        </div>
      </form>
    </Modal>
  );
};
