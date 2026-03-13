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