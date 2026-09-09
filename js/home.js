import { initAllCourseSection } from './home-section/all-course.js';
import { initTeamSection } from './home-section/team.js';
import { initSpecialValueSection } from './home-section/special-value.js';
import { initEvaluationsSection } from './home-section/evaluations.js';
import { initFaqSection } from './home-section/faq.js';
import { initComingSoonSwiper } from './home-section/coming-soon.js';

document.addEventListener("DOMContentLoaded", async () => {
    if (typeof window.loadComponent === "function") {
        // Section 1: Hero
        await window.loadComponent("hero-container", "components/home-section/hero.html");

        // Section 2: Course Coming Soon
        await window.loadComponent("coming-soon-container", "components/home-section/coming-soon.html");
        initComingSoonSwiper();

        // Section 3: All Course
        await window.loadComponent("all-course-container", "components/home-section/all-course.html");
        initAllCourseSection();

        // Section 4: Team
        await window.loadComponent("team-container", "components/home-section/team.html");
        initTeamSection();

        // Section 5: Sepcial value
        await window.loadComponent("special-value-container", "components/home-section/special-value.html");
        initSpecialValueSection();

        // Section 6: Evaluations
        await window.loadComponent("evaluations-container", "components/home-section/evaluations.html");
        initEvaluationsSection();

        // Section 7: Frequently Asked Questions - Appscyclone Team
        await window.loadComponent("faq-team-container", "components/home-section/faq-team.html");
        initFaqSection();

        // Section 8: Become a Part of Appscyclone
        await window.loadComponent("cta-section-container", "components/home-section/cta-section.html");
    }
});