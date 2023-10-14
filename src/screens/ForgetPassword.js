import React from 'react';
import {useEffect, useState} from 'react';
import Orientation from 'react-native-orientation';
import AsyncStorage from '@react-native-async-storage/async-storage';
import noAuthClient from '../apis/noAuthClient';
import {useFocusEffect} from '@react-navigation/native';
import Lottie from 'lottie-react-native';

import {
  View,
  Text,
  TouchableOpacity,
  Image,
  TextInput,
  Keyboard,
  TouchableWithoutFeedback,
  StyleSheet,
  Alert,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {ArrowLeftIcon} from 'react-native-heroicons/solid';
import {themeColors} from '../../theme';
import {useNavigation} from '@react-navigation/native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

export default function LoginScreen() {
  const navigation = useNavigation();
  const [userId, setUserId] = useState('');
  const [isStoredAccessToken, setIsStoredAccessToken] = useState(false);

  const getAccessTokenData = async () => {
    setIsStoredAccessToken(
      (await AsyncStorage.getItem('accessToken')) ? true : false,
    );
  };

  useFocusEffect(() => {
    getAccessTokenData();

    isStoredAccessToken && navigation.navigate('MemberMainPage');
  });

  // 유저 로그인 요청 api
  const login = async () => {
    try {
      await noAuthClient({
        method: 'post',
        url: `/mail/reset-password`,
        data: {
          userId: userId,
        },
      });

      Alert.alert(
        '메일 발송 성공!',
        '로그인 페이지로 가서 로그인 후, 반드시 비밀번호 재설정을 해야해!',
        [
          {
            text: '알겠어',
            onPress: () => {
              setUserId('');
              navigation.navigate('LoginPage');
            },
          },
        ],
      );
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.container}>
        <Image
          blurRadius={40}
          source={require('../../assets/images/Background_2.png')}
          style={styles.backgroundImage}
        />
        <SafeAreaView style={styles.safeArea}>
          <View style={styles.backButtonContainer}>
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              style={styles.backButton}>
              <ArrowLeftIcon size={wp('6%')} color="white" />
            </TouchableOpacity>
          </View>
          <View style={styles.imageContainer}>
            <Lottie
              source={require('../../assets/animations/newBear.json')}
              style={styles.image}
              autoPlay
              loop
            />
          </View>
        </SafeAreaView>
        <View style={styles.formContainer}>
          <View style={styles.form}>
            <Text style={styles.formLabel}>
              비밀번호를 재설정할 아이디를 입력해주세요
            </Text>
            <TextInput
              style={styles.input}
              placeholder="비밀번호를 재설정할 아이디를 입력해주세요."
              value={userId}
              onChangeText={setUserId}
              autoCapitalize="none"
              returnKeyType="next"
              underlineColorAndroid="#f000"
              blurOnSubmit={false}
            />
            <TouchableOpacity
              style={styles.loginButton}
              onPress={() => {
                login();
              }}>
              <Text style={styles.loginButtonText}>비밀번호 재설정</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: themeColors.bg,
    position: 'relative',
  },
  backgroundImage: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    zIndex: -1,
  },
  safeArea: {
    flex: 1,
  },
  backButtonContainer: {
    justifyContent: 'flex-start',
    width: wp(10),
  },
  backButton: {
    backgroundColor: '#1E2B22',
    padding: wp('1%'),
    borderTopRightRadius: wp('5%'),
    borderBottomLeftRadius: wp('5%'),
    marginLeft: wp('2%'),
  },
  imageContainer: {
    marginTop: hp(5),
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: wp('50%'),
    height: hp('40%'),
  },
  formContainer: {
    flex: 1,
    backgroundColor: 'white',
    borderTopLeftRadius: wp('12%'),
    borderTopRightRadius: wp('12%'),
    paddingHorizontal: wp('4%'),
  },
  form: {
    padding: 10,
    paddingTop: hp('7%'),
    justifyContent: 'center',
  },
  formLabel: {
    marginLeft: wp('1.3%'),
    fontSize: 17,
    color: 'black',
    marginBottom: hp('1%'),
  },
  label: {
    marginTop: wp('2%'),
    marginLeft: wp('1.3%'),
    color: 'gray',
    marginBottom: hp('1%'),
  },
  input: {
    padding: wp('4%'),
    backgroundColor: '#F0F0F0',
    color: 'gray',
    borderRadius: wp('8%'),
    marginTop: wp('3%'),
    marginBottom: wp('3%'),
  },
  forgotPassword: {
    alignItems: 'flex-end',
  },
  forgotPasswordText: {
    color: 'gray',
    marginBottom: wp('1%'),
  },
  loginButton: {
    backgroundColor: '#1E2B22',
    borderRadius: wp('8%'),
    paddingVertical: wp('4%'),
  },
  loginButtonText: {
    fontSize: wp('4%'),
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
  },
  orText: {
    fontSize: wp('4%'),
    color: 'gray',
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: wp('2%'),
  },
  socialButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: wp('2%'),
  },
  signupContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: wp('2%'),
  },
  signupText: {
    color: 'gray',
    fontWeight: 'bold',
  },
  signupLink: {
    color: '#004225',
    fontWeight: '500',
  },
});
