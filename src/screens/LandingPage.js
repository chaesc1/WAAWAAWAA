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

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

export default function LandingPage({navigation}) {
  return (
    <View style={styles.container}>
      <Image
        blurRadius={40}
        source={require('../../assets/images/Background_2.png')}
        style={styles.backgroundImage}
      />
      <View style={styles.textContainer}>
        <Text style={{fontWeight: 'bold', fontSize: wp(10)}}>
          Play With OPENAI
        </Text>
      </View>
      <Image
        style={styles.goldPicture}
        source={require('../../assets/images/bot.png')}
      />
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.startButton}
          onPress={() => navigation.navigate('LoginPage')}>
          <Text style={styles.startButtonText}>시작하기</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backgroundImage: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    zIndex: -1,
  },
  textContainer: {
    marginBottom: hp(5),
  },
  goldPicture: {
    width: wp(100),
    height: wp(100),
  },
  startButton: {
    width: wp(80),
    height: 50,
    backgroundColor: '#1E2B22',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 15,
  },
  buttonContainer: {
    marginTop: hp(10),
  },
  startButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: wp(6),
  },
});
