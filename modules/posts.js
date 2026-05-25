export async function initPosts(){

  const {data,error} =
  await supabaseClient
  .from("news_posts")
  .select("*")
  .order("created_at",{ascending:false});

  const container =
  document.getElementById("posts-container");

  if(error){

    container.innerHTML =
    error.message;

    return;
  }

  container.innerHTML =
  data.map(post=>`

    <article class="rounded-[28px] bg-white p-5 shadow-sm">

      <h3 class="text-2xl font-black">
        ${post.title}
      </h3>

      <p class="mt-3 text-sm text-slate-500">
        ${post.content}
      </p>

    </article>

  `).join("");

}