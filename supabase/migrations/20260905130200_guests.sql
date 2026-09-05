-- Create guests table
CREATE TABLE IF NOT EXISTS public.guests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  initials text NOT NULL,
  role text NOT NULL,
  description text NOT NULL,
  image_url text,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS
ALTER TABLE public.guests ENABLE ROW LEVEL SECURITY;

-- Policies for guests
CREATE POLICY "Allow public read access to guests" 
ON public.guests FOR SELECT 
TO public 
USING (true);

CREATE POLICY "Allow authenticated full access to guests" 
ON public.guests FOR ALL
TO authenticated 
USING (true)
WITH CHECK (true);

-- Insert default seed data
INSERT INTO public.guests (id, name, initials, role, description, sort_order) VALUES 
  ('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'BM Sir', 'BM', 'Speaker details to be announced', 'Conversation details will be shared as the lineup is confirmed.', 1),
  ('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a12', 'Abhishek', 'AB', 'Speaker details to be announced', 'Conversation details will be shared as the lineup is confirmed.', 2),
  ('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a13', 'Aman', 'AM', 'Q&A & discussion session', 'Leading the open-floor conversation — questions from the event, answered straight.', 3),
  ('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a14', 'Rajat', 'RJ', 'Speaker details to be announced', 'Conversation details will be shared as the lineup is confirmed.', 4),
  ('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a15', 'Pinkash', 'PK', 'Speaker details to be announced', 'Conversation details will be shared as the lineup is confirmed.', 5),
  ('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a16', 'Dr. Sanjeev Saxena', 'SS', 'Speaker details to be announced', 'Conversation details will be shared as the lineup is confirmed.', 6)
ON CONFLICT (id) DO NOTHING;
