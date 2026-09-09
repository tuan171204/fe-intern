export function renderComingSoonSlide(course) {
    const category = course.category || 'FRONTEND';
    const title = course.title || 'ReactJS';
    const instructorName = course.instructorName || 'Jane Cooper';
    const instructorAvatar = course.instructorAvatar || '../../assets/images/avatar1.png';
    const openingDay = course.openingDay || '28/02/2023';
    const learningForm = course.learningForm || 'Offline';
    const image = course.image || '../../assets/images/course/react-course.png';

    return `
    <div class="swiper-slide">
      <div class="relative bg-gray-100 p-6 sm:p-8 lg:py-10 lg:pl-80">
        
        <!-- Image Banner -->
        <div class="lg:absolute lg:top-1/2 lg:-translate-y-1/2 lg:-left-24 w-full lg:w-[320px] xl:w-[360px] aspect-square mb-6 sm:mb-8 lg:mb-0 z-10 flex justify-center items-center">
          <img 
            src="${image}" 
            alt="${title} Course" 
            class="max-w-[220px] sm:max-w-[280px] md:max-w-[320px] lg:max-w-[360px] max-h-[360px] object-contain drop-shadow-xl"
          >
        </div>

        <!-- Course Info -->
        <div class="flex flex-col max-w-xl gap-4">
          <div class="pt-2 sm:pt-4 lg:pt-10">
            <span class="text-xs sm:text-sm font-medium uppercase tracking-wider text-gray-400 block mb-1 sm:mb-2">${category}</span>
            <h3 class="text-2xl sm:text-3xl font-bold text-slate-900">${title}</h3>
          </div>

          <div class="flex items-center space-x-3">
            <img src="${instructorAvatar}" alt="${instructorName}" class="w-6 h-6 rounded-full object-cover">
            <span class="text-sm font-medium text-gray-600">${instructorName}</span>
          </div>

          <div class="flex gap-8 sm:gap-16 pt-2 mb-6 sm:mb-10 max-w-md">
            <div class="mt-2 sm:mt-4">
              <p class="text-xs sm:text-md font-medium text-gray-400 mb-1 sm:mb-3">Opening day</p>
              <p class="text-lg sm:text-2xl font-extrabold text-slate-900">${openingDay}</p>
            </div>
            <div class="mt-2 sm:mt-4">
              <p class="text-xs sm:text-md font-medium text-gray-400 mb-1 sm:mb-3">Learning form</p>
              <p class="text-lg sm:text-2xl font-extrabold text-slate-900">${learningForm}</p>
            </div>
          </div>

          <!-- CTA Buttons -->
          <div class="flex flex-col sm:flex-row flex-wrap gap-3 sm:gap-4">
            <a 
              href="register.html?id=${course.id}" 
              class="w-full sm:w-auto text-center px-6 sm:px-10 py-3.5 sm:py-4 rounded-full bg-slate-900 text-white font-bold text-sm hover:bg-slate-700 transition-colors shadow-sm"
            >
              Register for school
            </a>
            <a 
              href="course-detail.html?id=${course.id}" 
              class="w-full sm:w-auto text-center px-8 sm:px-14 py-3.5 sm:py-4 rounded-full border border-slate-900 text-slate-900 font-bold text-sm hover:bg-slate-900 hover:text-white transition-colors"
            >
              See details
            </a>
          </div>
        </div>

      </div>
    </div>
    `;
}