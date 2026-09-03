document.addEventListener("DOMContentLoaded", () => {
    // Hàm nạp header & footer chung
    const loadComponent = (containerId, filePath) => {
        const container = document.getElementById(containerId);
        if (container) {
            fetch(filePath)
                .then((res) => {
                    if (!res.ok) throw new Error(`Không thể tải ${filePath}`);
                    return res.text();
                })
                .then((data) => {
                    container.innerHTML = data;
                })
                .catch((err) => console.error(err));
        }
    };

    loadComponent("header-container", "components/header.html");
    loadComponent("footer-container", "components/footer.html");
});