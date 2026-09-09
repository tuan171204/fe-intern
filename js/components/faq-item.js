export function renderFaqItem(faq, index) {
  const isOpen = index === 0;

  return `
    <div class="faq-item border-b-2 border-gray-100 last:border-none transition-colors duration-300 hover:bg-gray-100 py-2.5 ${isOpen ? 'bg-gray-100' : ''}" data-index="${index}">
      
      <button 
        class="faq-btn w-full text-left p-4 lg:p-8 lg:pt-6 lg:pb-4 flex justify-between items-center"
      >
        <span class="font-extrabold text-slate-900 text-sm md:text-sm pr-4">${faq.question}</span>
        <img 
          src="./assets/icons/arrow-up.svg" 
          class="faq-icon w-6 h-6 transform transition-transform duration-300 ${isOpen ? 'rotate-0' : 'rotate-180'}" 
          alt="toggle"
        >
      </button>
      
      <!-- Thêm overflow-hidden để text không tràn ra ngoài khi max-h-0 -->
      <div 
        class="faq-content overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'}"
      >
        <div class="px-4 lg:px-8 pb-6 lg:pr-20">
          <p class="text-gray-500 text-sm leading-loose">${faq.answer}</p>
        </div>
      </div>
      
    </div>
  `;
}