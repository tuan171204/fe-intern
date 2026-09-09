export function renderTeamCard(member) {
  return `
    <article class="relative w-full aspect-[3/4] flex flex-col justify-end group">
      
      <!-- Layer 1: Nền xám  -->
      <div class="absolute bottom-0 left-0 w-full h-[75%] bg-gray-200 z-0 group-hover:bg-[#E5E7EB] transition-colors"></div>

      <!-- Layer 2: Avatar -->
      <img
        src="${member.image}"
        alt="${member.name}"
        class="relative z-10 w-full h-full object-contain object-bottom drop-shadow-sm group-hover:scale-105 transition-transform duration-500"
      >

      <!-- Layer 3: Block chứa tên -->
      <div class="absolute bottom-3 sm:bottom-6 lg:bottom-10 left-1/2 lg:left-1/3 -translate-x-1/2 lg:-translate-x-[42%] w-[90%] lg:w-[80%] bg-white pl-2 sm:pl-4 lg:pl-7 pr-2 lg:pr-4 py-1.5 lg:py-2 shadow-sm z-20 border-l-2 lg:border-l border-gray-200 text-center lg:text-left">
        <h4 class="text-xs sm:text-base lg:text-xl tracking-normal font-extrabold text-slate-900 truncate">${member.name}</h4>
        <span class="block text-[9px] sm:text-[10px] lg:text-xs text-gray-800 uppercase font-medium mt-0.5 lg:mt-2 tracking-normal truncate">${member.role}</span>
      </div>
      
    </article>
  `;
}