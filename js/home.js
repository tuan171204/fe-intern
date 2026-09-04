document.addEventListener("DOMContentLoaded", async () => {
    if (typeof window.loadComponent === "function") {
        // Section 1: Hero
        window.loadComponent("hero-container", "components/home/hero.html");

        // Section 2: Course Coming Soon
        window.loadComponent("coming-soon-container", "components/home/coming-soon.html");
    }
});