document.addEventListener("DOMContentLoaded", () => {
    // Nạp Hero Section
    if (typeof window.loadComponent === "function") {
        window.loadComponent("hero-container", "components/home/hero.html");
    }
});