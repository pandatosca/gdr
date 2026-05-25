// admin/modules/auth.js

export function initAuth(){

  const loginForm =
  document.getElementById("login-form");

  const loginError =
  document.getElementById("login-error");

  const loginView =
  document.getElementById("login-view");

  const cmsView =
  document.getElementById("cms-view");

  loginForm?.addEventListener("submit",async(e)=>{

    e.preventDefault();

    loginError.classList.add("hidden");

    const password =
    document.getElementById("password").value;

    const {data,error} =
    await supabaseClient.auth.signInWithPassword({

      email: ADMIN_EMAIL,
      password

    });

    if(error || !data.session){

      loginError.textContent =
      "Password salah.";

      loginError.classList.remove("hidden");

      return;

    }

    loginView.classList.add("hidden");

    cmsView.classList.remove("hidden");

  });

  // session check

  supabaseClient.auth
  .getSession()
  .then(({data})=>{

    if(data.session){

      loginView.classList.add("hidden");

      cmsView.classList.remove("hidden");

    }

  });

  // logout

  document
  .getElementById("logout-button")
  ?.addEventListener("click",async()=>{

    await supabaseClient.auth.signOut();

    location.reload();

  });

}