import * as Sharing from 'expo-sharing';

export const openPdf = async (uri: string): Promise<void> => {
  try {

    const isSharingAvailable = await Sharing.isAvailableAsync();
    if (isSharingAvailable) {
      await Sharing.shareAsync(uri, {
        mimeType: 'application/pdf',
        dialogTitle: 'Open PDF',
        UTI: 'com.adobe.pdf', // iOS only
      });
    } else {
      console.warn('Sharing is not available on this device');
    }
  } catch (error) {
    console.error('Failed to generate or open PDF:', error);
  }
};