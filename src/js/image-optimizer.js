"use strict";
/* -------------------------------------------------------------------------- */
/*                               Image optimizer                              */
/* -------------------------------------------------------------------------- */
/* -------------------- 1. Converts to jpg, webp and avif ------------------- */
/* ---------------------- 2. Optimizes all image files ---------------------- */
/* -------------- 3. Creates srcset for different screen widths ------------- */

/**
 * Always include image sizes of 2x maxWidth in imageMetaData for retina support.
 * @param {Array} imageMetadata - Image source path with &as=metadata.
 * @param {object} options - Options object.
 * @param {string} options.alt - Alt text for image.
 * @param {'full'|'main'|'half'|'third'|'custom'} options.layout - Layout type (default: 'main').
 * @param {boolean} options.lazy - Enable lazy loading (default: true).
 * @param {boolean} options.priority - Enable fetchpriority (default: false).
 * @param {boolean} options.priority - Sets max-width for custom layout (default: 1400).
 * @param {string} options.class - Class name.
 * @param {string} options.id - id.
 */
export function getOptimizedImage(imageMetadata, { alt = "", layout = "main", lazy = true, priority = false, maxWidth = 1400, className = "", id = ""} = {}) {
  // 1. Control to catch wrong inputs
  if (!Array.isArray(imageMetadata)) {
    console.error("getOptimizedImage: image was imported without metadata (use &as=metadata)");
    return `<img src="" alt="${alt}">`;
  }
  if(priority && lazy) {priority = false}

  // 1. Different layout configs
  const sizeAlternatives = {
    full: '100vw',
    main: '(max-width: 1400px) 100vw, 1400px',
    half: '(max-width: 400px) 100vw, (max-width: 1400px) 50vw, 700px',
    third: '(max-width: 400px) 100vw, (max-width: 1400px) 33vw, 467px',
    custom: `(max-width: ${maxWidth}px) 100vw, ${maxWidth}px`
  };

  // 2. Selected size alternative
  const selectedSizeAlternative = sizeAlternatives[layout] || sizeAlternatives.main;

  // 3. Function to create Srcset for desired format
  const buildSrcset = (format) => {
    const Srcset =
      imageMetadata.filter(object => object.format === format)
      .map(object => `${object.src} ${object.width}w`)
      .join(', ');
    return Srcset;
  }
  
  // 4. Creates Srcset for desired formats
  const avifSrcset = buildSrcset('avif');
  const webpSrcset = buildSrcset('webp');
  const jpgSrcset = buildSrcset('jpeg') || buildSrcset('jpg');

  // 5. Creates fallback jpg file
  const jpgData = imageMetadata.filter(object => object.format === 'jpg' || object.format === 'jpeg');
  const sortedJpg = [...jpgData].sort((a, b) => b.width - a.width);
  const fallbackObject = sortedJpg[0] || imageMetadata[0];
  const fallback = fallbackObject ? fallbackObject.src : "";

  // 6. Return complete picture-element
  return `
    <picture>
      <source srcset="${avifSrcset}" sizes="${selectedSizeAlternative}" type="image/avif">
      <source srcset="${webpSrcset}" sizes="${selectedSizeAlternative}" type="image/webp">
      <img
        class="${className}"
        id="${id}"
        src="${fallback}"
        srcset="${jpgSrcset}"
        alt="${alt}"
        sizes="${selectedSizeAlternative}"
        loading="${lazy ? 'lazy' : 'eager'}"
        ${priority ? 'fetchpriority="high"' : ''}
        decoding="async"
      >
    </picture>
  `;
}