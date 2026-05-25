export function initAuth(){

  document
  .getElementById("logout-button")
  ?.addEventListener("click",async()=>{

    await supabaseClient.auth.signOut();

    location.reload();

  });

}