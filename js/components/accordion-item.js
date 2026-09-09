export function renderAccordionItem(item, index) {
    const isOpen = index === 0; 

    // Xử lý render danh sách từ item.details
    let contentHtml = '';
    if (item.details && Array.isArray(item.details)) {
        contentHtml = `<ul class="list-disc pl-5 space-y-1">
            ${item.details.map(detail => `<li>${detail}</li>`).join('')}
        </ul>`;
    } else {
        contentHtml = `<p>${item.content || ''}</p>`;
    }

    return `
    <div class="accordion-item border-b border-gray-100 last:border-none transition-colors duration-300 hover:bg-gray-100 py-3 px-7 ${isOpen ? 'bg-gray-100' : ''}" data-index="${index}">
      
      <button 
        class="accordion-btn w-full text-left py-4 flex justify-between items-center bg-transparent"
      >
        <span class="font-bold text-slate-900 text-sm md:text-base pr-4">${item.title}</span>
        <img 
          src="./assets/icons/arrow-up.svg" 
          class="accordion-icon w-5 h-5 transform transition-transform duration-300 ${isOpen ? 'rotate-0' : 'rotate-180'}" 
          alt="toggle"
        >
      </button>
      
      <div 
        class="accordion-content overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'}"
      >
        <div class="pb-6 pr-4 lg:pr-10">
          <div class="text-gray-500 text-sm leading-relaxed">
            ${contentHtml}
          </div>
        </div>
      </div>
      
    </div>
  `;
}