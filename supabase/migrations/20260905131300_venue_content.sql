-- Create venue_content table
CREATE TABLE IF NOT EXISTS public.venue_content (
  id integer PRIMARY KEY DEFAULT 1,
  eyebrow text NOT NULL,
  title_line_1 text NOT NULL,
  title_line_2 text NOT NULL,
  description text NOT NULL,
  image_url text NOT NULL,
  image_caption text NOT NULL,
  event_date text NOT NULL,
  location text NOT NULL,
  venue_status text NOT NULL,
  participation_text text NOT NULL,
  venue_note text NOT NULL,
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  
  -- Ensure only one row exists (id must be 1)
  CONSTRAINT single_row CHECK (id = 1)
);

-- Enable RLS
ALTER TABLE public.venue_content ENABLE ROW LEVEL SECURITY;

-- Policies for venue_content
CREATE POLICY "Allow public read access to venue_content" 
ON public.venue_content FOR SELECT 
TO public 
USING (true);

CREATE POLICY "Allow authenticated update to venue_content" 
ON public.venue_content FOR UPDATE 
TO authenticated 
USING (true);

CREATE POLICY "Allow authenticated insert to venue_content" 
ON public.venue_content FOR INSERT 
TO authenticated 
WITH CHECK (true);

-- Insert default row
INSERT INTO public.venue_content (
  id, eyebrow, title_line_1, title_line_2, description, image_url, image_caption, event_date, location, venue_status, participation_text, venue_note
) VALUES (
  1,
  '10 — The Venue',
  'The next conversation',
  'starts in Jaipur.',
  'A city of craft and commerce — home to a growing student-and-startup ecosystem, campuses like MNIT, and a generation of founders who build for India. Jaipur isn''t just the backdrop. It''s part of the pitch.',
  'https://images.pexels.com/photos/9275222/pexels-photo-9275222.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1000&w=1800',
  'The Pink City — tradition with an eye on tomorrow',
  '20th',
  'Jaipur',
  'To be announced',
  'By registration',
  'Precise location will be shared with confirmed attendees to maintain the privacy of the gathering.'
) ON CONFLICT (id) DO NOTHING;
