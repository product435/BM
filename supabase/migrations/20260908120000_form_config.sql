CREATE TABLE IF NOT EXISTS public.form_config (
  id integer PRIMARY KEY DEFAULT 1,
  categories jsonb NOT NULL,
  form_fields jsonb NOT NULL,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Ensure only one row (id=1)
ALTER TABLE public.form_config DROP CONSTRAINT IF EXISTS form_config_single_row;
ALTER TABLE public.form_config ADD CONSTRAINT form_config_single_row CHECK (id = 1);

INSERT INTO public.form_config (id, categories, form_fields)
VALUES (
  1,
  '[
    { "id": "student", "index": "01", "title": "Student", "tagline": "For ambitious students & emerging ideas", "description": "Walk in with your idea however early it is. This is where it meets its first audience and its first real questions.", "cta": "Register as student" },
    { "id": "visitor", "index": "02", "title": "Visitor", "tagline": "For those who want to be in the event", "description": "No pitch, no pressure. Just the best seats in the house for ideas, investments and honest conversations.", "cta": "Register as visitor" },
    { "id": "entrepreneur", "index": "03", "title": "Entrepreneur", "tagline": "For founders building something real", "description": "Show your business to investors, operators and peers. Come for the pitch leave with the connections.", "cta": "Register as entrepreneur" },
    { "id": "businessTycoon", "index": "04", "title": "Business Tycoon", "tagline": "For established leaders scaling something bigger", "description": "A dedicated space for business leaders shaping the next generation of founders, builders and bold thinkers.", "cta": "Register as business tycoon" }
  ]'::jsonb,
  '{
    "student": [
      { "name": "fullName", "label": "Full Name", "type": "text", "required": true, "autoComplete": "name" },
      { "name": "email", "label": "Email Address", "type": "email", "required": true, "autoComplete": "email" },
      { "name": "phone", "label": "Phone Number", "type": "tel", "required": true, "autoComplete": "tel" },
      { "name": "college", "label": "College / Institution", "type": "text", "required": true },
      { "name": "city", "label": "City", "type": "text", "required": true },
      { "name": "role", "label": "Role", "type": "text", "required": true },
      { "name": "interest", "label": "Idea / Interest", "type": "text", "required": false },
      { "name": "description", "label": "Short Description", "type": "textarea", "required": true, "rows": 4, "hint": "Your idea, or what you hope to gain — two or three lines is plenty." }
    ],
    "entrepreneur": [
      { "name": "founderName", "label": "Founder Name", "type": "text", "required": true, "autoComplete": "name" },
      { "name": "startupName", "label": "Startup Name", "type": "text", "required": true },
      { "name": "email", "label": "Email Address", "type": "email", "required": true, "autoComplete": "email" },
      { "name": "phone", "label": "Phone Number", "type": "tel", "required": true, "autoComplete": "tel" },
      { "name": "city", "label": "City", "type": "text", "required": true },
      { "name": "role", "label": "Role", "type": "text", "required": true },
      { "name": "industry", "label": "Industry / Category", "type": "text", "required": true },
      { "name": "startupDescription", "label": "Startup Description", "type": "textarea", "required": true, "rows": 4, "hint": "What you build, who it serves, and the traction so far." },
      { "name": "website", "label": "Website / LinkedIn (optional)", "type": "url", "required": false }
    ],
    "businessTycoon": [
      { "name": "contactPerson", "label": "Contact Person Name", "type": "text", "required": true, "autoComplete": "name" },
      { "name": "businessName", "label": "Business Name", "type": "text", "required": true },
      { "name": "email", "label": "Email Address", "type": "email", "required": true, "autoComplete": "email" },
      { "name": "phone", "label": "Phone Number", "type": "tel", "required": true, "autoComplete": "tel" },
      { "name": "city", "label": "City", "type": "text", "required": true },
      { "name": "role", "label": "Role", "type": "text", "required": true },
      { "name": "businessDescription", "label": "Business Description", "type": "textarea", "required": true, "rows": 4, "hint": "What your business builds, and how you champion growth and innovation." }
    ],
    "visitor": [
      { "name": "fullName", "label": "Full Name", "type": "text", "required": true, "autoComplete": "name" },
      { "name": "email", "label": "Email Address", "type": "email", "required": true, "autoComplete": "email" },
      { "name": "phone", "label": "Phone Number", "type": "tel", "required": true, "autoComplete": "tel" },
      { "name": "city", "label": "City", "type": "text", "required": true },
      { "name": "role", "label": "Role", "type": "text", "required": true }
    ]
  }'::jsonb
)
ON CONFLICT (id) DO NOTHING;

ALTER TABLE public.form_config ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Enable read access for all users" ON public.form_config FOR SELECT USING (true);
CREATE POLICY "Enable update for authenticated users only" ON public.form_config FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Enable insert for authenticated users only" ON public.form_config FOR INSERT WITH CHECK (auth.role() = 'authenticated');
