import { renderFaqItem } from '../components/faq-item.js';

export function initFaqSection() {
    const faqContainer = document.querySelector("#faq-list");
    if (!faqContainer) return;

    const faqs = [
        {
            question: "Add commonly asked questions here",
            answer: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam uto lectus molestie malesuada vitae vel purus."
        },
        {
            question: "Add commonly asked questions here",
            answer: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam uto lectus molestie malesuada vitae vel purus."
        },
        {
            question: "Add commonly asked questions here",
            answer: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam uto lectus molestie malesuada vitae vel purus."
        },
        {
            question: "Add commonly asked questions here",
            answer: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam uto lectus molestie malesuada vitae vel purus."
        },
        {
            question: "Add commonly asked questions here",
            answer: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam uto lectus molestie malesuada vitae vel purus."
        }
    ];

    // Render ra HTML
    faqContainer.innerHTML = faqs.map((faq, index) => renderFaqItem(faq, index)).join("");

    // Logic Đóng/Mở (Accordion)
    const faqItems = faqContainer.querySelectorAll(".faq-item");

    faqItems.forEach(item => {
        const btn = item.querySelector(".faq-btn");
        const content = item.querySelector(".faq-content");
        const icon = item.querySelector(".faq-icon");

        btn.addEventListener("click", () => {
            const isOpen = content.classList.contains("max-h-[500px]");

            // Reset tất cả các item khác về trạng thái đóng
            faqItems.forEach(otherItem => {
                const otherContent = otherItem.querySelector(".faq-content");
                const otherIcon = otherItem.querySelector(".faq-icon");
                otherItem.classList.remove("bg-gray-100");
                otherContent.classList.remove("max-h-[500px]", "opacity-100");
                otherContent.classList.add("max-h-0", "opacity-0");
                otherIcon.classList.remove("rotate-0");
                otherIcon.classList.add("rotate-180");
            });

            if (!isOpen) {
                item.classList.add("bg-gray-100");
                content.classList.remove("max-h-0", "opacity-0");
                content.classList.add("max-h-[500px]", "opacity-100");
                icon.classList.remove("rotate-180");
                icon.classList.add("rotate-0");
            }
        });
    });
}