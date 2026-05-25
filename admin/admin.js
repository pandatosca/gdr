// admin/admin.js

import { initViews } from "./modules/views.js";

// ======================
// SUPABASE
// ======================

window.SUPABASE_URL =
"https://gyofijyebgtxzbtwlwbw.supabase.co";

window.SUPABASE_ANON_KEY =
"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd5b2ZpanllYmd0eHpidHdsd2J3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk2ODAzNDQsImV4cCI6MjA5NTI1NjM0NH0.4h8ZBSTHlJgag2V2Z-lSd_IgrcbcU5UmCfprzJpMQOo";

window.ADMIN_EMAIL =
"pixelcase@gmail.com";

window.supabaseClient =
supabase.createClient(
  SUPABASE_URL,
  SUPABASE_ANON_KEY
);

// ======================
// INIT
// ======================

window.addEventListener("DOMContentLoaded",()=>{

  console.log("CMS READY");

  initViews();

  // hide loading
  document
  .getElementById("loading-screen")
  ?.classList.add("hidden");

  // show login
  document
  .getElementById("login-view")
  ?.classList.remove("hidden");

});