import { initAuth } from "./modules/auth.js";
import { initViews } from "./modules/views.js";
import { initPosts } from "./modules/posts.js";
import { initHero } from "./modules/hero.js";
import { initFacilities } from "./modules/facilities.js";
import { initActivities } from "./modules/activities.js";

window.SUPABASE_URL =
"https://gyofijyebgtxzbtwlwbw.supabase.co";

window.SUPABASE_ANON_KEY =
"YOUR_ANON_KEY";

window.ADMIN_EMAIL =
"pixelcase@gmail.com";

window.supabaseClient =
supabase.createClient(
  SUPABASE_URL,
  SUPABASE_ANON_KEY
);

document.getElementById("app").innerHTML = `

<div class="flex min-h-screen">

  <aside class="hidden min-h-screen w-[280px] shrink-0 border-r border-slate-200 bg-white lg:flex lg:flex-col">

    <div class="border-b border-slate-200 p-6">

      <h1 class="text-2xl font-black">
        GDR CMS
      </h1>

      <p class="text-sm text-slate-400">
        Admin Panel
      </p>

    </div>

    <nav class="flex-1 space-y-2 p-4">

      <button class="sidebar-btn active w-full rounded-2xl px-4 py-3 text-left font-bold" data-view="dashboard">
        Dashboard
      </button>

      <button class="sidebar-btn w-full rounded-2xl px-4 py-3 text-left font-bold" data-view="hero">
        Hero
      </button>

      <button class="sidebar-btn w-full rounded-2xl px-4 py-3 text-left font-bold" data-view="fasilitas">
        Fasilitas
      </button>

      <button class="sidebar-btn w-full rounded-2xl px-4 py-3 text-left font-bold" data-view="kegiatan">
        Kegiatan
      </button>

    </nav>

    <div class="border-t border-slate-200 p-4">

      <button
        id="logout-button"
        class="w-full rounded-2xl bg-slate-900 px-4 py-3 font-black text-white"
      >
        Logout
      </button>

    </div>

  </aside>

  <main class="flex-1 p-5 lg:p-8">

    <section
      class="view-section active"
      id="view-dashboard"
    >

      <div class="rounded-[32px] bg-white p-6 shadow-sm">

        <h1 class="text-3xl font-black">
          Dashboard
        </h1>

      </div>

      <div
        id="posts-container"
        class="mt-6 grid gap-5"
      ></div>

    </section>

    <section
      class="view-section"
      id="view-hero"
    >

      <div class="rounded-[32px] bg-white p-6 shadow-sm">

        <h1 class="text-3xl font-black">
          Hero
        </h1>

      </div>

    </section>

    <section
      class="view-section"
      id="view-fasilitas"
    >

      <div class="rounded-[32px] bg-white p-6 shadow-sm">

        <h1 class="text-3xl font-black">
          Fasilitas
        </h1>

        <div
          id="facilities-container"
          class="mt-6 grid gap-5 md:grid-cols-2 xl:grid-cols-3"
        ></div>

      </div>

    </section>

    <section
      class="view-section"
      id="view-kegiatan"
    >

      <div class="rounded-[32px] bg-white p-6 shadow-sm">

        <h1 class="text-3xl font-black">
          Kegiatan
        </h1>

        <div
          id="activities-container"
          class="mt-6 grid gap-5 md:grid-cols-2 xl:grid-cols-3"
        ></div>

      </div>

    </section>

  </main>

</div>

`;

initAuth();
initViews();
initPosts();
initHero();
initFacilities();
initActivities();