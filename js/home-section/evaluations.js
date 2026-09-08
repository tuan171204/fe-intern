import { renderTestimonialCard } from '../components/testimonial-card.js';

export function initEvaluationsSection() {
    const container = document.querySelector("#testimonial-container");
    const prevBtn = document.querySelector("#testi-prev-btn");
    const nextBtn = document.querySelector("#testi-next-btn");

    if (!container) return;

    const testimonials = [
        {
            content: "Mentors teach with heart and enthusiasm. I am a person who does not know html and css. After the course, I can confidently code the interface according to the design and also handle events with javascript and jquery.",
            avatar: "../../assets/images/avatar2.png",
            name: "Jane Cooper",
            role: "Student CFD1"
        },
        {
            content: "The environment is extremely dynamic and creative. The practical projects helped me understand the core concepts of ReactJS and build my own portfolio.",
            avatar: "../../assets/images/avatar3.png",
            name: "Esther Howard",
            role: "Student CFD2"
        }
    ];

    let currentIndex = 0;

    const updateButtonsState = () => {
        if (!prevBtn || !nextBtn) return;

        if (currentIndex === 0) {
            prevBtn.className = "w-10 h-10 sm:w-12 sm:h-12 rounded-full border border-gray-200 flex items-center justify-center text-gray-400 opacity-40 cursor-not-allowed pointer-events-none transition-all";
        } else {
            prevBtn.className = "w-10 h-10 sm:w-12 sm:h-12 rounded-full border border-slate-900 flex items-center justify-center text-slate-900 hover:bg-slate-900 hover:text-white transition-all group cursor-pointer";
        }

        if (currentIndex === testimonials.length - 1) {
            nextBtn.className = "w-10 h-10 sm:w-12 sm:h-12 rounded-full border border-gray-200 flex items-center justify-center text-gray-400 opacity-40 cursor-not-allowed pointer-events-none transition-all";
        } else {
            nextBtn.className = "w-10 h-10 sm:w-12 sm:h-12 rounded-full border border-slate-900 flex items-center justify-center text-slate-900 hover:bg-slate-900 hover:text-white transition-all group cursor-pointer";
        }
    };

    const render = () => {
        container.innerHTML = renderTestimonialCard(testimonials[currentIndex]);
        updateButtonsState();
    };

    if (prevBtn && nextBtn) {
        prevBtn.addEventListener('click', () => {
            if (currentIndex > 0) {
                currentIndex--;
                render();
            }
        });

        nextBtn.addEventListener('click', () => {
            if (currentIndex < testimonials.length - 1) {
                currentIndex++;
                render();
            }
        });
    }

    render();
}