
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

export const getStatusColor = (status?: string): string => {
  switch (status) {
    case 'em_dia':
      return 'bg-green-100 text-green-800 hover:bg-green-200 dark:bg-green-900/20 dark:text-green-400';
    case 'vencera':
      return 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-400';
    case 'vencido':
      return 'bg-red-100 text-red-800 hover:bg-red-200 dark:bg-red-900/20 dark:text-red-400';
    case 'em_calibracao':
      return 'bg-blue-100 text-blue-800 hover:bg-blue-200 dark:bg-blue-900/20 dark:text-blue-400';
    default:
      return 'bg-gray-100 text-gray-800 hover:bg-gray-200 dark:bg-gray-900/20 dark:text-gray-400';
  }
};

export const getStatusText = (status?: string): string => {
  switch (status) {
    case 'em_dia':
      return 'Em dia';
    case 'vencera':
      return 'Vencerá em breve';
    case 'vencido':
      return 'Vencido';
    case 'em_calibracao':
      return 'Em calibração';
    default:
      return 'Desconhecido';
  }
};
