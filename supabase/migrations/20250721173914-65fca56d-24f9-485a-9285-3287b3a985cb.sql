-- Drop existing restrictive policies for analyzers
DROP POLICY IF EXISTS "Users can view their own analyzers" ON public.analyzers;
DROP POLICY IF EXISTS "Users can update their own analyzers" ON public.analyzers;
DROP POLICY IF EXISTS "Users can delete their own analyzers" ON public.analyzers;
DROP POLICY IF EXISTS "Users can create their own analyzers" ON public.analyzers;

-- Create new global policies for all authenticated users
CREATE POLICY "All users can view analyzers" 
ON public.analyzers 
FOR SELECT 
TO authenticated
USING (true);

CREATE POLICY "All users can create analyzers" 
ON public.analyzers 
FOR INSERT 
TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "All users can update analyzers" 
ON public.analyzers 
FOR UPDATE 
TO authenticated
USING (true)
WITH CHECK (true);

CREATE POLICY "All users can delete analyzers" 
ON public.analyzers 
FOR DELETE 
TO authenticated
USING (true);