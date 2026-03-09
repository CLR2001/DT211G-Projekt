import { getOptimizedImage } from "../image-optimizer.js";
import heroSrc from "../../assets/images/hero.avif?w=400;800;1200;1600;2000&format=avif;webp;jpg&as=metadata";
export const indexPage = `
<div class="main-content main-content-index">
  <section class="hero-section">
    <h1>Upplev F1 på plats. Planera din resa idag</h1>
    ${getOptimizedImage(heroSrc, {alt: "Red Bull Formel 1 bil under Singapore GP 2025", layout: "full", lazy: false, priority: true, className: "hero-image"})}
  </section>
</div>
`;