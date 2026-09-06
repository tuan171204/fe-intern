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
      <div class="absolute bottom-10 left-1/3 -translate-x-[42%] w-[80%] bg-white pl-7 pr-4 py-2 shadow-sm z-20 border-l border-gray-100">
        <h4 class="text-xl tracking-normal font-extrabold text-slate-900">${member.name}</h4>
        <span class="block text-xs text-gray-800 uppercase font-medium mt-2 tracking-normal">${member.role}</span>
      </div>
      
    </article>
  `;
}