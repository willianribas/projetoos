-- Adicionar coluna certificate_number na tabela analyzers
ALTER TABLE public.analyzers 
ADD COLUMN certificate_number TEXT DEFAULT '-';

-- Atualizar registros existentes que possam ter valor NULL
UPDATE public.analyzers 
SET certificate_number = '-' 
WHERE certificate_number IS NULL;