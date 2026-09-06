export function renderCourseCard(course) {
  return `
    <article class="flex flex-col w-full mb-16 lg:mb-28">
      <!-- Image Box -->
      <div class="relative w-full aspect-square bg-[rgb(13,17,40)] mb-10 overflow-hidden shadow-md group">
        <img 
          src="${course.image}" 
          alt="${course.title}" 
          class="w-full h-full object-contain p-12 group-hover:scale-105 transition-transform duration-500"
        >
        <!-- Badge -->
        <span class="absolute top-6 right-6 bg-[#00A8A4] text-white text-[10px] font-medium px-4 py-2 tracking-wider">
          ${course.badge}
        </span>
      </div>

      <!-- Content -->
      <div class="flex flex-col px-8">
        <span class="text-xs text-gray-500 uppercase mb-3">
          ${course.category}
        </span>
        <h3 class="text-xl font-extrabold text-slate-900 mb-3.5">
          ${course.title}
        </h3>
        
        <!-- Footer (Avatar & Price) -->
        <div class="flex items-center justify-between border-t border-gray-100">
          <div class="flex items-center space-x-3">
            <img src="${course.instructorAvatar}" alt="${course.instructorName}" class="w-8 h-8 rounded-full object-cover">
            <span class="text-sm font-medium text-gray-500">${course.instructorName}</span>
          </div>
          <span class="text-md font-extrabold text-slate-900 tracking-tighter">${course.price}</span>
        </div>
      </div>
    </article>
  `;
}