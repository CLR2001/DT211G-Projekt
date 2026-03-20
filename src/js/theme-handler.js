"use strict";

/**
 * @file Theme Handler
 * @module ThemeHandler
 * @description
 * This module manages the theme (Light/Dark mode).<br>
 * Key features:<br>
 * 1. Detects system preferences using 'prefers-color-scheme'.<br>
 * 2. Persists user selection using localStorage.<br>
 * 3. Dynamically updates UI icons and meta tags.
 */

/**
 * Initializes the theme handling logic. 
 * @function initThemeHandler
 * @returns {void}
 */
export function initThemeHandler() {
  // 1. Select DOM Elements 
  const metaColor = document.querySelector('meta[name="color-scheme"]');
  const button = document.querySelector('.theme-button');
  const prefersDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;

  // 2. Applies correct value to data-theme on body based on system or storage
  if (prefersDarkMode && localStorage.getItem('theme') !== 'light') {
    applyTheme('dark');
  } else {
    const savedTheme = localStorage.getItem('theme') || 'light';
    applyTheme(savedTheme);
  }

  // 3. Change theme & icon.
  button.addEventListener('click', () => {
    let currentTheme = localStorage.getItem('theme') || 'light';
    
    if (currentTheme === 'dark') {
      applyTheme('light');
    } else {
      applyTheme('dark');
    }
  });

  /**
   * Applies the selected theme to the document and saves the state.
   * @param {'light'|'dark'} theme - The theme to be applied.
   * @function applyTheme
   * @inner
   */
  function applyTheme(theme) {
    document.documentElement.dataset.theme = theme;
    localStorage.setItem('theme', theme);
    
    // 5. Update button icon and meta color-scheme for browser UI consistency
    button.innerHTML = `<svg class="icon"><use href="#icon-${theme}-mode"></use></svg>`;
    if (metaColor) {
      metaColor.setAttribute('content', theme);
    }
  }
}