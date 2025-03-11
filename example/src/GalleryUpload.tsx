import React, { useState } from 'react';
import {
  Text,
  View,
  StyleSheet,
  Button,
  Image,
  PermissionsAndroid,
  Platform,
} from 'react-native';
import { NitroOpencv } from 'react-native-nitro-opencv';
import { ImageLibraryOptions, launchImageLibrary } from 'react-native-image-picker';

function GalleryUpload(): React.JSX.Element {
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [grayScaleImage, setGrayScaleImage] = useState<string | null>('');

  const requestExternalStoragePermission = async () => {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
          {
            title: 'External Storage Permission',
            message: 'GalleryUpload needs access to your storage to read images.',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          },
        );
        console.log("granted",granted)
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          console.log('Storage permission granted');
          return true;
        } else {
          console.log('Storage permission denied');
          return false;
        }
      } catch (err) {
        console.warn(err);
        return false;
      }
    }
    return true;
  };

  const pickImage = async () => {
    const permissionGranted = await requestExternalStoragePermission();
    if (!permissionGranted) {
        return;
    }
    let options:ImageLibraryOptions = {
      mediaType: 'photo',
      quality: 1,
    };

    launchImageLibrary(options, (response) => {
      console.log('Response = ', response);

      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.errorCode) {
        console.log('ImagePicker Error: ', response.errorMessage);
      } else {
        const source = response.assets?.[0].uri;
        setImageUri(source || null);
      }
    });
  };

    const processImage = () => {
        if (imageUri){
            // here you will process the image.
            console.log("Processing image:" + imageUri);
            const grayScaleImage = NitroOpencv.grayScaleImage(imageUri); 
            console.log("grayScaleImage",grayScaleImage)
            setGrayScaleImage(grayScaleImage)
        }else{
            console.log("No image Selected.");
        }
    }

  return (
    <View style={styles.container}>
      {imageUri && (
        <Image source={{ uri: imageUri }} style={{ width: 200, height: 200 }} />
      )}
      <Button title="Pick an image from camera roll" onPress={pickImage} />
      <Button title="Process Image" onPress={processImage} />
      <Text style={styles.text}>{NitroOpencv.sum(1, 2)}</Text>
      {grayScaleImage && (
        <Image source={{ uri: grayScaleImage }} style={{ width: 200, height: 200 }} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 40,
    color: 'green',
  },
});

export default GalleryUpload;
