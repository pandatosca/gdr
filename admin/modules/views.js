// admin/modules/views.js

export function initViews(){

  const buttons =
  document.querySelectorAll(".sidebar-btn");

  buttons.forEach(btn=>{

    btn.addEventListener("click",()=>{

      const view =
      btn.dataset.view;

      // remove active button
      buttons.forEach(el=>{
        el.classList.remove("active");
      });

      // add active button
      btn.classList.add("active");

      // hide sections
      document
      .querySelectorAll(".view-section")
      .forEach(section=>{
        section.classList.remove("active");
      });

      // show selected
      document
      .getElementById("view-" + view)
      ?.classList.add("active");

    });

  });

}