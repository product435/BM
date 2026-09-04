import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: join(__dirname, '.env') });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function run() {
  // Mock Data
  const MOCK_APPLICANTS = [
    {
      registration_id: 'REG-1042', name: 'Aarav Sharma', email: 'aarav@techxyz.com', phone: '+91 9876543210', city: 'Jaipur',
      track: 'Track 2 (Startups)', status: 'Pending', payment_status: 'Paid',
      details: { startupName: 'TechXYZ', stage: 'Early Traction', revenue: '₹5L/mo', pitchDeck: 'techxyz_pitch.pdf', video: 'youtube.com/watch?v=123' },
      notes: ''
    },
    {
      registration_id: 'REG-1043', name: 'Priya Patel', email: 'priya@student.edu', phone: '+91 8765432109', city: 'Delhi',
      track: 'Track 1 (Students)', status: 'Under Review', payment_status: 'Pending',
      details: { college: 'IIT Delhi', course: 'B.Tech CSE', year: '3rd Year', idCard: 'priya_id.pdf' },
      notes: 'Strong academic background.'
    }
  ];

  const { data, error } = await supabase
    .from('registrations')
    .insert(MOCK_APPLICANTS)
    .select();

  if (error) {
    console.error('Error inserting data:', error);
  } else {
    console.log('Inserted:', data.length);
  }
}

run();
