
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Calendar } from '@/components/ui/calendar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Analyzer } from '@/types/analyzer';
import { CalendarIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AnalyzerFormProps {
  onSubmit: (data: Omit<Analyzer, 'id' | 'created_at' | 'user_id'>) => void;
}

const AnalyzerForm = ({ onSubmit }: AnalyzerFormProps) => {
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<Omit<Analyzer, 'id' | 'created_at' | 'user_id'>>();
  
  const [date, setDate] = useState<Date | undefined>(undefined);

  const handleFormSubmit = (data: Omit<Analyzer, 'id' | 'created_at' | 'user_id'>) => {
    onSubmit(data);
    reset();
    setDate(undefined);
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4 p-4 bg-card rounded-lg border">
      <h2 className="text-xl font-bold">Adicionar Analisador</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="serial_number">N° de Série / Patrimônio</Label>
          <Input
            id="serial_number"
            {...register('serial_number', { required: 'N° de Série / Patrimônio é obrigatório' })}
            placeholder="Digite o N° de Série ou Patrimônio"
          />
          {errors.serial_number && (
            <p className="text-sm text-destructive">{errors.serial_number.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="name">Nome</Label>
          <Input
            id="name"
            {...register('name', { required: 'Nome é obrigatório' })}
            placeholder="Digite o nome do analisador"
          />
          {errors.name && (
            <p className="text-sm text-destructive">{errors.name.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="model">Modelo</Label>
          <Input
            id="model"
            {...register('model', { required: 'Modelo é obrigatório' })}
            placeholder="Digite o modelo do analisador"
          />
          {errors.model && (
            <p className="text-sm text-destructive">{errors.model.message}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="calibration_due_date">Data de Vencimento</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={"outline"}
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !date && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {date ? format(date, "PPP", { locale: ptBR }) : <span>Selecione a data</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={date}
                onSelect={(newDate) => {
                  setDate(newDate);
                  if (newDate) {
                    setValue('calibration_due_date', format(newDate, 'yyyy-MM-dd'));
                  }
                }}
                initialFocus
              />
            </PopoverContent>
          </Popover>
          {errors.calibration_due_date && (
            <p className="text-sm text-destructive">{errors.calibration_due_date.message}</p>
          )}
        </div>

        <div className="flex items-end">
          <input 
            type="hidden" 
            {...register('in_calibration')} 
            value="false" 
          />
          <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700">
            + Analisador
          </Button>
        </div>
      </div>
    </form>
  );
};

export default AnalyzerForm;
