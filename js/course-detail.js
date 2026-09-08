import { coursesData } from './config/mock-data.js';

document.addEventListener("DOMContentLoaded", async () => {
    // Load Section Intro
    const introContainer = document.getElementById("course-intro-container");
    if (introContainer && typeof window.loadComponent === "function") {
        await window.loadComponent("course-intro-container", "components/course-detail-section/course-intro.html");

        // Sau khi HTML load xong, chạy hàm đổ dữ liệu
        populateCourseIntro();
    }
});

// Hàm lấy dữ liệu và hiển thị lên UI
function populateCourseIntro() {
    // Lấy ID từ URL (vd: course-detail.html?id=1)
    const urlParams = new URLSearchParams(window.location.search);
    const courseId = parseInt(urlParams.get('id')) || 1;

    // Fallback nếu không có ID trên URL, tự động lấy môn số 1 để tránh lỗi trắng trang
    const course = coursesData.find(item => item.id === courseId);

    if (!course) return;

    // Gắn dữ liệu vào các thẻ HTML thông qua ID
    document.getElementById('intro-category').textContent = course.category;
    document.getElementById('intro-title').textContent = course.title;
    document.getElementById('intro-date').textContent = course.date;
    document.getElementById('intro-timeline').textContent = course.timeline;
    document.getElementById('intro-form').textContent = course.form;
    document.getElementById('intro-instructor').textContent = course.instructorName;
    document.getElementById('intro-price').textContent = course.price;

    // Xử lý ảnh
    document.getElementById('intro-avatar').src = course.instructorAvatar;
    document.getElementById('intro-image').src = course.image;
}