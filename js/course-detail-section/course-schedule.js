import { coursesData } from '../config/mock-data.js';

export function renderCourseSchedule() {
    const urlParams = new URLSearchParams(window.location.search);
    const courseId = parseInt(urlParams.get('id')) || 1;
    const course = coursesData.find(item => item.id === courseId);

    if (!course || !course.schedule) return;

    const dateEl = document.getElementById('schedule-date');
    const timeEl = document.getElementById('schedule-time');
    const addressEl = document.getElementById('schedule-address');
    const daysEl = document.getElementById('schedule-days');

    if (dateEl) dateEl.textContent = course.date;
    if (timeEl) timeEl.textContent = course.schedule.time;
    if (addressEl) addressEl.textContent = course.schedule.address;

    if (daysEl && Array.isArray(course.schedule.schoolDays)) {
        daysEl.innerHTML = course.schedule.schoolDays
            .map(day => `<p>${day}</p>`)
            .join('');
    }
}