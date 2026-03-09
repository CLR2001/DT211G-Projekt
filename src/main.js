"use strict";
import './scss/main.scss';
import { initPageHandler } from './js/page-handler.js';
import { initThemeHandler } from './js/theme-handler.js';

document.addEventListener('DOMContentLoaded', () => {
  initPageHandler();
  initThemeHandler();
});