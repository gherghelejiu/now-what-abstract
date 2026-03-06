// import RNHTMLtoPDF from 'react-native-html-to-pdf';
import * as Print from 'expo-print';
import { buildHtmlContent } from './generator-html';
import { openPdf } from './open';

interface PdfOptions {
  textArray: string[];
  imagePaths: string[];
  fileName?: string;
}

export const generatePdf = async ({
  textArray,
  imagePaths,
  fileName = 'document',
}: PdfOptions): Promise<string | null> => {
  try {
    const html = await buildHtmlContent(textArray, imagePaths);

    const { uri } = await Print.printToFileAsync({ html });

    console.log('PDF saved at:', uri);

    await openPdf(uri);

    return uri ?? null;
  } catch (error) {
    console.error('PDF generation failed:', error);
    return null;
  }
};