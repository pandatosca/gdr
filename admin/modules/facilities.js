export async function initFacilities(){

  const {data} =
  await supabaseClient
  .from("facilities")
  .select("*")
  .order("created_at",{ascending:false});

  const container =
  document.getElementById("facilities-container");

  if(!data?.length){

    container.innerHTML =
    "Belum ada fasilitas.";

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