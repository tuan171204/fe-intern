import { coursesData } from '../config/mock-data.js';

export function renderCourseRequirements() {
    const urlParams = new URLSearchParams(window.location.search);
    const courseId = parseInt(urlParams.get('id')) || 1;

    const course = coursesData.find(item => item.id === courseId);

    if (!course || !course.requirements) return;

    const listEl = document.getElementById('course-requirements-list');
    if (!listEl) return;

    // Render HTML
    listEl.innerHTML = course.requirements.map(req => `
        <div class="flex items-start gap-4">
            <div class="w-5 h-5 mt-0.5 rounded-full bg-[#10b981] flex items-center justify-center shrink-0">
                <img src="../../assets/images/check-select.png" class="w-6 h-6">
            </div>
            <p class="text-gray-500 text-sm leading-relaxed">${req}</p>
        </div>
    `).join('');
}