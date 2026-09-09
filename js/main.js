// Hàm nạp component dùng chung
window.loadComponent = async function (containerId, componentPath) {
    try {
        const response = await fetch(componentPath);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const htmlText = await response.text();

        const container = document.getElementById(containerId);

        if (!container) {
            throw new Error(
                `Không tìm thấy container #${containerId}`
            );
        }

        container.innerHTML = htmlText;

    } catch (error) {
        console.error(
            `Không thể nạp component từ ${componentPath}:`,
            error
        );

        throw error;
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

    window.loadComponent("header-container", "components/common/header.html", initMobileMenu);
    window.loadComponent("footer-container", "components/common/footer.html");
});