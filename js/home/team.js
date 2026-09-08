import { renderTeamCard } from '../components/team-card.js';

export function initTeamSection() {
    const teamContainer = document.querySelector("#team-list");
    const prevBtn = document.querySelector("#team-prev-btn");
    const nextBtn = document.querySelector("#team-next-btn");

    if (!teamContainer) return;

    const teamMembers = [
        { name: "Jane Cooper", role: "CEO", image: "../../assets/images/team/team1.png" },
        { name: "Jane Cooper", role: "CTO", image: "../../assets/images/team/team2.png" },
        { name: "Jane Cooper", role: "CMO", image: "../../assets/images/team/team3.png" },
        { name: "Jane Cooper", role: "CFO", image: "../../assets/images/team/team4.png" },
        { name: "Esther Howard", role: "Mentor", image: "../../assets/images/team/team4.png" },
        { name: "Esther Howard", role: "Mentor", image: "../../assets/images/team/team3.png" },
        { name: "Esther Howard", role: "Mentor", image: "../../assets/images/team/team2.png" },
        { name: "Esther Howard", role: "Mentor", image: "../../assets/images/team/team1.png" }
    ];

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
        if (currentIndex + itemsPerPage >= teamMembers.length) {
            nextBtn.className = "w-10 h-10 sm:w-11 sm:h-11 md:w-12 md:h-12 rounded-full border border-gray-200 flex items-center justify-center text-gray-400 opacity-40 cursor-not-allowed pointer-events-none transition-all group";
        } else {
            nextBtn.className = "w-10 h-10 sm:w-11 sm:h-11 md:w-12 md:h-12 rounded-full border border-slate-900 flex items-center justify-center text-slate-900 hover:bg-slate-900 hover:text-white transition-all group cursor-pointer";
        }
    };

    const render = () => {
        // Cắt mảng từ vị trí hiện tại cộng thêm số thẻ cần hiển thị
        const visibleMembers = teamMembers.slice(currentIndex, currentIndex + itemsPerPage);
        teamContainer.innerHTML = visibleMembers.map(renderTeamCard).join("");
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
            if (currentIndex + itemsPerPage < teamMembers.length) {
                currentIndex = Math.min(teamMembers.length - itemsPerPage, currentIndex + itemsPerPage);
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