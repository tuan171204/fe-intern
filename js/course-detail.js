import { renderCourseContent } from "./course-detail-section/course-content.js";
import { populateCourseHero } from "./course-detail-section/course-hero.js";
import { renderCourseIntroduce } from "./course-detail-section/course-introduce.js";
import { renderCourseRequirements } from "./course-detail-section/course-requirements.js";
import { renderCourseSchedule } from "./course-detail-section/course-schedule.js";


document.addEventListener("DOMContentLoaded", async () => {
    if (typeof window.loadComponent === "function") {

        await window.loadComponent("course-hero-container", "components/course-detail-section/course-hero.html");
        populateCourseHero();

        await window.loadComponent("course-introduce-container", "components/course-detail-section/course-introduce.html");
        renderCourseIntroduce();

        await window.loadComponent("course-schedule-container", "components/course-detail-section/course-schedule.html");
        renderCourseSchedule();

        await window.loadComponent("course-content-container", "components/course-detail-section/course-content.html");
        renderCourseContent();

        await window.loadComponent("course-requirements-container", "components/course-detail-section/course-requirements.html");
        renderCourseRequirements();
    }
});

