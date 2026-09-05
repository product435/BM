-- Create event_experience table
CREATE TABLE IF NOT EXISTS public.event_experience (
  id integer PRIMARY KEY DEFAULT 1,
  eyebrow text NOT NULL,
  heading text NOT NULL,
  subheading text NOT NULL,
  agenda jsonb NOT NULL DEFAULT '[]'::jsonb,
  special_items jsonb NOT NULL DEFAULT '[]'::jsonb,
  value_strip jsonb NOT NULL DEFAULT '[]'::jsonb,
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  
  -- Ensure only one row exists (id must be 1)
  CONSTRAINT single_row CHECK (id = 1)
);

-- Enable RLS
ALTER TABLE public.event_experience ENABLE ROW LEVEL SECURITY;

-- Policies for event_experience
CREATE POLICY "Allow public read access to event_experience" 
ON public.event_experience FOR SELECT 
TO public 
USING (true);

CREATE POLICY "Allow authenticated update to event_experience" 
ON public.event_experience FOR UPDATE 
TO authenticated 
USING (true);

CREATE POLICY "Allow authenticated insert to event_experience" 
ON public.event_experience FOR INSERT 
TO authenticated 
WITH CHECK (true);

-- Insert default row
INSERT INTO public.event_experience (
  id, eyebrow, heading, subheading, agenda, special_items, value_strip
) VALUES (
  1,
  '09 — Event Day Experience',
  'A full day of ideas, insights & impact.',
  'Curated sessions, expert interactions, founder pitches, business networking and investment opportunities — all in one powerful experience.',
  '[
    { "time": "09:00 AM", "title": "Registration & Founder Coffee", "description": "Networking and welcome refreshments" },
    { "time": "09:45 AM", "title": "BMI Launch AV", "description": "The journey begins" },
    { "time": "10:00 AM", "title": "Opening & BMI Vision", "description": "Setting the vision for a new era of entrepreneurship" },
    { "time": "10:20 AM", "title": "Keynote: Brajesh Maheshwari", "description": "From Vision to Execution" },
    { "time": "10:45 AM", "title": "Aman Maheshwari Session", "description": "The New Generation of Entrepreneurship" },
    { "time": "11:05 AM", "title": "Business Leaders Panel", "description": "Industry insights, opportunities and the road ahead" },
    { "time": "11:45 AM", "title": "BMI Idea Lab", "description": "Student innovators pitch their ideas" },
    { "time": "12:20 PM", "title": "BMI Build — Startup Pitches", "description": "Early-stage startups pitch to experts" },
    { "time": "01:30 PM", "title": "Founder & Business Networking Lunch", "description": "Connections over curated lunch" },
    { "time": "02:30 PM", "title": "Vikas Patel Session", "description": "AI for Business: From Hype to Execution" },
    { "time": "03:00 PM", "title": "BMI Scale — Business Presentations", "description": "Operating businesses present growth opportunities" },
    { "time": "04:00 PM", "title": "Expert Clinics & Networking", "description": "1:1 expert interactions and ecosystem connections" },
    { "time": "04:30 PM", "title": "BMI Investment Event", "description": "Top founders and businesses in closed-door evaluation" },
    { "time": "05:30 PM", "title": "Recognition & Diligence Selections", "description": "Shortlisted ventures announced for next stage" },
    { "time": "06:00 PM", "title": "BMI Future Roadmap & Closing", "description": "What''s next for founders and the ecosystem" }
  ]'::jsonb,
  '[
    { "index": "01", "title": "Curated Participants", "description": "High-value founders, businesses, experts and partners." },
    { "index": "02", "title": "Actionable Insights", "description": "Practical knowledge from industry leaders." },
    { "index": "03", "title": "Powerful Networking", "description": "Meet the right people to collaborate and grow." },
    { "index": "04", "title": "Investment Opportunities", "description": "Get evaluated for potential investment and support." },
    { "index": "05", "title": "Beyond Funding", "description": "Access management, technology, operations and market support." }
  ]'::jsonb,
  '[
    { "title": "Discover", "description": "Promising ideas and businesses." },
    { "title": "Evaluate", "description": "Expert-led screening and due diligence." },
    { "title": "Support", "description": "Capital, capability and connections." },
    { "title": "Scale", "description": "Build sustainable and impactful enterprises." }
  ]'::jsonb
) ON CONFLICT (id) DO NOTHING;
