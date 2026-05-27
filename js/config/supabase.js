const SUPABASE_URL = "https://gyofijyebgtxzbtwlwbw.supabase.co";

const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd5b2ZpanllYmd0eHpidHdsd2J3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk2ODAzNDQsImV4cCI6MjA5NTI1NjM0NH0.4h8ZBSTHlJgag2V2Z-lSd_IgrcbcU5UmCfprzJpMQOo";

window.supabaseClient = window.supabase.createClient(
  SUPABASE_URL,
  SUPABASE_ANON_KEY,
);
