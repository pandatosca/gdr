export function initViews(){

  document
  .querySelectorAll(".sidebar-btn")
  .forEach(btn=>{

    btn.addEventListener("click",()=>{

      const view =
      btn.dataset.view;

      document
      .querySelectorAll(".view-section")
      .forEach(el=>{
        el.classList.remove("active");
      });

      document
      .querySelectorAll(".sidebar-btn")
      .forEach(el=>{
        el.classList.remove("active");
      });

      document
      .getElementById("view-" + view)
      .classList.add("active");

      btn.classList.add("active");

    });

  });

}