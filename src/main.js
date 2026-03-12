"use strict";
import './scss/main.scss';
import { initPageHandler } from './js/page-handler.js';
import { initThemeHandler } from './js/theme-handler.js';
import { initIcons } from './js/fetch-icons.js';
import { initRaceData } from './js/race-data-handler.js';


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

function updateScrollbarWidth(){
  const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
  document.documentElement.style.setProperty('--scrollbar-width', `${scrollbarWidth}px`);
}