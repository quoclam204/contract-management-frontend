import React, { useState, useRef, DragEvent, ChangeEvent } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { message } from 'antd';
import {
  UploadCloud,
  FileText,
  FileSpreadsheet,
  Image as ImageIcon,
  File,
  X,
  CheckCircle2,
  AlertCircle,
  FileUp,
} from 'lucide-react';
import { uploadAttachment } from '../api/attachmentApi';
import { formatFileSize, getFileTypeMetadata } from '../utils/attachment.utils';
import { useContracts } from '@/hooks/data/useContracts';
import { Button } from '@/components/ui/Button';

const MAX_FILE_SIZE = 25 * 1024 * 1024; // 25 MB
const ACCEPTED_EXTENSIONS = ['pdf', 'docx', 'xlsx', 'png'];

// Danh sách hợp đồng mẫu dự phòng khi chưa tải được từ backend
const FALLBACK_CONTRACTS = [
  { id: 'contract-1', contractNumber: 'HD-2025-001', title: 'Hợp đồng Mua bán Thiết bị Tin học' },
  { id: 'contract-2', contractNumber: 'HD-2025-002', title: 'Hợp đồng Cung cấp Dịch vụ Phần mềm' },
  { id: 'contract-3', contractNumber: 'HD-2025-003', title: 'Hợp đồng Thuê Văn phòng Keangnam' },
];

export interface AttachmentDropzoneProps {
  defaultContractId?: string;
  onUploadSuccess?: () => void;
}

