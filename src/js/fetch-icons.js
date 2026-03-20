/**
 * @file SVG Icon Asset Loader
 * @module IconLoader
 * @description
 * This module automates the retrieval and injection of global SVG assets.<br>
 * Key features:<br>
 * 1. Asynchronous Fetching: Loads external SVG spritesheets from the server.<br>
 * 2. DOM Injection: Injects hidden SVG definitions into the document body.<br>
 * 3. Asset Availability: Enables the use of `<use href="#id">` throughout the application for efficient icon rendering.
 */

/**
 * Fetches and injects an external SVG sprite sheet into the DOM.
 * @async
 * @function initIcons
 * @returns {Promise<void>} Resolves when icons are successfully injected.
 * @throws {Error} Logs a descriptive error if the fetch request fails.
 */
export async function initIcons() {
  try {
    const response = await fetch('/icons/icons.svg');
    if (!response.ok) {
      throw new Error("Kunde inte ladda ikoner");
    }
    const svgData = await response.text();
    const div = document.createElement('div');
    div.style.display = 'none';
    div.innerHTML = svgData;
    document.body.appendChild(div);
  }
  catch (error) {
    console.error("Error: ", error);
  }
}