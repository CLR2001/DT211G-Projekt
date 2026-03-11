export async function initIcons() {
  try {
    const response = await fetch('src/assets/icons/icons.svg');
    if (!response.ok) {
      throw new Error("Kunde inte ladda ikoner");
    }
    const svgData = await response.text();
    document.body.insertAdjacentHTML('afterbegin', svgData);
  }
  catch (error) {
    console.error("Error: ", error);
  }
}