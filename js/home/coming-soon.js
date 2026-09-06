export function initComingSoonSwiper() {
    const swiperElement = document.querySelector('.course-swiper');

    if (!swiperElement || typeof Swiper === 'undefined') return;

    const swiper = new Swiper('.course-swiper', {
        slidesPerView: 1,
        spaceBetween: 328,
        speed: 800,
        observer: true,
        observeParents: true,
        navigation: {
            nextEl: '.course-next-btn',
            prevEl: '.course-prev-btn',
        },
    });

    setTimeout(() => swiper.update(), 300);
}