export async function initActivities(){

  const {data} =
  await supabaseClient
  .from("activities")
  .select("*")
  .order("created_at",{ascending:false});

  const container =
  document.getElementById("activities-container");

  if(!data?.length){

    container.innerHTML =
    "Belum ada kegiatan.";

    return;
  }

  container.innerHTML =
  data.map(item=>`

    <article class="rounded-[28px] bg-white p-5 shadow-sm">

      ${
        item.image_url
        ? `
        <img
          src="${item.image_url}"
          class="h-52 w-full rounded-3xl object-cover"
        >
        `
        : ""
      }

      <h3 class="mt-4 text-xl font-black">
        ${item.title}
      </h3>

      <p class="mt-2 text-sm text-slate-500">
        ${item.description || ""}
      </p>

    </article>

  `).join("");

}