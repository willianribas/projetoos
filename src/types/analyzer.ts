
export interface Analyzer {
  id: string;
  user_id: string;
  serial_number: string;
  name: string;
  model: string;
  calibration_due_date: Date | string;
  in_calibration: boolean;
  created_at: string;
  status?: 'em_dia' | 'vencera' | 'vencido' | 'em_calibracao';
}
