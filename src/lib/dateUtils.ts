import { format, Locale } from 'date-fns';
import { ptBR } from 'date-fns/locale';

// Configuração padrão para localização em português
export const defaultLocale: Locale = ptBR;

// Função para formatar datas de vencimento de analisadores
export const formatCalibrationDate = (date: Date | string): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return format(dateObj, 'MMM yyyy', { locale: defaultLocale });
};

// Função para formatar data completa
export const formatFullDate = (date: Date | string): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return format(dateObj, "dd 'de' MMMM 'de' yyyy", { locale: defaultLocale });
};

// Função para formatar data do calendário
export const formatCalendarDate = (date: Date | string): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return format(dateObj, "dd MMM yyyy", { locale: defaultLocale });
};