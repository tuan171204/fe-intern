import { renderValueItem } from '../components/value-item.js';

export function initSpecialValueSection() {
    const valueContainer = document.querySelector("#value-list");
    if (!valueContainer) return;

    const specialValues = [
        {
            title: "Real-life training program",
            description: "The learning curve at Appscyclone is straight to the point, close to the actual requirements, communicated from experienced and dedicated instructors."
        },
        {
            title: "Companion and support 24/7",
            description: "Instructors, mentors and students are a cohesive team, together supporting, connecting and helping each other throughout the learning and career development process."
        },
        {
            title: 'Put the word "Mind" in everything',
            description: "The mind of the teacher, together with the enthusiasm of the learners, will be successful on the career path of each of us."
        },
        {
            title: "Various forms of learning",
            description: "Study offline or online with offline through google meet, as well as live & video courses with instructors, and mentor-supported video lessons."
        }
    ];

    valueContainer.innerHTML = specialValues.map(renderValueItem).join("");
}