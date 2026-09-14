import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export interface PartnerPaginationProps {
  pageNumber: number;
  pageSize: number;
  totalPages: number;
  totalCount: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
  onPageChange: (newPage: number) => void;
  onPageSizeChange: (newSize: number) => void;
  isLoading?: boolean;
}

export const PartnerPagination: React.FC<PartnerPaginationProps> = ({
  pageNumber,
  pageSize,
  totalPages,
  totalCount,
  hasPreviousPage,
  hasNextPage,
  onPageChange,
  onPageSizeChange,
  isLoading = false,
}) => {
  const pageSizeOptions = [10, 20, 50];

  const handlePrevious = () => {
    if (hasPreviousPage && pageNumber > 1) {
      onPageChange(pageNumber - 1);
    }
  };

  const handleNext = () => {
    if (hasNextPage && pageNumber < totalPages) {
      onPageChange(pageNumber + 1);
    }
  };

  const handleSelectSize = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const size = Number(e.target.value);
    onPageSizeChange(size);
  };

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 py-3 px-4 bg-white border border-slate-200 rounded-xl shadow-xs text-xs text-slate-600">
      {/* Summary Info */}
      <div className="flex items-center gap-2">
        <span className="font-medium text-slate-700">
          Trang <span className="font-bold text-blue-600">{totalPages > 0 ? pageNumber : 0}</span> /{' '}
          <span className="font-bold text-slate-800">{totalPages}</span>
        </span>
        <span className="text-slate-300">|</span>
        <span>
          (Tổng số: <strong className="text-slate-800">{totalCount}</strong> đối tác)
        </span>
      </div>

      {/* Controls: PageSize Selector & Navigation Buttons */}
      <div className="flex items-center gap-4">
        {/* PageSize Selector */}
        <div className="flex items-center gap-1.5">
          <label htmlFor="pageSizeSelect" className="text-slate-500 whitespace-nowrap">
            Hiển thị:
          </label>
          <select
            id="pageSizeSelect"
            value={pageSize}
            onChange={handleSelectSize}
            disabled={isLoading}
            className="px-2.5 py-1 bg-white border border-slate-300 rounded-lg text-xs text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 cursor-pointer disabled:opacity-50"
          >
            {pageSizeOptions.map((opt) => (
              <option key={opt} value={opt}>
                {opt} / trang
              </option>
            ))}
          </select>
        </div>

        {/* Navigation Buttons */}
        <div className="inline-flex items-center gap-1.5">
          <button
            type="button"
            onClick={handlePrevious}
            disabled={!hasPreviousPage || pageNumber <= 1 || isLoading}
            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 font-medium transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
            <span>Trang trước</span>
          </button>

          <button
            type="button"
            onClick={handleNext}
            disabled={!hasNextPage || pageNumber >= totalPages || isLoading}
            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 font-medium transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
          >
            <span>Trang sau</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
