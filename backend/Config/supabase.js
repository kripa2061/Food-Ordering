import dotenv from "dotenv";
dotenv.config();
import { createClient } from '@supabase/supabase-js';
import ws from 'ws';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY; // 👈 fix this
console.log("SUPABASE_URL:", process.env.SUPABASE_URL);
console.log("Bucket:", "products");
export const supabase = createClient(supabaseUrl, supabaseKey, {
  realtime: {
    transport: ws,
  },
});

