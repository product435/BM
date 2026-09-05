-- Create hero_content table
CREATE TABLE IF NOT EXISTS public.hero_content (
  id integer PRIMARY KEY DEFAULT 1,
  city text NOT NULL,
  event_date text NOT NULL,
  eyebrow text NOT NULL,
  title_line_1 text NOT NULL,
  title_line_2 text NOT NULL,
  sub_text text NOT NULL,
  primary_cta_text text NOT NULL,
  secondary_cta_text text NOT NULL,
  ticker text NOT NULL,
  hero_image text NOT NULL,
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  
  -- Ensure only one row exists (id must be 1)
  CONSTRAINT single_row CHECK (id = 1)
);

-- Enable RLS
ALTER TABLE public.hero_content ENABLE ROW LEVEL SECURITY;

-- Policies for hero_content
CREATE POLICY "Allow public read access to hero_content" 
ON public.hero_content FOR SELECT 
TO public 
USING (true);

CREATE POLICY "Allow authenticated update to hero_content" 
ON public.hero_content FOR UPDATE 
TO authenticated 
USING (true);

CREATE POLICY "Allow authenticated insert to hero_content" 
ON public.hero_content FOR INSERT 
TO authenticated 
WITH CHECK (true);

-- Insert default row
INSERT INTO public.hero_content (
  id, city, event_date, eyebrow, title_line_1, title_line_2, sub_text, primary_cta_text, secondary_cta_text, ticker, hero_image
) VALUES (
  1,
  'Jaipur',
  '20th',
  'Capital. Capability. Connections.',
  'Where ideas',
  'meet opportunity',
  'A curated platform for founders, innovators, operating businesses, industry leaders and strategic partners to connect, build and scale. — in Jaipur, on the 20th — to explore what comes next.',
  'Register now',
  'Explore the event',
  'Startup Pitches, Investment Conversations, Business Networking, Student Ideas, E-Sales, Innovation',
  'https://images.pexels.com/photos/9275222/pexels-photo-9275222.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1000&w=1800'
) ON CONFLICT (id) DO NOTHING;


-- Create storage bucket for hero media
INSERT INTO storage.buckets (id, name, public) 
VALUES ('hero_media', 'hero_media', true)
ON CONFLICT (id) DO NOTHING;

-- Policies for storage
CREATE POLICY "Public Access for hero_media"
ON storage.objects FOR SELECT
TO public
USING ( bucket_id = 'hero_media' );

CREATE POLICY "Authenticated Upload for hero_media"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK ( bucket_id = 'hero_media' );

CREATE POLICY "Authenticated Update for hero_media"
ON storage.objects FOR UPDATE
TO authenticated
USING ( bucket_id = 'hero_media' );

CREATE POLICY "Authenticated Delete for hero_media"
ON storage.objects FOR DELETE
TO authenticated
USING ( bucket_id = 'hero_media' );
