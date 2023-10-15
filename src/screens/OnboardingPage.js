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
import Onboarding from 'react-native-onboarding-swiper';
import Lottie from 'lottie-react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {useNavigation} from '@react-navigation/native';

export default function OnboardingPage({}) {
  const navigation = useNavigation();
  const handleDone = () => {
    navigation.navigate('LoginPage');
  };

  return (
    <View style={styles.container}>
      <Onboarding
        onDone={handleDone}
        onSkip={handleDone}
        pages={[
          {
            backgroundColor: '#a7f3d0',
            image: (
              <Lottie
                source={require('../../assets/animations/SadAni.json')}
                style={styles.lottie}
                loop
                speed={0.8}
                autoPlay
              />
            ),
            title: '고민있어?',
            subtitle: 'gpt에게 말 못할 고민을 말해봐!',
          },
          {
            backgroundColor: '#6499E9',
            image: (
              <Lottie
                source={require('../../assets/animations/BlueBear.json')}
                style={styles.lottie}
                loop
                speed={0.8}
                autoPlay
              />
            ),
            title: 'CHAT GPT는 너의 친구',
            subtitle: '나에게 맘편히 말해봐!',
          },
          {
            backgroundColor: '#F5EEC8',
            image: (
              <Lottie
                source={require('../../assets/animations/GreenBear.json')}
                style={styles.lottie}
                loop
                speed={0.8}
                autoPlay
              />
            ),
            title: '나랑 놀자!!',
            subtitle: '우측하단 V 를 클릭해주세요',
          },
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  lottie: {
    width: wp(90),
    width: wp(100),
  },
});
