import { imageToBase64 } from "./image";


export const buildHtmlContent = async (
  textArray: string[],
  imagePaths: string[]
): Promise<string> => {
  // Convert all images to base64
  const base64Images = await Promise.all(imagePaths.map(imageToBase64));

  const textBlocks = textArray
    .map(text => `<p style="font-size: 14px; margin: 10px 0;">${text}</p>`)
    .join('');

  const imageBlocks = base64Images
    .map(src => `<img src="${src}" style="width: 100%; margin: 10px 0;" />`)
    .join('');

  return `
    <html>
      <head>
        <meta charset="utf-8" />
        <style>
          body { font-family: Helvetica, Arial, sans-serif; padding: 20px; }
          img  { max-width: 100%; }
        </style>
      </head>
      <body>
        ${textBlocks}
        ${imageBlocks}
      </body>
    </html>
  `;
};