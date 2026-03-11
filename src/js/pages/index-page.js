import { getOptimizedImage } from "../image-optimizer.js";
import heroSrc from "../../assets/images/hero.jpg?w=400;800;1200;1600;2000&format=avif;webp;jpg&as=metadata";
export const indexPage = `
<div class="main-content main-content-index">
  <section class="hero-section">
    <h1>Upplev F1 på plats. Planera din resa idag</h1>
    ${getOptimizedImage(heroSrc, {alt: "Red Bull Formula 1 car during Singapore GP 2025", layout: "full", lazy: false, priority: true, className: "hero-image"})}
  </section>
  <form class="search-input">
      <label for="search-input">Sök:</label>
      <input type="text" name="search" id="search-input" placeholder="Sök efter land eller bana" autocomplete="off">
    </form>
  <section class="race-section">
    
  </section>
</div>
`;