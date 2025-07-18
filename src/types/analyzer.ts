
export interface Analyzer {
  id: string;
  serial_number: string;
  name: string;
  model: string;
  brand: string;
  calibration_due_date: string;
  certificate_number: string;
  in_calibration: boolean;
  created_at: string;
  user_id: string;
}

export type AnalyzerStatus = 'in-day' | 'expiring-soon' | 'expired' | 'in-calibration';

export interface AnalyzerWithStatus extends Analyzer {
  status: AnalyzerStatus;
}
