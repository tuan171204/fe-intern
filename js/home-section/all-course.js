import { renderCourseCard } from '../components/course-card.js';

export function initAllCourseSection() {
    const leftContainer = document.querySelector("#course-list-left");
    const rightContainer = document.querySelector("#course-list-right");

    if (!leftContainer || !rightContainer) return;

    const coursesLeft = [
        {
            title: "ReactJS",
            category: "FRONTEND",
            badge: "Offline",
            image: "../../assets/images/course/react-course-offline.png",
            instructorAvatar: "../../assets/images/avatar2.png",
            instructorName: "Jane Cooper",
            price: "4.500.000đ"
        },
        {
            title: "Frontend Master",
            category: "Mobile",
            badge: "Offline",
            image: "../../assets/images/course/flutter-course-offline.png",
            instructorAvatar: "../../assets/images/avatar2.png",
            instructorName: "Jane Cooper",
            price: "4.500.000đ"
        }
    ];

    const coursesRight = [
        {
            title: "Unity",
            category: "GAME",
            badge: "Offline",
            image: "../../assets/images/course/unity-course-offline.png",
            instructorAvatar: "../../assets/images/avatar3.png",
            instructorName: "Jane Cooper",
            price: "4.500.000đ"
        },
        {
            title: "NodeJS",
            category: "BACKEND",
            badge: "Offline",
            image: "../../assets/images/course/nodejs-course-offline.png",
            instructorAvatar: "../../assets/images/avatar2.png",
            instructorName: "Jane Cooper",
            price: "4.500.000đ"
        }
    ];

    leftContainer.innerHTML = coursesLeft.map(renderCourseCard).join("");
    rightContainer.innerHTML = coursesRight.map(renderCourseCard).join("");
}