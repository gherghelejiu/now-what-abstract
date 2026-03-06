import RNFS from 'react-native-fs';

export const imageToBase64 = async (imagePath: string): Promise<string> => {
  const base64 = await RNFS.readFile(imagePath, 'base64');
  return `data:image/jpeg;base64,${base64}`;
};