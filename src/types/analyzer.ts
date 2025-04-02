
export interface Analyzer {
  id?: string;
  serial_number: string; // NS/PT
  name: string;
  model: string;
  calibration_due_date: Date | string;
  status: AnalyzerStatus;
  user_id?: string;
  created_at?: string;
  in_calibration?: boolean;
}

export type AnalyzerStatus = 'em_dia' | 'vencera' | 'vencido' | 'em_calibracao';

export const getAnalyzerStatus = (dueDate: Date | string, inCalibration: boolean): AnalyzerStatus => {
  if (inCalibration) return 'em_calibracao';
  
  const today = new Date();
  const dueDateObj = new Date(dueDate);
  
  // Calculate difference in days
  const diffTime = dueDateObj.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays < 0) {
    return 'vencido';
  } else if (diffDays <= 60) {
    return 'vencera';
  } else {
    return 'em_dia';
  }
};

export const getStatusColor = (status: AnalyzerStatus): string => {
  switch (status) {
    case 'em_dia':
      return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
    case 'vencera':
      return 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400';
    case 'vencido':
      return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
    case 'em_calibracao':
      return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400';
    default:
      return '';
  }
};

export const getStatusText = (status: AnalyzerStatus): string => {
  switch (status) {
    case 'em_dia':
      return 'Em Dia';
    case 'vencera':
      return 'Vencerá';
    case 'vencido':
      return 'Vencido';
    case 'em_calibracao':
      return 'Em Calibração';
    default:
      return '';
  }
};
