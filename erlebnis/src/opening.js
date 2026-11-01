// Live opening: the same new model remains on screen throughout.
export function initOpening() {
  document.body.classList.remove('is-opening');
  return { active: () => false, end: () => {} };
}