export const AttachmentDropzone: React.FC<AttachmentDropzoneProps> = ({
  defaultContractId,
  onUploadSuccess,
}) => {
  const queryClient = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedContractId, setSelectedContractId] = useState<string>(defaultContractId || 'contract-1');
  const [notes, setNotes] = useState<string>('');
  const [isDragOver, setIsDragOver] = useState<boolean>(false);
  const [validationError, setValidationError] = useState<string | null>(null);

  // Lấy danh sách hợp đồng
  const { data: contractsData } = useContracts();
  const contracts =
    Array.isArray(contractsData) && contractsData.length > 0
      ? contractsData
      : FALLBACK_CONTRACTS;

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

      const activeContract = contracts.find((c) => c.id === selectedContractId);
      const formData = new FormData();
      formData.append('file', selectedFile);
      formData.append('contractId', selectedContractId);
      if (activeContract) {
        formData.append('contractNumber', activeContract.contractNumber);
        formData.append('contractTitle', activeContract.title);
      }
      if (notes.trim()) {
        formData.append('notes', notes.trim());
      }

      return await uploadAttachment(formData);
    },
    onSuccess: (newAttachment) => {
      message.success(`Đã tải lên tệp "${newAttachment.fileName}" thành công!`);
      queryClient.invalidateQueries({ queryKey: ['attachments'] });
      handleRemoveFile();
      setNotes('');
      onUploadSuccess?.();
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
    uploadMutation.mutate();
  };

  const meta = selectedFile ? getFileTypeMetadata(selectedFile.name) : null;

  return (
    <div className="bg-white border border-slate-200 rounded-2xl shadow-xs overflow-hidden">
      <div className="p-5 sm:p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-base font-semibold text-slate-900 flex items-center gap-2">
              <UploadCloud className="w-5 h-5 text-blue-600" />
              <span>Tải Lên Tệp Đính Kèm Mới</span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Hỗ trợ kéo thả tài liệu hợp đồng, phụ lục, bảng biểu và giấy tờ pháp lý
            </p>
          </div>
          <span className="text-[11px] font-medium text-slate-400 bg-slate-100 px-2.5 py-1 rounded-full">
            Tối đa 25MB • .pdf, .docx, .xlsx, .png
          </span>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Dropzone Area */}
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`relative border-2 border-dashed rounded-xl p-6 sm:p-8 text-center cursor-pointer transition-all duration-200 ${
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
            />

            {!selectedFile ? (
              <div className="flex flex-col items-center justify-center pointer-events-none">
                <div
                  className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-3 transition-colors ${
                    isDragOver
                      ? 'bg-blue-600 text-white'
                      : 'bg-blue-50 text-blue-600'
                  }`}
                >
                  <UploadCloud className="w-7 h-7" />
                </div>
                <p className="text-sm font-medium text-slate-800 mb-1">
                  Kéo và thả tệp vào đây, hoặc{' '}
                  <span className="text-blue-600 font-semibold underline underline-offset-2">
                    chọn từ máy tính
                  </span>
                </p>
                <p className="text-xs text-slate-400">
                  Hỗ trợ định dạng: PDF, Microsoft Word (.docx), Excel (.xlsx), Ảnh (.png)
                </p>
              </div>
            ) : (
              <div
                className="flex items-center justify-between p-3 bg-white border border-emerald-200 rounded-xl shadow-xs pointer-events-auto"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-center gap-3 truncate">
                  <div
                    className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${meta?.bgColor}`}
                  >
                    {meta?.label === 'PDF' && <FileText className={`w-5 h-5 ${meta.iconColor}`} />}
                    {meta?.label === 'DOCX' && <FileText className={`w-5 h-5 ${meta.iconColor}`} />}
                    {meta?.label === 'XLSX' && <FileSpreadsheet className={`w-5 h-5 ${meta.iconColor}`} />}
                    {meta?.label === 'IMAGE' && <ImageIcon className={`w-5 h-5 ${meta.iconColor}`} />}
                    {!['PDF', 'DOCX', 'XLSX', 'IMAGE'].includes(meta?.label || '') && (
                      <File className="w-5 h-5 text-slate-500" />
                    )}
                  </div>
                  <div className="text-left truncate">
                    <p className="text-sm font-semibold text-slate-900 truncate">
                      {selectedFile.name}
                    </p>
                    <p className="text-xs text-slate-500 flex items-center gap-1.5">
                      <span>{formatFileSize(selectedFile.size)}</span>
                      <span>•</span>
                      <span className="text-emerald-600 font-medium flex items-center gap-0.5">
                        <CheckCircle2 className="w-3 h-3 inline" /> Hợp lệ
                      </span>
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="text-xs text-blue-600 hover:text-blue-700 hover:underline px-2 py-1 font-medium cursor-pointer"
                  >
                    Đổi tệp khác
                  </button>
                  <button
                    type="button"
                    onClick={handleRemoveFile}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                    title="Hủy tệp này"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Error message */}
          {validationError && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl flex items-center gap-2 text-rose-700 text-xs animate-in fade-in">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{validationError}</span>
            </div>
          )}

          {/* Form controls: Contract selector & Notes */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Hợp đồng liên kết <span className="text-rose-500">*</span>
              </label>
              <select
                value={selectedContractId}
                onChange={(e) => setSelectedContractId(e.target.value)}
                className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:bg-white transition-all cursor-pointer"
              >
                {contracts.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.contractNumber} — {c.title}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Ghi chú tài liệu (tùy chọn)
              </label>
              <input
                type="text"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Ví dụ: Bản scan có dấu đỏ, phụ lục thanh toán đợt 1..."
                className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:bg-white transition-all"
              />
            </div>
          </div>

          {/* Submit Action */}
          <div className="flex items-center justify-end gap-3 pt-2">
            {selectedFile && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleRemoveFile}
                disabled={uploadMutation.isPending}
              >
                Hủy chọn
              </Button>
            )}
            <Button
              type="submit"
              variant="primary"
              size="md"
              disabled={!selectedFile || uploadMutation.isPending}
              isLoading={uploadMutation.isPending}
              className="shadow-sm min-w-[140px]"
            >
              <FileUp className="w-4 h-4 mr-1.5" />
              <span>{uploadMutation.isPending ? 'Đang tải lên...' : 'Tải Lên Tệp'}</span>
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
