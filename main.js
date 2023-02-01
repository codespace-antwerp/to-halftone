const canvas = document.createElement("canvas");
const ctx = canvas.getContext("2d");

// Load an image and render on canvas to get the pixels
async function main() {
  const image = new Image();
  image.src = `van_eyck_29_dec.png`;
  image.onload = () => {
    canvas.width = image.width;
    canvas.height = image.height;
    ctx.drawImage(image, 0, 0);
    const imageData = ctx.getImageData(0, 0, image.width, image.height);
    makeDotPattern(imageData);
  };
}

const DOT_SPACING = 10;
const dotScale = 0.8;

function makeDotPattern(imageData) {
  let svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttribute("width", imageData.width);
  svg.setAttribute("height", imageData.height);
  document.body.appendChild(svg);
  //   ctx.clearRect(0, 0, imageData.width, imageData.height);
  for (let y = 0; y < imageData.height; y += DOT_SPACING) {
    for (let x = 0; x < imageData.width; x += DOT_SPACING) {
      const i = (y * imageData.width + x) * 4;
      const r = imageData.data[i];
      const g = imageData.data[i + 1];
      const b = imageData.data[i + 2];
      const a = imageData.data[i + 3];
      let luminance = 0.2126 * r + 0.7152 * g + 0.0722 * b;
      luminance /= 255;
      if (luminance < 0.1) continue;
      //   const color = `rgba(${r}, ${g}, ${b}, ${a})`;
      let circle = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "circle"
      );
      circle.setAttribute("cx", x);
      circle.setAttribute("cy", y);
      circle.setAttribute("r", luminance * DOT_SPACING * dotScale);
      svg.appendChild(circle);

      //   let text = document.createElementNS("http://www.w3.org/2000/svg", "text");
      //   text.setAttribute("x", x);
      //   text.setAttribute("y", y);
      //   text.setAttribute("vertical-align", "middle");
      //   text.setAttribute("text-anchor", "middle");
      //   text.setAttribute("font-size", luminance * DOT_SPACING * dotScale * 3);
      //   text.textContent = "❤️";
      //   svg.appendChild(text);
    }
  }
}

function handleDownload() {
  // Download the SVG element
  const svg = document.querySelector("svg");
  const svgData = new XMLSerializer().serializeToString(svg);
  const svgBlob = new Blob([svgData], { type: "image/svg+xml;charset=utf-8" });
  const link = document.createElement("a");
  link.setAttribute("download", true);
  link.setAttribute("href", URL.createObjectURL(svgBlob));
  link.click();
}

document.querySelector("#download").addEventListener("click", handleDownload);

main();
