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
});