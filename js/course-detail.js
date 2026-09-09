import { renderCourseContent } from "./course-detail-section/course-content.js";
import { populateCourseHero } from "./course-detail-section/course-hero.js";
import { renderCourseIntroduce } from "./course-detail-section/course-introduce.js";
import { renderCourseLecturers } from "./course-detail-section/course-lecturers.js";
import { renderCourseRequirements } from "./course-detail-section/course-requirements.js";
import { renderCourseSchedule } from "./course-detail-section/course-schedule.js";
import { initFaqSection } from "./course-detail-section/faq-recommend.js";
import { initSpecialValueSection } from "./course-detail-section/special-value.js";


document.addEventListener("DOMContentLoaded", async () => {
    if (typeof window.loadComponent === "function") {

        // Section 1: Course Hero 
        await window.loadComponent("course-hero-container", "components/course-detail-section/course-hero.html");
        populateCourseHero();

        // Section 2: Course Introduce
        await window.loadComponent("course-introduce-container", "components/course-detail-section/course-introduce.html");
        renderCourseIntroduce();

        // Section 3: Course Schedule 
        await window.loadComponent("course-schedule-container", "components/course-detail-section/course-schedule.html");
        renderCourseSchedule();

        // Section 4: Course Content
        await window.loadComponent("course-content-container", "components/course-detail-section/course-content.html");
        renderCourseContent();

        // Section 5: Course Requirements 
        await window.loadComponent("course-requirements-container", "components/course-detail-section/course-requirements.html");
        renderCourseRequirements();

        // Section 6: Course Lecturers 
        await window.loadComponent("lecturers-container", "components/course-detail-section/course-lecturers.html");
        renderCourseLecturers();

        // Section 7: Sepcial value
        await window.loadComponent("special-value-container", "components/course-detail-section/special-value.html");
        initSpecialValueSection();

        // Section 8: Frequently Asked Questions 
        await window.loadComponent("faq-recommend-container", "components/course-detail-section/faq-recommend.html");
        initFaqSection();
    }
});

