"use strict";
import './scss/main.scss';
import { initPageHandler } from './js/page-handler.js';
import { initThemeHandler } from './js/theme-handler.js';
import { initIcons } from './js/fetch-icons.js';
import { initRaceData } from './js/race-data-handler.js';

/**
 * @file Main Application Entry Point
 * @module Main
 * @description
 * Orchestrates the initialization of the application's core modules. <br>
 * Key responsibilities:<br>
 * 1. **Module Bootstrapping**: Initializes page, theme, icon, and race data handlers.<br>
 * 2. **Layout Management**: Dynamically calculates and updates global CSS variables.
 */


document.addEventListener('DOMContentLoaded', () => {
  initPageHandler();
  initThemeHandler();
  initIcons();
  initRaceData();
  updateScrollbarWidth();
  window.addEventListener('resize', () =>{
    updateScrollbarWidth();
  });
});

/**
 * Calculates the width of the browser's scrollbar and updates a CSS custom property (--scrollbar-width) on the root element. <br>
 * This prevents layout shifting (jumping) when modals open and body overflow is hidden. <br>
 * @function updateScrollbarWidth
 * @returns {void}
 */
function updateScrollbarWidth(){
  const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
  document.documentElement.style.setProperty('--scrollbar-width', `${scrollbarWidth}px`);
}