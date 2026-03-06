import { generatePdf } from '@/utils/generator-pdf';
import { Alert, Button, StyleSheet, View } from 'react-native';


export default function TabTwoScreen() {

    const texts = ['Hello World', 'This is paragraph two.', 'Footer text here.'];
    const images: string[] = []; //  ['/path/to/local/image1.jpg', '/path/to/local/image2.png'];

    const handleGeneratePdf = async () => {
        const filePath = await generatePdf({ textArray: texts, imagePaths: images });
        if (filePath) {
          Alert.alert('PDF Ready', filePath);
        }
    };


    return (
      <View style={{
        flex: 1,
        backgroundColor: 'black',
        alignItems: 'center',
        justifyContent: 'center',
      }}>

        <Button title="Generate PDF" onPress={handleGeneratePdf} />
      </View>
    );
}

const styles = StyleSheet.create({
  headerImage: {
    color: '#808080',
    bottom: -90,
    left: -35,
    position: 'absolute',
  },
  titleContainer: {
    flexDirection: 'row',
    gap: 8,
  },
});
