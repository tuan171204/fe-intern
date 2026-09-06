import { initAllCourseSection } from './home/all-course.js';
import { initComingSoonSwiper } from './home/coming-soon.js';
import { initTeamSection } from './home/team.js';
import { initSpecialValueSection } from './home/special-value.js';

document.addEventListener("DOMContentLoaded", async () => {
    if (typeof window.loadComponent === "function") {
        // Section 1: Hero
        await window.loadComponent("hero-container", "components/home/hero.html");

        // Section 2: Course Coming Soon
        await window.loadComponent("coming-soon-container", "components/home/coming-soon.html");
        initComingSoonSwiper();

        // Section 3: All Course
        await window.loadComponent("all-course-container", "components/home/all-course.html");
        initAllCourseSection();

        // Section 4: Team
        await window.loadComponent("team-container", "components/home/team.html");
        initTeamSection();

        // Section 5: Sepcial value
        await window.loadComponent("special-value-container", "components/home/special-value.html");
        initSpecialValueSection();
    }
});