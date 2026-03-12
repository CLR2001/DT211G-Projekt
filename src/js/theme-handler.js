"use strict"

/* -------------------------------------------------------------------------- */
/*                   Theme handling for light and dark mode                   */
/* -------------------------------------------------------------------------- */
/* ------------------------- 1. Changes color scheme ------------------------ */
/* ---------------- 2. Saves selected theme to local storage ---------------- */

export function initThemeHandler() {
  // 1. Select DOM Elements 
  const metaColor = document.querySelector('meta[name="color-scheme"]');
  const button = document.querySelector('.theme-button');
  const prefersDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;

  // 2. Applies correct value to data-theme on body
  if (prefersDarkMode && localStorage.getItem('theme') != 'light') {
    applyTheme('dark');
  } else {
    applyTheme('light');
  }

  // 3. Change theme and icon on click
  button.addEventListener('click', () => {
    let currentTheme = localStorage.getItem('theme') || 'light';
    if (currentTheme === 'dark') {
      applyTheme('light');
    } else {
      applyTheme('dark');
    }
  });

  // 4. Function to apply theme
  function applyTheme(theme) {
    document.documentElement.dataset.theme = theme;
    localStorage.setItem('theme', `${theme}`);
    button.innerHTML = `<svg class="icon"><use href="#icon-${theme}-mode"></use></svg>`;
    metaColor.setAttribute('content', `${theme}`)
  }
}