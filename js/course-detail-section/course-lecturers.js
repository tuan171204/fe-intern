import { coursesData } from '../config/mock-data.js';
import { renderLecturerCard } from '../components/lecturer-card.js';

export function renderCourseLecturers() {
    const urlParams = new URLSearchParams(window.location.search);
    const courseId = parseInt(urlParams.get('id')) || 1;
    const course = coursesData.find(item => item.id === courseId);

    if (!course || !course.lecturers) return;

    const listEl = document.getElementById('lecturer-list');
    const prevBtn = document.getElementById('lecturer-prev-btn');
    const nextBtn = document.getElementById('lecturer-next-btn');

    if (!listEl) return;

    const lecturers = course.lecturers;

    let currentIndex = 0;
    // Desktop hiện 4 thẻ, Mobile/Tablet hiện 2 thẻ
    let itemsPerPage = window.innerWidth >= 1024 ? 4 : 2;

    const updateButtonsState = () => {
        if (!prevBtn || !nextBtn) return;

        // Trạng thái nút Left
        if (currentIndex === 0) {
            prevBtn.className = "w-10 h-10 sm:w-11 sm:h-11 md:w-12 md:h-12 rounded-full border border-gray-200 flex items-center justify-center text-gray-400 opacity-40 cursor-not-allowed pointer-events-none transition-all group";
        } else {
            prevBtn.className = "w-10 h-10 sm:w-11 sm:h-11 md:w-12 md:h-12 rounded-full border border-slate-900 flex items-center justify-center text-slate-900 hover:bg-slate-900 hover:text-white transition-all group cursor-pointer";
        }

        // Trạng thái nút Right
        if (currentIndex + itemsPerPage >= lecturers.length) {
            nextBtn.className = "w-10 h-10 sm:w-11 sm:h-11 md:w-12 md:h-12 rounded-full border border-gray-200 flex items-center justify-center text-gray-400 opacity-40 cursor-not-allowed pointer-events-none transition-all group";
        } else {
            nextBtn.className = "w-10 h-10 sm:w-11 sm:h-11 md:w-12 md:h-12 rounded-full border border-slate-900 flex items-center justify-center text-slate-900 hover:bg-slate-900 hover:text-white transition-all group cursor-pointer";
        }
    };

    const render = () => {
        // Cắt mảng từ vị trí hiện tại cộng thêm số thẻ cần hiển thị
        const visibleLecturers = lecturers.slice(currentIndex, currentIndex + itemsPerPage);
        listEl.innerHTML = visibleLecturers.map(renderLecturerCard).join('');
        updateButtonsState();
    };

    if (prevBtn && nextBtn) {
        prevBtn.addEventListener('click', () => {
            if (currentIndex > 0) {
                // Lùi lại đúng bằng số thẻ đang hiển thị
                currentIndex = Math.max(0, currentIndex - itemsPerPage);
                render();
            }
        });

        nextBtn.addEventListener('click', () => {
            if (currentIndex + itemsPerPage < lecturers.length) {
                currentIndex = Math.min(lecturers.length - itemsPerPage, currentIndex + itemsPerPage);
                render();
            }
        });
    }

    window.addEventListener('resize', () => {
        const newItemsPerPage = window.innerWidth >= 1024 ? 4 : 2;
        if (newItemsPerPage !== itemsPerPage) {
            itemsPerPage = newItemsPerPage;
            currentIndex = 0;
            render();
        }
    });

    render();
}