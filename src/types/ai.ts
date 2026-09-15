export type { AiAnalysisResultDto } from '@/features/ai-analysis/api/aiAnalysisApi';

export function parseRiskFlags(raw: string | null): string[] {
  if (!raw) return [];

  try {
    const parsed = JSON.parse(raw);

    if (Array.isArray(parsed)) {
      return parsed.map(String);
    }

    return [String(parsed)];
  } catch {
    return [raw];
  }
}
