
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Calendar } from '@/components/ui/calendar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format, parse } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Analyzer } from '@/types/analyzer';
import { CalendarIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AnalyzerFormProps {
  onSubmit: (data: Omit<Analyzer, 'id' | 'created_at' | 'user_id'>) => void;
  inDialog?: boolean;
  initialData?: Partial<Analyzer>;
}

const AnalyzerForm = ({ onSubmit, inDialog = false, initialData }: AnalyzerFormProps) => {
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<Omit<Analyzer, 'id' | 'created_at' | 'user_id'>>({
    defaultValues: {
      serial_number: initialData?.serial_number || '',
      name: initialData?.name || '',
      model: initialData?.model || '',
      brand: initialData?.brand || '',
      calibration_due_date: initialData?.calibration_due_date || '',
      in_calibration: initialData?.in_calibration || false,
    }
  });
  
  const [date, setDate] = useState<Date | undefined>(
    initialData?.calibration_due_date 
      ? parse(initialData.calibration_due_date.substring(0, 7), 'yyyy-MM', new Date()) 
      : undefined
  );

  const handleFormSubmit = (data: Omit<Analyzer, 'id' | 'created_at' | 'user_id'>) => {
    // Set default values for empty fields with a dash
    const submittedData = {
      ...data,
      serial_number: data.serial_number || '-',
      model: data.model || '-',
      brand: data.brand || '-',
      calibration_due_date: data.calibration_due_date || format(new Date(), 'yyyy-MM-01'),
    };
    
    onSubmit(submittedData);
    if (!initialData) {
      reset();
      setDate(undefined);
    }
  };

  const wrapperClass = inDialog ? '' : 'p-4 bg-card rounded-lg border';

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className={`space-y-4 ${wrapperClass}`}>
      {!inDialog && <h2 className="text-xl font-bold">Adicionar Analisador</h2>}
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name">Nome <span className="text-red-500">*</span></Label>
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
          <Label htmlFor="serial_number">N° de Série / Patrimônio</Label>
          <Input
            id="serial_number"
            {...register('serial_number')}
            placeholder="Digite o N° de Série ou Patrimônio"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="brand">Marca</Label>
          <Input
            id="brand"
            {...register('brand')}
            placeholder="Digite a marca do analisador"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="model">Modelo</Label>
          <Input
            id="model"
            {...register('model')}
            placeholder="Digite o modelo do analisador"
          />
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
                {date ? format(date, "MMM yyyy", { locale: ptBR }) : <span>Selecione a data</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={date}
                onSelect={(newDate) => {
                  setDate(newDate);
                  if (newDate) {
                    setValue('calibration_due_date', format(newDate, 'yyyy-MM-01'));
                  }
                }}
                initialFocus
                className={cn("p-3 pointer-events-auto")}
                captionLayout="dropdown-buttons"
                fromYear={2020}
                toYear={2030}
                showOutsideDays={false}
                defaultMonth={date || new Date()}
              />
            </PopoverContent>
          </Popover>
        </div>

        {/* Only show "Em Calibração" when editing, not when adding new */}
        {initialData && (
          <div className="space-y-2 flex items-end">
            <input 
              type="checkbox" 
              id="in_calibration"
              className="mr-2" 
              checked={initialData.in_calibration}
              {...register('in_calibration')} 
            />
            <Label htmlFor="in_calibration">Em Calibração</Label>
          </div>
        )}

        {!initialData && (
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
        )}
      </div>

      {initialData && (
        <div className="flex justify-end gap-2 pt-4">
          <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
            Salvar Alterações
          </Button>
        </div>
      )}
    </form>
  );
};

export default AnalyzerForm;
