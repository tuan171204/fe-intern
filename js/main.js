// Hàm nạp component dùng chung
window.loadComponent = (containerId, filePath, callback) => {
    const container = document.getElementById(containerId);
    if (container) {
        fetch(filePath)
            .then((res) => {
                if (!res.ok) throw new Error(`Không thể tải ${filePath}`);
                return res.text();
            })
            .then((data) => {
                container.innerHTML = data;
                if (callback) callback();
            })
            .catch((err) => console.error(err));
    }
}


document.addEventListener("DOMContentLoaded", () => {
    // Gắn sự kiện Toggle cho Mobile Menu của Header
    const initMobileMenu = () => {
        const toggleBtn = document.getElementById("menu-toggle");
        const navMenu = document.getElementById("nav-menu");

        if (toggleBtn && navMenu) {
            toggleBtn.addEventListener("click", () => {
                navMenu.classList.toggle("hidden");
                navMenu.classList.toggle("flex");
            });
        }
    };

    window.loadComponent("header-container", "components/header.html", initMobileMenu);
    window.loadComponent("footer-container", "components/footer.html");
});