export interface SleepRecord {
  id: string;
  timestamp: number; // Stored as epoch for easy sorting/manipulation
  day: string;
  date: string;
  time: string; // 24h format HH:mm
}

export interface SleepStats {
  totalEntries: number;
  averageTime: string;
}

export interface AiInsightResponse {
  analysis: string;
  recommendations: string[];
}