window.renderNews = function () {
  const grid = document.getElementById("news-grid");

  if (!grid) return;

  const filtered =
    window.currentCategory === "semua"
      ? appState.news
      : appState.news.filter(
          (item) => item.category === window.currentCategory,
        );

  if (!filtered.length) {
    grid.innerHTML = `
      <div class="col-span-full rounded-3xl border border-dashed border-slate-300 bg-white/80 p-10 text-center text-slate-500">
        Belum ada kabar pada kategori ini.
      </div>
    `;

    return;
  }

  grid.innerHTML = filtered
    .map((item) => {
      const categoryClass =
        categoryClasses[item.category] || "bg-slate-100 text-slate-700";

      return `
        <article class="group overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl">
          <button
            class="flex h-full flex-col text-left"
            onclick="openDetailDialog('${item.id}')"
          >
            <div
              class="image-cover h-52 w-full"
              style="background-image:url('${item.image}')"
            ></div>

            <div class="flex flex-1 flex-col gap-4 p-6">
              <div class="flex items-center justify-between gap-3 text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">
                <span class="rounded-full px-3 py-1 ${categoryClass}">
                  ${item.category}
                </span>

                <span>${formatDate(item.date)}</span>
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
                <span>${item.author}</span>

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
