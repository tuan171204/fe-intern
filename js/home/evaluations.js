import { renderTestimonialCard } from '../components/testimonial-card.js';

export function initEvaluationsSection() {
    const container = document.querySelector("#testimonial-container");
    if (!container) return;

    const testimonials = [
        {
            content: "Mentors teach with heart and enthusiasm. I am a person who does not know html and css. After the course, I can confidently code the interface according to the design and also handle events with javascript and jquery.",
            avatar: "../../assets/images/avatar2.png",
            name: "Jane Cooper",
            role: "Student CFD1"
        },
        {
            content: "The environment is extremely dynamic and creative. The practical projects helped me understand the core concepts of ReactJS and build my own portfolio.",
            avatar: "../../assets/images/avatar3.png",
            name: "Jane Cooper",
            role: "Student CFD2"
        }
    ];

    let currentIndex = 0;

    container.innerHTML = renderTestimonialCard(testimonials[currentIndex]);
}