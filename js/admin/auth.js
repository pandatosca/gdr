window.requireAdmin = async function () {
  const {
    data: { session },
  } = await window.supabaseClient.auth.getSession();

  if (!session) {
    window.location.href = "/admin/login.html";
    return null;
  }

  return session;
};

window.loginAdmin = async function (email, password) {
  const { data, error } = await window.supabaseClient.auth.signInWithPassword({
    email,
    password,
  });

  if (error) throw error;

  return data;
};

window.logoutAdmin = async function () {
  await window.supabaseClient.auth.signOut();

  window.location.href = "/admin/login.html";
};
