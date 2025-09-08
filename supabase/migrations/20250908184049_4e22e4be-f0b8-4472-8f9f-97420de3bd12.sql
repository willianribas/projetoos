-- Update RLS policies for analyzers table to allow public access
DROP POLICY IF EXISTS "All users can view analyzers" ON public.analyzers;
DROP POLICY IF EXISTS "All users can create analyzers" ON public.analyzers;
DROP POLICY IF EXISTS "All users can update analyzers" ON public.analyzers;
DROP POLICY IF EXISTS "All users can delete analyzers" ON public.analyzers;

-- Create new public policies for analyzers
CREATE POLICY "Public can view analyzers" 
ON public.analyzers 
FOR SELECT 
USING (true);

CREATE POLICY "Public can create analyzers" 
ON public.analyzers 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Public can update analyzers" 
ON public.analyzers 
FOR UPDATE 
USING (true)
WITH CHECK (true);

CREATE POLICY "Public can delete analyzers" 
ON public.analyzers 
FOR DELETE 
USING (true);