const { PDFDocument, rgb } = require("pdf-lib");
const fs = require("fs");

async function insertImageAsHeader(existingPdfPath, imagePath, outputPdfPath) {
  // Lee el archivo PDF existente
  const existingPdfBytes = await fs.promises.readFile(existingPdfPath);

  // Carga la imagen
  const imageBytes = await fs.promises.readFile(imagePath);

  // Crea un nuevo documento PDF
  const pdfDoc = await PDFDocument.load(existingPdfBytes);

  // Carga la imagen para ser usada en todas las páginas
  const image = await pdfDoc.embedPng(imageBytes);
  const { width, height } = image.scale(1 / 5); // Escala al tercio del tamaño original

  // Recorre todas las páginas y agrega la imagen como encabezado
  const pages = pdfDoc.getPages();
  for (const page of pages) {
    page.drawImage(image, {
      x: 50,
      y: page.getHeight() - height - 50,
      width: width,
      height: height,
    });
  }

  // Guarda el PDF con la imagen como encabezado en todas las páginas
  const modifiedPdfBytes = await pdfDoc.save();
  await fs.promises.writeFile(outputPdfPath, modifiedPdfBytes);
}

// Rutas de los archivos
const existingPdfPath = "test.pdf";
const imagePath = "imagen.png";
const outputPdfPath = "nuevo_archivo.pdf";

// Llama a la función para insertar la imagen como encabezado en todas las páginas del PDF
insertImageAsHeader(existingPdfPath, imagePath, outputPdfPath)
  .then(() => {
    console.log(
      "La imagen se ha insertado exitosamente como encabezado en todas las páginas del PDF."
    );
  })
  .catch((error) => {
    console.error(
      "Ocurrió un error al insertar la imagen como encabezado en el PDF:",
      error
    );
  });
