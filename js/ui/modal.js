window.openDialog = function (id) {
  window.closeMobileMenu();

  const el = document.getElementById(id);

  el.classList.remove("hidden");
  el.classList.add("flex");

  document.body.classList.add("dialog-open");
};

window.closeDialog = function (id) {
  const el = document.getElementById(id);

  if (!el) return;

  el.classList.add("hidden");
  el.classList.remove("flex");

  if (!document.querySelector(".fixed.flex")) {
    document.body.classList.remove("dialog-open");
  }
};

window.openPostDialog = function () {
  window.openDialog("post-dialog");

  setTimeout(() => {
    document.getElementById("post-author").focus();
  }, 50);
};

window.closeMobileMenu = function () {
  const menu = document.getElementById("mobile-menu");
  const button = document.getElementById("menu-button");

  if (!menu || !button) return;

  menu.classList.add("hidden");

  button.setAttribute("aria-expanded", "false");
};
