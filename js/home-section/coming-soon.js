import { coursesData } from '../config/mock-data.js';
import { renderComingSoonSlide } from '../components/coming-soon-slide.js';

export function initComingSoonSwiper() {
    const wrapper = document.getElementById('coming-soon-wrapper');
    if (!wrapper) return;

    const comingSoonCourses = coursesData.slice(0, 3);

    wrapper.innerHTML = comingSoonCourses.map(course => renderComingSoonSlide(course)).join('');

    const swiperElement = document.querySelector('.course-swiper');
    if (!swiperElement || typeof Swiper === 'undefined') return;

    const swiper = new Swiper('.course-swiper', {
        slidesPerView: 1,
        spaceBetween: 24,
        speed: 800,

        observer: true,
        observeParents: true,
        observeSlideChildren: true,

        navigation: {
            nextEl: '.course-next-btn',
            prevEl: '.course-prev-btn',
        },
    });

    setTimeout(() => swiper.update(), 300);
}