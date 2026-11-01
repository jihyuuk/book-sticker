export function hideInitialLoader() {
  document.getElementById("initial-loader")?.classList.add("hidden");
}

export function showInitialLoader() {
  document.getElementById("initial-loader")?.classList.remove("hidden");
}
