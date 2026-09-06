export function renderTestimonialCard(data) {
    return `
    <div class="flex flex-col bg-white h-full p-8 lg:p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-300">
      
      <!-- Hàng 1: Icon Quote -->
      <div class="text-6xl font-serif text-slate-900 leading-none h-10 mb-4">
        <img src="../../assets/icons/quote.svg" class="w-8 h-8">
      </div>
      
      <!-- Hàng 2: Content -->
      <p class="text-gray-500 leading-relaxed text-sm mb-10 flex-1">
        ${data.content}
      </p>
      
      <!-- Hàng 3: Student Info -->
      <div class="flex items-center space-x-2 mt-auto">
        <img src="${data.avatar}" alt="${data.name}" class="w-14 h-14 rounded-full object-cover">
        <div>
          <h4 class="text-sm font-extrabold text-slate-900">${data.name}</h4>
          <span class="text-xs text-gray-500">${data.role}</span>
        </div>
      </div>
      
    </div>
  `;
}