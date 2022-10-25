import { Camera, CameraType } from 'expo-camera';
import { useState } from 'react';
import { Button, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import * as FaceDetector from 'expo-face-detector';
import React from 'react';

export default function App() {
  const [type, setType] = useState(CameraType.front);
  const [permission, requestPermission] = Camera.useCameraPermissions();
  const [faceData, setFaceData] = React.useState([]);

  if (!permission) {
    // Camera permissions are still loading
    return <View />;
  }

  if (!permission.granted) {
    // Camera permissions are not granted yet
    return (
      <View style={styles.container}>
        <Text style={{ textAlign: 'center' }}>We need your permission to show the camera</Text>
        <Button onPress={requestPermission} title="grant permission" />
      </View>
    );
  }
  

  function toggleCameraType() {
    setType(current => (current === CameraType.back ? CameraType.front : CameraType.back));
  }

  function getFaceDataView() {
    if (faceData.length === 0) {
      return (
        <View style={styles.faces}>
          <Text style={styles.faceDesc}>No faces :(</Text>
        </View>
      );
    } else {
      return faceData.map((face, index) => {
        const eyesShut = face.rightEyeOpenProbability < 0.4 && face.leftEyeOpenProbability < 0.4;
        const winking = !eyesShut && (face.rightEyeOpenProbability < 0.4 || face.leftEyeOpenProbability < 0.4);
        const smiling = face.smilingProbability > 0.7;
        return (
          <View style={styles.faces} key={index}>
            <Text style={styles.faceDesc}>Eyes Shut: {eyesShut.toString()}</Text>
            <Text style={styles.faceDesc}>Winking: {winking.toString()}</Text>
            <Text style={styles.faceDesc}>Smiling: {smiling.toString()}</Text>
          </View>
        );
      });
    }
  }

  const handleFacesDetected = ({ faces }) => {
    setFaceData(faces);
    console.log(faces);
  }
  return (
    <View style={styles.container}>
      <Camera style={styles.camera} type={'front'}
      onFacesDetected={handleFacesDetected}
      faceDetectorSettings={{
        mode: FaceDetector.FaceDetectorMode.accurate,
        detectLandmarks: FaceDetector.FaceDetectorLandmarks.none,
        runClassifications: FaceDetector.FaceDetectorClassifications.all,
        minDetectionInterval: 100,
        tracking: true
      }}>
        <View style={styles.buttonContainer}>
          {/* <TouchableOpacity style={styles.button} onPress={toggleCameraType}>
            <Text style={styles.text}>Flip Camera</Text>
          </TouchableOpacity> */}
        </View>
        {getFaceDataView()}
      </Camera>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  camera: {
    flex: 1,
  },
  faces: {
    backgroundColor: '#ffffff',
    alignSelf: 'stretch',
    alignItems: 'center',
    justifyContent: 'center',
    margin: 16
  },
  faceDesc: {
    fontSize: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonContainer: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: 'transparent',
    margin: 64,
  },
  button: {
    flex: 1,
    alignSelf: 'flex-end',
    alignItems: 'center',
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
});
