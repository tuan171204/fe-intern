import { renderCourseCard } from './components/course-card.js';
import { coursesData } from '../js/config/mock-data.js';

document.addEventListener("DOMContentLoaded", async () => {
    // Load Header và Footer 
    if (typeof window.loadComponent === "function") {
        await window.loadComponent("header-container", "components/header.html");
        await window.loadComponent("footer-container", "components/footer.html");
    }

    // Mock Data (Dữ liệu mẫu)
    const allCoursesData = coursesData;

    const categories = ["All", "Frontend", "Design", "Backend", "Mobile", "QC", "Game", "Blockchain"];

    // State 
    let currentCategory = "All";
    let currentPage = 1;
    const itemsPerPage = 9;

    // DOM Elements
    const filterContainer = document.getElementById("filter-container");
    const coursesGrid = document.getElementById("courses-grid");
    const paginationControls = document.getElementById("pagination-controls");
    const totalItemsText = document.getElementById("total-items");

    // Render Filter Tabs
    const renderFilters = () => {
        filterContainer.innerHTML = categories.map(cat => {
            const isActive = cat === currentCategory;
            const baseClasses = "px-9 py-2.5 text-sm font-bold whitespace-nowrap cursor-pointer transition-colors";
            const activeClasses = isActive ? "bg-gray-900 text-white" : "text-slate-900 bg-gray-100 hover:bg-gray-300";
            return `<button class="${baseClasses} ${activeClasses}" data-category="${cat}">${cat}</button>`;
        }).join("");

        filterContainer.querySelectorAll('button').forEach(btn => {
            btn.addEventListener('click', (e) => {
                currentCategory = e.target.getAttribute('data-category');
                currentPage = 1; // Reset về trang 1 
                renderFilters();
                renderCourses();
            });
        });
    };

    // Render Khóa học & Phân trang
    const renderCourses = () => {
        const filteredData = currentCategory === "All"
            ? allCoursesData
            : allCoursesData.filter(c => c.category.toLowerCase() === currentCategory.toLowerCase());

        const totalItems = filteredData.length;
        const totalPages = Math.ceil(totalItems / itemsPerPage) || 1;

        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        const currentData = filteredData.slice(startIndex, endIndex);

        // Render Cards 
        coursesGrid.innerHTML = currentData.length > 0
            ? currentData.map(renderCourseCard).join("")
            : `<div class="col-span-full text-center py-10 text-gray-500">No courses found in this category.</div>`;

        // Render Pagination
        totalItemsText.textContent = `Total ${totalItems} items`;
        renderPaginationControls(totalPages);
    };

    // Render Nút phân trang
    const renderPaginationControls = (totalPages) => {
        let html = '';

        // Nút Prev
        html += `<button class="w-10 h-10 bg-[#F4F4F6] flex items-center justify-center text-gray-900 hover:bg-[#F4F4F6] disabled:opacity-50" ${currentPage === 1 ? 'disabled' : ''} id="btn-prev">
            <img src="../assets/icons/arrow-up.svg" class="w-6 h-6 object-contain -rotate-90">
        </button>`;

        // Render số trang
        for (let i = 1; i <= totalPages; i++) {
            const activeClass = i === currentPage ? "bg-[#00A8A4] text-white" : "text-gray-900 bg-[#F4F4F6] hover:bg-gray-300";
            html += `<button class="w-10 h-10 flex items-center justify-center text-xs font-bold transition ${activeClass} page-num" data-page="${i}">${i}</button>`;
        }

        // Nút Next
        html += `<button class="w-10 h-10 bg-[#F4F4F6] flex items-center justify-center text-gray-900 hover:bg-gray-50 disabled:opacity-50" ${currentPage === totalPages ? 'disabled' : ''} id="btn-next">
            <img src="../assets/icons/arrow-up.svg" class="w-6 h-6 object-contain rotate-90">
        </button>`;

        paginationControls.innerHTML = html;

        // Ssự kiện chuyển trang
        const btnPrev = document.getElementById("btn-prev");
        const btnNext = document.getElementById("btn-next");

        if (btnPrev) btnPrev.addEventListener('click', () => { if (currentPage > 1) { currentPage--; renderCourses(); } });
        if (btnNext) btnNext.addEventListener('click', () => { if (currentPage < totalPages) { currentPage++; renderCourses(); } });

        document.querySelectorAll('.page-num').forEach(btn => {
            btn.addEventListener('click', (e) => {
                currentPage = parseInt(e.target.getAttribute('data-page'));
                renderCourses();
            });
        });
    };

    renderFilters();
    renderCourses();
});