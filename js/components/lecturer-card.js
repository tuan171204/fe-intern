export function renderLecturerCard(lecturer) {
    const isTeacher = lecturer.badge === 'Teacher';
    const badgeClass = isTeacher ? 'bg-[#00A8A4]' : 'bg-gray-200';

    return `
    <article class="flex flex-col min-h-[580px]">

      <!-- Nửa trên (50% chiều cao): Ảnh -->
      <div class="relative w-full flex-1 overflow-hidden lg:bg-gray-100">
        <img
          src="${lecturer.image}"
          alt="${lecturer.name}"
          class="absolute inset-0 w-full h-full object-fill lg:object-contain"
        >
        <span class="absolute top-3 right-3 sm:top-4 sm:right-4 ${badgeClass} text-dark font-bold text-[10px] px-3 py-2.5 tracking-wider">
          ${lecturer.badge}
        </span>
      </div>

      <!-- Nửa dưới (50% chiều cao): role, name, desc, link -->
      <div class="flex-1 flex flex-col gap-4 lg:gap-0 pt-3 sm:pt-4">
        <span class="text-[12px] sm:text-sm text-gray-500 uppercase tracking-wide mb-1.5 sm:mb-2">
          ${lecturer.role}
        </span>
        <h3 class="text-md sm:text-lg font-extrabold text-slate-900 mb-1.5 sm:mb-4 truncate">
          ${lecturer.name}
        </h3>
        <p class="text-sm sm:text-md text-gray-500 leading-relaxed line-clamp-3 sm:line-clamp-4">
          ${lecturer.bio}
        </p>
        <a
          href="${lecturer.link}"
          target="_blank"
          rel="noopener noreferrer"
          class="text-xs sm:text-sm text-gray-700 underline underline-offset-2 hover:text-[#00A8A4] transition-colors sm:mt-2 lg:mt-5 truncate"
        >
          ${lecturer.link}
        </a>
      </div>

    </article>
  `;
}