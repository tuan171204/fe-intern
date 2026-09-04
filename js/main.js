// Hàm nạp component dùng chung
window.loadComponent = async function (containerId, componentPath) {
    try {
        const response = await fetch(componentPath);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

        const htmlText = await response.text();
        const container = document.getElementById(containerId);
        if (!container) return;

        container.innerHTML = htmlText;

        // Tìm và thực thi các thẻ <script> bên trong component vừa nạp
        const scripts = container.querySelectorAll("script");
        scripts.forEach((script) => {
            const newScript = document.createElement("script");
            if (script.src) {
                newScript.src = script.src;
            } else {
                newScript.textContent = script.textContent;
            }
            document.body.appendChild(newScript);
            document.body.removeChild(newScript);
        });
    } catch (error) {
        console.error(`Không thể nạp component từ ${componentPath}:`, error);
    }
};


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