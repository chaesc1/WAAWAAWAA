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
  const [isLandscape, setIsLandscape] = useState(false);
  const [userId, setUserId] = useState('');
  const [userPassword, setUserPassword] = useState('');
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
      const res = await noAuthClient({
        method: 'post',
        url: `/signin`,
        data: {
          userId: userId,
          password: userPassword,
        },
      });

      //setRefreshToken(res.data.refreshToken);

      navigation.navigate('MemberMainPage');

      await AsyncStorage.setItem('accessToken', res.data.accessToken);
      await AsyncStorage.setItem('refreshToken', res.data.refreshToken);
      await AsyncStorage.setItem('userId', res.data.userId);

      const storedAccessToken = await AsyncStorage.getItem('accessToken');
      const storedRefreshToken = await AsyncStorage.getItem('refreshToken');
      const storedUserId = await AsyncStorage.getItem('userId');

      console.log('Stored access token:', storedAccessToken);
      console.log('Stored refresh token:', storedRefreshToken);
      console.log('Stored userId:', storedUserId);
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
            <Text style={styles.label}>ID</Text>
            <TextInput
              style={styles.input}
              placeholder="ID"
              value={userId}
              onChangeText={setUserId}
              autoCapitalize="none"
              returnKeyType="next"
              underlineColorAndroid="#f000"
              blurOnSubmit={false}
            />
            <Text style={styles.label}>Password</Text>
            <TextInput
              style={styles.input}
              placeholder="password"
              value={userPassword}
              secureTextEntry={true} // 비밀번호 타입으로 변경
              onChangeText={setUserPassword}
              autoCapitalize="none"
              returnKeyType="next"
              underlineColorAndroid="#f000"
              blurOnSubmit={false}
            />
            <TouchableOpacity style={styles.forgotPassword}>
              <Text style={styles.forgotPasswordText}>
                비밀번호를 잊으셨나요?
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.loginButton}
              onPress={() => {
                //navigation.navigate('MyPage')
                login();
              }}>
              <Text style={styles.loginButtonText}>로그인</Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.orText}>Or</Text>
          <View style={styles.signupContainer}>
            <Text style={styles.signupText}>계정이 아직 없으신가요?</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Register')}>
              <Text style={styles.signupLink}>회원가입</Text>
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
    paddingTop: hp('15%'),
  },
  form: {
    marginTop: wp('-20%'),
  },
  label: {
    marginLeft: wp('1.3%'),
    color: 'gray',
  },
  input: {
    padding: wp('4%'),
    backgroundColor: '#F0F0F0',
    color: 'gray',
    borderRadius: wp('8%'),
    marginBottom: wp('2%'),
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
    marginTop: hp('5%'),
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
