import { coursesData } from '../config/mock-data.js';
import { renderAccordionItem } from '../components/accordion-item.js';

export function renderCourseContent() {
    const urlParams = new URLSearchParams(window.location.search);
    const courseId = parseInt(urlParams.get('id')) || 1;

    const course = coursesData.find(item => item.id === courseId);

    if (!course || !course.contents) return;

    const contentListEl = document.getElementById('course-content-grid');
    if (!contentListEl) return;

    // Render content
    contentListEl.innerHTML = course.contents
        .map((item, index) => renderAccordionItem(item, index))
        .join('');

    // Logic Đóng/Mở (Accordion)
    const accordionItems = contentListEl.querySelectorAll('.accordion-item');

    accordionItems.forEach(item => {
        const btn = item.querySelector('.accordion-btn');
        const content = item.querySelector('.accordion-content');
        const icon = item.querySelector('.accordion-icon');

        if (btn && content && icon) {
            btn.addEventListener('click', () => {
                const isOpen = content.classList.contains('max-h-[500px]');

                accordionItems.forEach(otherItem => {
                    const otherContent = otherItem.querySelector('.accordion-content');
                    const otherIcon = otherItem.querySelector('.accordion-icon');
                    
                    otherItem.classList.remove('bg-gray-100');
                    if (otherContent) {
                        otherContent.classList.remove('max-h-[500px]', 'opacity-100');
                        otherContent.classList.add('max-h-0', 'opacity-0');
                    }
                    if (otherIcon) {
                        otherIcon.classList.remove('rotate-0');
                        otherIcon.classList.add('rotate-180');
                    }
                });

                if (!isOpen) {
                    item.classList.add('bg-gray-100');
                    content.classList.remove('max-h-0', 'opacity-0');
                    content.classList.add('max-h-[500px]', 'opacity-100');
                    icon.classList.remove('rotate-180');
                    icon.classList.add('rotate-0');
                }
            });
        }
    });
}