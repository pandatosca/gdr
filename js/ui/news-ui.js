window.renderNewsSkeleton = function () {
  const grid = document.getElementById("news-grid");

  if (!grid) return;

  grid.innerHTML = Array(6)
    .fill(
      `
        <div class="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
          <div class="h-52 animate-pulse bg-slate-200"></div>

          <div class="space-y-4 p-6">
            <div class="h-4 w-24 animate-pulse rounded bg-slate-200"></div>

            <div class="space-y-2">
              <div class="h-6 w-3/4 animate-pulse rounded bg-slate-200"></div>

              <div class="h-4 w-full animate-pulse rounded bg-slate-200"></div>

              <div class="h-4 w-5/6 animate-pulse rounded bg-slate-200"></div>
            </div>

            <div class="h-4 w-20 animate-pulse rounded bg-slate-200"></div>
          </div>
        </div>
      `,
    )
    .join("");
};
window.renderNews = function () {
  const grid = document.getElementById("news-grid");

  if (!grid) return;

  const filtered =
    window.currentCategory === "semua"
      ? appState.news
      : appState.news.filter(
          (item) => item.category === window.currentCategory,
        );

  const visibleNews = filtered.slice(0, window.newsLimit || 6);

  const loadMoreButton = document.getElementById("load-more-news");

  if (loadMoreButton) {
    loadMoreButton.style.display =
      filtered.length > (window.newsLimit || 6) ? "inline-flex" : "none";
  }

  if (!filtered.length) {
    grid.innerHTML = `
      <div class="col-span-full rounded-3xl border border-dashed border-slate-300 bg-white/80 p-10 text-center text-slate-500">
        Belum ada kabar pada kategori ini.
      </div>
    `;

    return;
  }

  grid.innerHTML = visibleNews
    .map((item) => {
      const categoryClass =
        categoryClasses[item.category] || "bg-slate-100 text-slate-700";

      return `
        <article class="group overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl">
          <button
            class="flex h-full flex-col text-left"
            onclick="openDetailDialog('${item.id}')"
          >
            <img
              src="${item.image}"
              loading="lazy"
              class="h-52 w-full object-cover"
            />

            <div class="flex flex-1 flex-col gap-4 p-6">
              <div class="flex items-center justify-between gap-3 text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">
                <span class="rounded-full px-3 py-1 ${categoryClass}">
                  ${item.category}
                </span>

                <span>
                  ${formatDate(item.date)}
                </span>
              </div>

              <div>
                <h3 class="text-xl font-semibold text-slate-900 transition group-hover:text-forest-700">
                  ${item.title}
                </h3>

                <p class="mt-3 line-clamp-3 text-sm leading-6 text-slate-600">
                  ${item.content}
                </p>
              </div>

              <div class="mt-auto flex items-center justify-between pt-2 text-sm text-slate-500">
                <span>
                  ${item.author}
                </span>

                <span class="inline-flex items-center gap-2 font-semibold text-forest-700">
                  Baca Detail
                </span>
              </div>
            </div>
          </button>
        </article>
      `;
    })
    .join("");
};
