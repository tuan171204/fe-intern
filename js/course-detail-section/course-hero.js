import { coursesData } from "../config/mock-data.js";

export function populateCourseHero() {
    const urlParams = new URLSearchParams(window.location.search);
    const courseId = parseInt(urlParams.get('id')) || 1;

    // Fallback nếu không có ID trên URL, tự động lấy môn số 1 để tránh lỗi trắng trang
    const course = coursesData.find(item => item.id === courseId);

    if (!course) return;

    document.getElementById('hero-category').textContent = course.category;
    document.getElementById('hero-title').textContent = course.title;
    document.getElementById('hero-date').textContent = course.date;
    document.getElementById('hero-timeline').textContent = course.timeline;
    document.getElementById('hero-form').textContent = course.form;
    document.getElementById('hero-instructor').textContent = course.instructorName;
    document.getElementById('hero-price').textContent = course.price;

    document.getElementById('hero-avatar').src = course.instructorAvatar;
    document.getElementById('hero-image').src = course.image;
}