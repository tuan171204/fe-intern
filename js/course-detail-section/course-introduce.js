import { coursesData } from '../config/mock-data.js';

export function renderCourseIntroduce() {
    const urlParams = new URLSearchParams(window.location.search);
    const courseId = parseInt(urlParams.get('id')) || 1;
    const course = coursesData.find(item => item.id === courseId);

    if (!course || !course.introduce) return;

    const { description, phaseTitle, phases } = course.introduce;

    const descEl = document.getElementById('introduce-description');
    const phaseTitleEl = document.getElementById('introduce-phase-title');
    const phasesListEl = document.getElementById('introduce-phases-list');

    if (descEl) descEl.textContent = description;
    if (phaseTitleEl) phaseTitleEl.textContent = phaseTitle;

    if (phasesListEl && Array.isArray(phases)) {
        phasesListEl.innerHTML = phases.map(item => `<div class="text-gray-500 text-sm leading-relaxed">${item}</div>`).join('');
    }
}