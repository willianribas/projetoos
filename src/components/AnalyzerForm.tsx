import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Calendar } from '@/components/ui/calendar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format, parse } from 'date-fns';
import { formatCalendarDate, defaultLocale } from '@/lib/dateUtils';
import { Analyzer } from '@/types/analyzer';
import { CalendarIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Switch } from '@/components/ui/switch';

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
    watch,
    formState: { errors },
  } = useForm<Omit<Analyzer, 'id' | 'created_at' | 'user_id'>>({
    defaultValues: {
      serial_number: initialData?.serial_number || '',
      name: initialData?.name || '',
      model: initialData?.model || '',
      brand: initialData?.brand || '',
      certificate_number: initialData?.certificate_number || '',
      calibration_due_date: initialData?.calibration_due_date || '',
      in_calibration: initialData?.in_calibration || false,
    }
  });
  
  const [date, setDate] = useState<Date | undefined>(
    initialData?.calibration_due_date 
      ? parse(initialData.calibration_due_date.substring(0, 7), 'yyyy-MM', new Date()) 
      : undefined
  );

  const inCalibration = watch('in_calibration');

  const handleFormSubmit = (data: Omit<Analyzer, 'id' | 'created_at' | 'user_id'>) => {
    // Set default values for empty fields with a dash
    const submittedData = {
      ...data,
      serial_number: data.serial_number || '-',
      model: data.model || '-',
      brand: data.brand || '-',
      certificate_number: data.certificate_number || '-',
      calibration_due_date: data.calibration_due_date || format(new Date(), 'yyyy-MM-dd'),
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
          <Label htmlFor="certificate_number">N° do Certificado</Label>
          <Input
            id="certificate_number"
            {...register('certificate_number')}
            placeholder="Digite o número do certificado"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="calibration_due_date" className="text-sm font-medium text-foreground">
            Data de Vencimento
          </Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={"outline"}
                className={cn(
                  "w-full justify-start text-left font-normal h-11 px-4 py-2",
                  "border-input bg-background hover:bg-accent hover:text-accent-foreground",
                  "transition-all duration-200 shadow-sm hover:shadow-md",
                  "focus:ring-2 focus:ring-primary/20 focus:border-primary",
                  !date && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-3 h-4 w-4 text-muted-foreground flex-shrink-0" />
                {date ? (
                  <span className="text-foreground font-medium">
                    {formatCalendarDate(date)}
                  </span>
                ) : (
                  <span className="text-muted-foreground">Selecione a data de vencimento</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent 
              className="w-auto p-0 shadow-xl border bg-card/95 backdrop-blur-sm" 
              align="start"
              side="bottom"
              sideOffset={8}
            >
              <div className="bg-card rounded-lg border shadow-xl overflow-hidden">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={(newDate) => {
                    setDate(newDate);
                    if (newDate) {
                      setValue('calibration_due_date', format(newDate, 'yyyy-MM-dd'));
                    }
                  }}
                  locale={defaultLocale}
                  initialFocus
                  className={cn(
                    "p-4 pointer-events-auto",
                    "text-foreground bg-card"
                  )}
                  classNames={{
                    months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
                    month: "space-y-4",
                    caption: "flex justify-center pt-1 relative items-center text-foreground font-medium",
                    caption_label: "text-sm font-medium text-foreground",
                    caption_dropdowns: "flex justify-center gap-1",
                    nav: "space-x-1 flex items-center",
                    nav_button: cn(
                      "h-7 w-7 bg-transparent p-0 text-muted-foreground hover:text-foreground",
                      "hover:bg-accent rounded-md transition-colors"
                    ),
                    nav_button_previous: "absolute left-1",
                    nav_button_next: "absolute right-1",
                    table: "w-full border-collapse space-y-1",
                    head_row: "flex",
                    head_cell: "text-muted-foreground rounded-md w-8 font-normal text-[0.8rem] text-center",
                    row: "flex w-full mt-2",
                    cell: cn(
                      "relative p-0 text-center text-sm focus-within:relative focus-within:z-20",
                      "h-8 w-8 rounded-md hover:bg-accent transition-colors"
                    ),
                    day: cn(
                      "h-8 w-8 p-0 font-normal text-foreground hover:bg-accent hover:text-accent-foreground",
                      "rounded-md transition-colors focus:bg-accent focus:text-accent-foreground"
                    ),
                    day_range_end: "day-range-end",
                    day_selected: "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
                    day_today: "bg-accent text-accent-foreground font-semibold",
                    day_outside: "text-muted-foreground opacity-50",
                    day_disabled: "text-muted-foreground opacity-50 cursor-not-allowed",
                    day_range_middle: "aria-selected:bg-accent aria-selected:text-accent-foreground",
                    day_hidden: "invisible",
                    dropdown: cn(
                      "bg-background border border-input rounded-md px-3 py-1 text-sm",
                      "focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary",
                      "text-foreground"
                    ),
                    dropdown_month: "mr-2",
                    dropdown_year: "",
                  }}
                  captionLayout="dropdown-buttons"
                  fromYear={2020}
                  toYear={2035}
                  showOutsideDays={false}
                  defaultMonth={date || new Date()}
                />
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </div>

      {/* Show "Em Calibração" switch when editing */}
      {initialData && (
        <div className="flex items-center gap-2 pt-2">
          <Switch
            id="in_calibration"
            checked={inCalibration}
            onCheckedChange={(checked) => {
              setValue('in_calibration', checked);
            }}
            className={inCalibration ? "bg-blue-500" : ""}
          />
          <Label htmlFor="in_calibration">Em Calibração</Label>
        </div>
      )}

      {!initialData && (
        <div className="flex justify-end pt-4">
          <input 
            type="hidden" 
            {...register('in_calibration')} 
            value="false" 
          />
          <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
            + Analisador
          </Button>
        </div>
      )}

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