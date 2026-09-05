-- Create qa_session table
CREATE TABLE IF NOT EXISTS public.qa_session (
  id integer PRIMARY KEY DEFAULT 1,
  eyebrow text NOT NULL,
  title_plain text NOT NULL,
  title_italic text NOT NULL,
  title_end text NOT NULL,
  lede text NOT NULL,
  quote text NOT NULL,
  faqs jsonb NOT NULL DEFAULT '[]'::jsonb,
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  
  -- Ensure only one row exists (id must be 1)
  CONSTRAINT single_row CHECK (id = 1)
);

-- Enable RLS
ALTER TABLE public.qa_session ENABLE ROW LEVEL SECURITY;

-- Policies for qa_session
CREATE POLICY "Allow public read access to qa_session" 
ON public.qa_session FOR SELECT 
TO public 
USING (true);

CREATE POLICY "Allow authenticated update to qa_session" 
ON public.qa_session FOR UPDATE 
TO authenticated 
USING (true);

CREATE POLICY "Allow authenticated insert to qa_session" 
ON public.qa_session FOR INSERT 
TO authenticated 
WITH CHECK (true);

-- Insert default row
INSERT INTO public.qa_session (
  id, eyebrow, title_plain, title_italic, title_end, lede, quote, faqs
) VALUES (
  1,
  '08 — Q&A Session',
  'Ask. ',
  'Challenge.',
  ' Learn.',
  'An open-floor conversation, not a monologue. Bring the questions you''ve been sitting on — the event is listening.',
  'No question too early. No idea too small.',
  '[
    { "question": "Who can apply to pitch?", "answer": "Founders, startups and operating businesses with a clear idea, product, service or growth opportunity can apply. Applications are reviewed based on relevance and readiness." },
    { "question": "Is there an application fee?", "answer": "Any applicable registration or participation fee will be communicated clearly during the registration process." },
    { "question": "How are startups selected?", "answer": "Applications are reviewed based on stage, clarity, business potential, execution readiness and fit with the event''s evaluation criteria." },
    { "question": "Do investors get materials in advance?", "answer": "Relevant venture information may be shared with selected investors and evaluators before scheduled pitch or discussion sessions, where appropriate." },
    { "question": "Can I attend without pitching?", "answer": "Yes. Participants may attend for learning, networking, expert interactions and business conversations without pitching, depending on the selected registration category." },
    { "question": "Is the summit streamed?", "answer": "Streaming or digital access details will be announced separately if available." }
  ]'::jsonb
) ON CONFLICT (id) DO NOTHING;
