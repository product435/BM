import fs from 'fs';
import { QA_SESSION } from './src/data/eventData.js';
import { GUESTS } from './src/data/guests.js';

const data = {
  guests: GUESTS,
  faq: QA_SESSION
};

const sql = `
INSERT INTO public.site_content (id, data) VALUES (1, '${JSON.stringify(data).replace(/'/g, "''")}'::jsonb)
ON CONFLICT (id) DO UPDATE SET data = EXCLUDED.data;
`;

fs.writeFileSync('insert_content.sql', sql);
console.log('SQL generated.');
