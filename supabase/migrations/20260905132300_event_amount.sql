-- Create event_amount table
CREATE TABLE IF NOT EXISTS public.event_amount (
  id integer PRIMARY KEY DEFAULT 1,
  invitations_planned text NOT NULL,
  businesses_expected text NOT NULL,
  visitor_capacity text NOT NULL,
  note text NOT NULL,
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  
  -- Ensure only one row exists (id must be 1)
  CONSTRAINT single_row CHECK (id = 1)
);

-- Enable RLS
ALTER TABLE public.event_amount ENABLE ROW LEVEL SECURITY;

-- Policies for event_amount
CREATE POLICY "Allow public read access to event_amount" 
ON public.event_amount FOR SELECT 
TO public 
USING (true);

CREATE POLICY "Allow authenticated update to event_amount" 
ON public.event_amount FOR UPDATE 
TO authenticated 
USING (true);

CREATE POLICY "Allow authenticated insert to event_amount" 
ON public.event_amount FOR INSERT 
TO authenticated 
WITH CHECK (true);

-- Insert default row
INSERT INTO public.event_amount (
  id, invitations_planned, businesses_expected, visitor_capacity, note
) VALUES (
  1,
  '≈ 500–600',
  '≈ 30',
  '≈ 100',
  'Indicative figures — subject to confirmation.'
) ON CONFLICT (id) DO NOTHING;
