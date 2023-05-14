import { SubWindow } from './modules/subWindow/index.js';

(() => {
  const item = Array.from<HTMLElement>(
    document.querySelectorAll("[data-sub-window='item']")
  ).filter((v) => v instanceof HTMLElement);
  const subWindowList = item.map((root) => new SubWindow(root));

  console.log(subWindowList);
})();
