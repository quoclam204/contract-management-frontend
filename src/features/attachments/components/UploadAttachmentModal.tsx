import React, { useState, useRef, DragEvent, ChangeEvent, useEffect } from 'react';
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
} from 'lucide-react';
import { uploadAttachment } from '../api/attachmentApi';
import { formatFileSize, getFileTypeMetadata } from '../utils/attachment.utils';
import { useContracts } from '@/hooks/data/useContracts';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';

const MAX_FILE_SIZE = 25 * 1024 * 1024; // 25 MB
const ACCEPTED_EXTENSIONS = ['pdf', 'docx', 'xlsx', 'png'];

export interface UploadAttachmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultContractId?: string;
  onUploadSuccess?: () => void;
}

export const UploadAttachmentModal: React.FC<UploadAttachmentModalProps> = ({
  isOpen,
  onClose,
  defaultContractId,
  onUploadSuccess,
}) => {
  const queryClient = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Lấy danh sách hợp đồng thật từ backend
  const { data: contractsData } = useContracts();
  const contracts = Array.isArray(contractsData) ? contractsData : [];

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedContractId, setSelectedContractId] = useState<string>('');
  const [notes, setNotes] = useState<string>('');
  const [isDragOver, setIsDragOver] = useState<boolean>(false);
  const [validationError, setValidationError] = useState<string | null>(null);

  // Reset/sync form state when modal opens
  useEffect(() => {
    if (isOpen) {
      setSelectedFile(null);
      setNotes('');
      setValidationError(null);
      const initialContractId =
        defaultContractId && contracts.some((c) => c.id === defaultContractId)
          ? defaultContractId
          : '';
      setSelectedContractId(initialContractId);
    }
  }, [isOpen, defaultContractId, contracts]);

  const validateFile = (file: File): boolean => {
    setValidationError(null);

    // Kiểm tra định dạng
    const ext = file.name.split('.').pop()?.toLowerCase() || '';
    if (!ACCEPTED_EXTENSIONS.includes(ext)) {
      setValidationError(
        `Định dạng .${ext || 'unknown'} không được hỗ trợ. Chỉ chấp nhận .pdf, .docx, .xlsx, .png`
      );
      return false;
    }

    // Kiểm tra dung lượng
    if (file.size > MAX_FILE_SIZE) {
      setValidationError(
        `Tệp ${file.name} có dung lượng ${formatFileSize(file.size)}, vượt quá giới hạn tối đa 25MB.`
      );
      return false;
    }

    return true;
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      if (validateFile(file)) {
        setSelectedFile(file);
      }
    }
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      if (validateFile(file)) {
        setSelectedFile(file);
      }
    }
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    setValidationError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const uploadMutation = useMutation({
    mutationFn: async () => {
      if (!selectedFile) throw new Error('Vui lòng chọn tệp');
      if (!selectedContractId) throw new Error('Vui lòng chọn hợp đồng liên kết');

      const formData = new FormData();
      formData.append('file', selectedFile);
      if (notes.trim()) {
        formData.append('notes', notes.trim());
      }

      return await uploadAttachment(selectedContractId, formData);
    },
    onSuccess: (newAttachment) => {
      message.success(`Đã tải lên tệp "${newAttachment.fileName}" thành công!`);
      queryClient.invalidateQueries({ queryKey: ['attachments'] });
      handleRemoveFile();
      setNotes('');
      onUploadSuccess?.();
      onClose();
    },
    onError: (err: Error) => {
      message.error(err.message || 'Không thể tải lên tệp. Vui lòng thử lại.');
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile) {
      message.warning('Vui lòng chọn hoặc kéo thả tệp tài liệu trước khi tải lên.');
      return;
    }
    if (!selectedContractId) {
      message.warning('Vui lòng chọn hợp đồng liên kết.');
      return;
    }
    uploadMutation.mutate();
  };

  const meta = selectedFile ? getFileTypeMetadata(selectedFile.name) : null;
  const isLoading = uploadMutation.isPending;

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => {
        if (!isLoading) {
          onClose();
        }
      }}
      title="Tải lên tệp đính kèm mới"
      description="Hỗ trợ kéo thả tài liệu hợp đồng, phụ lục, bảng biểu và chứng từ pháp lý"
      maxWidth="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Dropzone Area */}
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`relative border-2 border-dashed rounded-xl p-6 sm:p-7 text-center cursor-pointer transition-all duration-200 ${
            isDragOver
              ? 'border-blue-500 bg-blue-50/50 scale-[0.99]'
              : selectedFile
              ? 'border-emerald-300 bg-emerald-50/20'
              : 'border-slate-300 hover:border-blue-400 hover:bg-slate-50/60'
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,.docx,.xlsx,.png"
            onChange={handleFileChange}
            className="hidden"
            disabled={isLoading}
          />

          {!selectedFile ? (
            <div className="pointer-events-none">
              <div className="w-12 h-12 mx-auto mb-2 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                <UploadCloud className="w-6 h-6" />
              </div>
              <p className="text-sm font-semibold text-slate-800">
                Nhấp để chọn tệp hoặc kéo và thả vào đây
              </p>
              <p className="text-xs text-slate-400 mt-1">
                Hỗ trợ .pdf, .docx, .xlsx, .png (Dung lượng tối đa 25MB)
              </p>
            </div>
          ) : (
            <div
              className="flex items-center justify-between p-3 bg-white border border-emerald-200 rounded-xl shadow-2xs pointer-events-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center gap-3 text-left truncate">
                <div className={`p-2 rounded-lg shrink-0 ${meta?.bgColor || 'bg-slate-100'}`}>
                  {meta?.label === 'PDF' && (
                    <FileText className={`w-5 h-5 ${meta.iconColor}`} />
                  )}
                  {meta?.label === 'DOCX' && (
                    <FileText className={`w-5 h-5 ${meta.iconColor}`} />
                  )}
                  {meta?.label === 'XLSX' && (
                    <FileSpreadsheet className={`w-5 h-5 ${meta.iconColor}`} />
                  )}
                  {meta?.label === 'IMAGE' && (
                    <ImageIcon className={`w-5 h-5 ${meta.iconColor}`} />
                  )}
                  {!['PDF', 'DOCX', 'XLSX', 'IMAGE'].includes(meta?.label || '') && (
                    <File className="w-5 h-5 text-slate-500" />
                  )}
                </div>
                <div className="truncate">
                  <p className="text-sm font-semibold text-slate-900 truncate">
                    {selectedFile.name}
                  </p>
                  <p className="text-xs text-slate-500">
                    {formatFileSize(selectedFile.size)} • {meta?.label || 'FILE'}
                  </p>
                </div>
              </div>

              {!isLoading && (
                <button
                  type="button"
                  onClick={handleRemoveFile}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer shrink-0"
                  title="Xóa tệp đã chọn"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          )}
        </div>

        {/* Validation Error Alert */}
        {validationError && (
          <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl flex items-center gap-2 text-rose-700 text-xs animate-in fade-in">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
            <span>{validationError}</span>
          </div>
        )}

        {/* Contract Selection */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1.5">
            Hợp đồng liên kết <span className="text-rose-500">*</span>
          </label>
          <select
            value={selectedContractId}
            onChange={(e) => setSelectedContractId(e.target.value)}
            disabled={isLoading || contracts.length === 0}
            className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:bg-white transition-all cursor-pointer disabled:bg-slate-100 disabled:cursor-not-allowed"
          >
            <option value="">-- Chọn hợp đồng liên kết * --</option>
            {contracts.map((contract) => (
              <option key={contract.id} value={contract.id}>
                {contract.contractNumber} — {contract.title}
              </option>
            ))}
          </select>
          {contracts.length === 0 ? (
            <p className="text-[11px] text-amber-600 mt-1">
              Chưa có dữ liệu hợp đồng từ máy chủ. Vui lòng tạo hợp đồng trước khi tải tệp.
            </p>
          ) : (
            <p className="text-[11px] text-slate-400 mt-1">
              Tệp sẽ được lưu trữ và liên kết trực tiếp vào hồ sơ của hợp đồng được chọn.
            </p>
          )}
        </div>

        {/* Notes Input */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1.5">
            Ghi chú tệp (tùy chọn)
          </label>
          <textarea
            rows={2}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            disabled={isLoading}
            placeholder="Nhập ghi chú tóm tắt nội dung, phân loại hoặc lưu ý về tệp tài liệu này..."
            className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:bg-white transition-all resize-none disabled:bg-slate-100 disabled:cursor-not-allowed"
          />
        </div>

        {/* Modal Actions Footer */}
        <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={isLoading}
          >
            Hủy bỏ
          </Button>
          <Button
            type="submit"
            variant="primary"
            isLoading={isLoading}
            disabled={!selectedFile || !selectedContractId || isLoading}
          >
            Tải lên tệp
          </Button>
        </div>
      </form>
    </Modal>
  );
};
