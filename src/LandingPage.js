/* eslint-disable @typescript-eslint/no-unused-vars */
import React from 'react-native';
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  SafeAreaView,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  StatusBar,
} from 'react-native';

export default function LandingPage({navigation}) {
  return (
    <SafeAreaView style={styles.container}>
      <Image
        style={styles.goldPicture}
        source={require('../assets/gold.png')}
      />
      <TouchableOpacity
        style={styles.startButton}
        onPress={() => navigation.navigate('LoginPage')}>
        <Text style={styles.startButtonText}>시작하기</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3E99F',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 24,
  },
  goldPicture: {
    width: 200,
    height: 200,
  },
  startButton: {
    width: 150,
    height: 40,
    backgroundColor: '#1E2B22',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 15,
  },
  startButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 20,
  },
});
