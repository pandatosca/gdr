window.loadPendingPosts = async function () {
  const { data, error } = await window.supabaseClient
    .from("news_posts")
    .select("*")
    .eq("status", "pending")
    .order("created_at", {
      ascending: false,
    });

  if (error) {
    console.error(error);
    return;
  }

  console.log("pending posts:", data);

  const container = document.getElementById("pending-posts");

  if (!data || !data.length) {
    container.innerHTML = `
      <p>Tidak ada post pending.</p>
    `;

    return;
  }

  container.innerHTML = data
    .map(
      (item) => `
        <div
          style="
            border:1px solid #ddd;
            padding:16px;
            margin-bottom:12px;
            border-radius:12px;
          "
        >
          <h3>${item.title}</h3>

          <p>${item.content}</p>

          <small>
            ${item.author}
          </small>

          <br /><br />

          <button
            onclick="approvePost('${item.id}')"
          >
            Approve
          </button>

          <button
            onclick="deletePost('${item.id}')"
          >
            Delete
          </button>
        </div>
      `,
    )
    .join("");
};

window.approvePost = async function (id) {
  const { error } = await window.supabaseClient
    .from("news_posts")
    .update({
      status: "approved",
    })
    .eq("id", id);

  if (error) {
    alert(error.message);
    return;
  }

  await loadPendingPosts();

  alert("Post approved");
};

window.deletePost = async function (id) {
  const yes = confirm("Delete post?");

  if (!yes) return;

  const { error } = await window.supabaseClient
    .from("news_posts")
    .delete()
    .eq("id", id);

  if (error) {
    alert(error.message);
    return;
  }

  await loadPendingPosts();

  alert("Post deleted");
};
