// js/components/value-item.js
export function renderValueItem(item) {
    return `
    <div class="flex flex-col">
      <h3 class="text-2xl font-bold text-slate-900 mb-3.5">${item.title}</h3>
      <p class="text-gray-500 leading-relaxed tracking-wide text-xs lg:text-sm font-medium">${item.description}</p>
    </div>
  `;
}