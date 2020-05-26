/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */
import FacialComparisonClientCapture from '@w2-global-data/w2-facial-comparison-capture-client-react-native';
import FacialComparisonClient from '@w2-global-data/w2-facial-comparison-client-react-native';
import DocumentVerificationClientCapture from '@w2-global-data/w2-document-verification-capture-client-react-native';
import DocumentVerificationClient from '@w2-global-data/w2-document-verification-client-react-native';

import React, {useState, useEffect} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar,
  Button,
  Image,
  Alert,
} from 'react-native';

import {Colors} from 'react-native/Libraries/NewAppScreen';

const licenseKey = 'LICENSE_KEY';

const App: () => React$Node = () => {
  const [message, setMessage] = useState(true);
  const [documentCaptureImage, setDocumentCaptureImage] = useState(false);
  const [facialCaptureImage, setFacialCaptureImage] = useState(false);

  const buildDocCapture = success => {
    DocumentVerificationClientCapture.build(
      'CLIENT_REFERENCE',
      licenseKey,
      (error, msg) => {
        if (!error) {
          success();
        } else {
          setMessage(error);
        }
      },
    );
  };

  const buildFacialCapture = success => {
    FacialComparisonClientCapture.build(
      'CLIENT_REFERENCE',
      licenseKey,
      (error, msg) => {
        if (!error) {
          success();
        } else {
          setMessage(error);
        }
      },
    );
  };

  const captureDocument = () => {
    DocumentVerificationClientCapture.capture(
      'ID3',
      image => {
        setDocumentCaptureImage(image);
      },
      err => setMessage(err),
    );
  };

  const captureFacial = () => {
    FacialComparisonClientCapture.capture(
      image => {
        setFacialCaptureImage(image);
      },
      err => setMessage(err),
    );
  };

  const verifyDoc = () => {

    if (!documentCaptureImage) {
      Alert.alert('Oops', 'Perform a document capture first before verifying');
      return;
    }

    setMessage('Loading...');
    DocumentVerificationClient.build(licenseKey, (error, msg) => {
      if (!error) {
        DocumentVerificationClient.verify(
          'CLIENT_REFERENCE',
          'ID3',
          documentCaptureImage,
          null,
          (err, result) => {
            console.log('Results: ' + result);
            setMessage(err || 'Success!');
          },
        );
      } else {
        setMessage(error);
      }
    });
  };

  const compareFace = () => {
    if (!facialCaptureImage) {
      Alert.alert('Oops', 'Perform a facial capture first before comparing');
      return;
    }

    setMessage('Loading...');
    FacialComparisonClient.build(licenseKey, (error, msg) => {
      if (!error) {
        FacialComparisonClient.compare(
          'CLIENT_REFERENCE',
          facialCaptureImage,
          facialCaptureImage,
          (err, result) => {
            console.log('Results: ' + result);
            setMessage(err || 'Success!');
          },
        );
      } else {
        setMessage(error);
      }
    });
  };

  useEffect(() => {
    setMessage('Building Capture Modules');
    buildDocCapture(() => {
      buildFacialCapture(() => {
        setMessage('Ready!');
      });
    });
  }, []);

  return (
    <>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView>
        <ScrollView
          contentInsetAdjustmentBehavior="automatic"
          style={styles.scrollView}>
          <Text style={styles.message}>{message}</Text>
          <View style={styles.body}>
            <View style={styles.sectionContainer}>
              <Text style={styles.sectionTitle}>Document Capture</Text>
              {documentCaptureImage && (
                <Image
                  style={styles.image}
                  source={{
                    uri: `file://${documentCaptureImage}`,
                    scale: 1,
                  }}
                />
              )}
              <Button title="Capture" onPress={captureDocument} />
            </View>
            <View style={styles.sectionContainer}>
              <Text style={styles.sectionTitle}>Document Verification</Text>
              <Button title="Verify" onPress={verifyDoc} />
            </View>
            <View style={styles.sectionContainer}>
              <Text style={styles.sectionTitle}>Facial Capture</Text>
              {facialCaptureImage && (
                <Image
                  style={styles.image}
                  source={{
                    uri: `file://${facialCaptureImage}`,
                    scale: 1,
                  }}
                />
              )}
              <Button title="Capture" onPress={captureFacial} />
            </View>
            <View style={styles.sectionContainer}>
              <Text style={styles.sectionTitle}>Facial Comparison</Text>
              <Button title="Compare" onPress={compareFace} />
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    backgroundColor: Colors.lighter,
  },
  body: {
    backgroundColor: Colors.white,
  },
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: Colors.black,
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
    color: Colors.dark,
  },
  highlight: {
    fontWeight: '700',
  },
  image: {
    justifyContent: 'center',
    width: 250,
    height: 150,
  },
  smallImage: {
    justifyContent: 'center',
    width: 150,
    height: 75,
  },
  message: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    color: 'blue',
  },
});

export default App;
