export function formatFileSize(bytes?: number): string {
  if (bytes === undefined || bytes === null || isNaN(bytes) || bytes <= 0) {
    return '0 B';
  }
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  const val = bytes / Math.pow(k, i);
  return `${val.toFixed(val < 10 && i > 0 ? 1 : 0)} ${sizes[i]}`;
}

export const formatBytes = formatFileSize;

export function getFileExtension(fileName: string): string {
  if (!fileName) return '';
  const parts = fileName.split('.');
  return parts.length > 1 ? parts.pop()!.toLowerCase() : '';
}

export interface FileTypeMetadata {
  label: string;
  badgeBg: string;
  badgeText: string;
  badgeBorder: string;
  iconColor: string;
  bgColor: string;
}

export function getFileTypeMetadata(fileTypeOrName: string): FileTypeMetadata {
  const ext = fileTypeOrName.includes('.')
    ? getFileExtension(fileTypeOrName)
    : fileTypeOrName.toLowerCase();

  switch (ext) {
    case 'pdf':
      return {
        label: 'PDF',
        badgeBg: 'bg-rose-50',
        badgeText: 'text-rose-700',
        badgeBorder: 'border-rose-200',
        iconColor: 'text-rose-600',
        bgColor: 'bg-rose-100/60',
      };
    case 'docx':
    case 'doc':
      return {
        label: 'DOCX',
        badgeBg: 'bg-blue-50',
        badgeText: 'text-blue-700',
        badgeBorder: 'border-blue-200',
        iconColor: 'text-blue-600',
        bgColor: 'bg-blue-100/60',
      };
    case 'xlsx':
    case 'xls':
    case 'csv':
      return {
        label: 'XLSX',
        badgeBg: 'bg-emerald-50',
        badgeText: 'text-emerald-700',
        badgeBorder: 'border-emerald-200',
        iconColor: 'text-emerald-600',
        bgColor: 'bg-emerald-100/60',
      };
    case 'png':
    case 'jpg':
    case 'jpeg':
    case 'webp':
      return {
        label: 'IMAGE',
        badgeBg: 'bg-purple-50',
        badgeText: 'text-purple-700',
        badgeBorder: 'border-purple-200',
        iconColor: 'text-purple-600',
        bgColor: 'bg-purple-100/60',
      };
    default:
      return {
        label: ext.toUpperCase() || 'FILE',
        badgeBg: 'bg-slate-100',
        badgeText: 'text-slate-700',
        badgeBorder: 'border-slate-200',
        iconColor: 'text-slate-500',
        bgColor: 'bg-slate-100',
      };
  }
}
