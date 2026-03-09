"use strict"
/* -------------------------------------------------------------------------- */
/*                  Page handling for single page application                 */
/* -------------------------------------------------------------------------- */
/* ------------------ 1. Renders content from selected page ----------------- */
/* --------------- 2. Listens to browser back/forward buttons --------------- */

// 1. Imports important pages
import { indexPage } from "./pages/index-page.js";
import { notFoundPage } from "./pages/not-found-page.js";

// 2. Imports all pages automatically
const pageFiles = import.meta.glob("./pages/*-page.js", { eager: true });

// 3. Function to handle page swapping
export function initPageHandler() {
  // Selects DOM elements
  const app = document.querySelector('#app');

  // Creates object with pages
  const pages = {
    'index': indexPage,
    'not-found': notFoundPage,
  };

  for(const path in pageFiles) {
    const pageKey = path.split('/').pop().replace('-page.js', '');
    const pageKeyValue = `${pageKey}Page`;
    pages[pageKey] = pageFiles[path][pageKeyValue]; 
  }

  // 4. Function to render content of active page
  const renderPageContent = (activePage, updateHistory = true) => {
    // Updates content and scrolls window to top
    app.innerHTML = pages[activePage] || notFoundPage;
    window.scrollTo(0, 0);

    // Adds history for browser
    if (updateHistory){
      const url = activePage === 'index' ? '/' : `/${activePage}`;
      window.history.pushState({ page: activePage }, "", url);
    }

    // Updates active page class
    updateActivePageClass(activePage);
  }

  // 5. Function to update what page has active class
  function updateActivePageClass(activePage) {
    const navLinks = document.querySelectorAll('.nav-list a');
    navLinks.forEach(link => {
      if (link.getAttribute('data-page') === activePage) {
        link.classList.add('active-page');
      }
      else {
        link.classList.remove('active-page');
      }
    });
  }

  // 6. Listens to browser back/forward buttons
  window.addEventListener('popstate', (event) => {
    let pageToLoad = event.state && event.state.page;
    if (!pageToLoad) {
      pageToLoad = window.location.pathname.replace('/', '') || 'index';
    }
    renderPageContent(pageToLoad, false);
  });

  // 7. Executes renderPageContent on click
  document.addEventListener('click', (event) => {
    const link = event.target.closest('[data-page]');
    if(link) {
      event.preventDefault();
      const activePage = link.getAttribute('data-page');
      renderPageContent(activePage);
    }
  });

  // 8. Render correct page on load
  const currentPath = window.location.pathname.replace('/', '');
  const initialPage = currentPath || 'index';
  renderPageContent(initialPage, false);

  
}