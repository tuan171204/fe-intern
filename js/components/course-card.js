export function renderCourseCard(course) {
  return `
    <article class="flex flex-col w-full mb-4 md:mb-8 lg:mb-12 bg-gray-100">
      <!-- Image Box -->
      <div class="relative w-full aspect-square bg-[rgb(13,17,40)] mb-6 lg:mb-10 overflow-hidden shadow-md group">
        <img 
          src="${course.image}" 
          alt="${course.title}" 
          class="w-full h-full object-contain p-6 md:p-8 lg:p-12 group-hover:scale-105 transition-transform duration-500"
        >
        <!-- Badge -->
        <span class="absolute top-4 right-4 lg:top-6 lg:right-6 bg-[#00A8A4] text-white text-[10px] font-medium px-3 py-1.5 lg:px-4 lg:py-2 tracking-wider">
          ${course.badge}
        </span>
      </div>

      <!-- Content -->
      <div class="flex flex-col px-4 sm:px-6 lg:px-8 pb-4 lg:pb-8">
        <span class="text-xs text-gray-500 uppercase mb-2 lg:mb-3">
          ${course.category}
        </span>
        <h3 class="text-lg lg:text-xl font-extrabold text-slate-900 mb-3 lg:mb-3.5">
          ${course.title}
        </h3>
        
        <!-- Footer (Avatar & Price) -->
        <div class="flex items-center justify-between border-t border-gray-200 pt-4 mt-1">
          <div class="flex items-center space-x-3">
            <img src="${course.instructorAvatar}" alt="${course.instructorName}" class="w-8 h-8 rounded-full object-cover">
            <span class="text-sm font-medium text-gray-500">${course.instructorName}</span>
          </div>
          <span class="text-base lg:text-md font-extrabold text-slate-900 tracking-tighter">${course.price}</span>
        </div>
      </div>
    </article>
  `;
}