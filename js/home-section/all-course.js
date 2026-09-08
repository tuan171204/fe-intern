import { renderCourseCard } from '../components/course-card.js';
import { coursesData } from '../config/mock-data.js';

export function initAllCourseSection() {
    const leftContainer = document.querySelector("#course-list-left");
    const rightContainer = document.querySelector("#course-list-right");

    if (!leftContainer || !rightContainer) return;

    const coursesLeft = coursesData.slice(0, 2);
    const coursesRight = coursesData.slice(2, 4);

    leftContainer.innerHTML = coursesLeft.map(renderCourseCard).join("");
    rightContainer.innerHTML = coursesRight.map(renderCourseCard).join("");
}