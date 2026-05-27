document.addEventListener("DOMContentLoaded", async () => {
  try {
    if (typeof loadLocalState === "function") {
      loadLocalState();
    }

    if (typeof applySettings === "function") {
      applySettings();
    }

    if (typeof loadRemoteData === "function") {
      await loadRemoteData();
    }

    if (typeof applySettings === "function") {
      applySettings();
    }

    console.log("GDR app initialized");
  } catch (error) {
    console.error("Init app error:", error);
  }
});
