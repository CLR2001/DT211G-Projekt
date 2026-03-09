"use strict";
/* -------------------------------------------------------------------------- */
/*                  Responsive navigation with hamburger menu                 */
/* -------------------------------------------------------------------------- */
/* ------------------- 1. Handles navigation functionality ------------------ */
/* ------------------- 2. Updates scrollbarWidth variable ------------------- */

export function initNavigation() {
  // 1. Selects DOM elements
  const nav = document.querySelector('header nav');
  const hamburgerButton = document.querySelector('.hamburger-button');
  const navigationLinks = document.querySelectorAll('.nav-list a, .header-logo');

  // 2. Checks if elements exist to avoid crashes
  if (!nav || !hamburgerButton) return;

  // 3. Function to update scrollbar width dynamically
  function updateScrollbarWidth(){
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
    document.documentElement.style.setProperty('--scrollbar-width', `${scrollbarWidth}px`);
  }

  // 4. Calculates header height and stores and variable
  function headerHeight() {
    const header = document.querySelector('header');
    document.documentElement.style.setProperty('--header-height', `${header.offsetHeight}px`); 
  }

  // 5. Runs on load
  updateScrollbarWidth();
  headerHeight();

  // 6. Repeated functions
  function closeMenu(nav) {
    nav.dataset.open = "false";
    toggleInert(false);
    hamburgerButton.innerHTML = '<svg class="icon"><use href="#icon-hamburger-open"></use></svg>';
  }

  function toggleInert(value) {
    const elements = document.querySelectorAll('body > :not(header)');
    elements.forEach(element => {
      element.inert = value;
    })
  }

  // 7. Closes menu when resizing window
  window.addEventListener('resize', () =>{
    updateScrollbarWidth();
    headerHeight();
    if (window.innerWidth > 991 && nav.dataset.open === "true"){
      closeMenu(nav);
    }
  });

  // 8. Hamburger button functionality
  hamburgerButton.addEventListener('click', () => {
    const toOpen = nav.dataset.open !== "true";
    nav.dataset.open = toOpen;
    toggleInert(toOpen);
    if (toOpen) {
      hamburgerButton.innerHTML = '<svg class="icon"><use href="#icon-hamburger-close"></use></svg>';
    } else {
      hamburgerButton.innerHTML = '<svg class="icon"><use href="#icon-hamburger-open"></use></svg>';    
    }
  });

  // 9. Closes menu when clicking on link
  navigationLinks.forEach(link => {
    link.addEventListener('click', () => closeMenu(nav));
  });
}




