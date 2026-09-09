import { populateCourseHero } from "./course-detail-section/course-hero.js";
import { renderCourseIntroduce } from "./course-detail-section/course-introduce.js";


document.addEventListener("DOMContentLoaded", async () => {
    if (typeof window.loadComponent === "function") {

        await window.loadComponent("course-hero-container", "components/course-detail-section/course-hero.html");
        populateCourseHero();

        await window.loadComponent("course-introduce-container", "components/course-detail-section/course-introduce.html");
        renderCourseIntroduce();

        await window.loadComponent("course-schedule-container", "components/course-detail-section/course-schedule.html");

    }
});

