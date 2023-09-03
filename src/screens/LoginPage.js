import React from 'react';
import {useEffect, useState} from 'react';
import axios from 'axios';
import Orientation from 'react-native-orientation';
import AsyncStorage from '@react-native-async-storage/async-storage';

import {
  StyleSheet,
  View,
  Text,
  Alert,
  TextInput,
  Button,
  TouchableWithoutFeedback,
  Keyboard,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import noAuthClient from '../apis/noAuthClient';

export default function LoginPage({navigation}) {
  const [isLandscape, setIsLandscape] = useState(false);
  const [userId, setUserId] = useState('');
  const [userPassword, setUserPassword] = useState('');

  // const [accessToken, setAccessToken] = useState('');
  // const [refreshToken, setRefreshToken] = useState('');

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

      await AsyncStorage.setItem("accessToken", res.data.accessToken);
      await AsyncStorage.setItem("refreshToken", res.data.refreshToken);

      const storedAccessToken = await AsyncStorage.getItem('accessToken');
      const storedRefreshToken = await AsyncStorage.getItem('refreshToken');
      
      console.log('Stored access token:', storedAccessToken);
      console.log('Stored refresh token:', storedRefreshToken);

      
      
    } catch (err) {
      console.error(err);
    }
  };
  // 가로 모드일 때 레이아웃 스타일
  const landscapeStyles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#F3E99F',
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'row', // 가로 방향 배치
    },
    smallContainer: {
      backgroundColor: '#FDFBEC',
      alignItems: 'center',
      justifyContent: 'center',
      width: wp('100%'), // 스크린 가로 크기 70%
      height: hp('50%'), // 스크린 세로 크기 100%
      borderRadius: wp('2%'),
    },
    Text: {
      flex: 1,
      bottom: 10,
      color: 'black',
      fontSize: hp('10%'),
      fontWeight: 'bold',
      marginTop: hp('15%'),
    },
    fixToInput: {
      flex: 1,
      flexDirection: 'col',
      justifyContent: 'space-between',
      marginTop: hp('2%'),
      padding: hp('2%'),
    },
    buttonContainer: {
      flex: 2,
      flexDirection: 'col',
      marginTop: hp('3%'),
    },
    socialLogin: {
      flexDirection: 'row',
      marginBottom: hp('3%'),
    },
    textFormTop: {
      //로그인 비밀번호 텍스트 인풋
      width: wp('50%'),
      backgroundColor: '#FFFFFF',
      marginBottom: hp('1%'),
      paddingHorizontal: hp('1%'),
      height: hp('5%'),
      borderRadius: 10,
      borderColor: 'gray',
      borderWidth: 1,
    },
    button: {
      width: wp('50%'),
      height: hp('5%'),
      backgroundColor: '#1E2B22',
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: 15,
      marginHorizontal: 10,
      marginBottom: hp('1%'),
    },
    social_button: {
      width: wp('30%'),
      height: hp('5%'),
      backgroundColor: '#1E2B22',
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: 15,
      marginHorizontal: 8,
    },
    buttonText: {
      color: 'white',
      fontWeight: 'bold',
      fontSize: hp('2%'),
    },
  });

  //세로 모드일 때 레이아웃 스타일
  const portraitStyles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#F3E99F',
      alignItems: 'center',
      justifyContent: 'center',
    },
    smallContainer: {
      backgroundColor: '#FDFBEC',
      alignItems: 'center',
      justifyContent: 'center',
      width: wp('75%'), // 스크린 가로 크기 100%
      height: hp('70%'), // 스크린 세로 크기 70%
      borderRadius: wp('2%'),
    },
    Text: {
      flex: 1,
      bottom: 100,
      color: 'black',
      fontSize: hp('10%'),
      fontWeight: 'bold',
      marginTop: hp('15%'),
    },
    fixToInput: {
      flex: 1,
      flexDirection: 'col',
      justifyContent: 'space-between',
      marginTop: hp('2%'),
      padding: hp('2%'),
    },
    buttonContainer: {
      flex: 2,
      flexDirection: 'col',
      marginTop: hp('3%'),
    },
    socialLogin: {
      flexDirection: 'row',
      marginBottom: hp('3%'),
    },
    textFormTop: {
      //로그인 비밀번호 텍스트 인풋
      width: wp('50%'),
      backgroundColor: '#FFFFFF',
      marginBottom: hp('1%'),
      paddingHorizontal: hp('1%'),
      height: hp('5%'),
      borderRadius: 10,
      borderColor: 'gray',
      borderWidth: 1,
    },
    button: {
      width: wp('50%'),
      height: hp('5%'),
      backgroundColor: '#1E2B22',
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: 15,
      marginHorizontal: 10,
      marginBottom: hp('1%'),
    },
    social_button: {
      width: wp('30%'),
      height: hp('5%'),
      backgroundColor: '#1E2B22',
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: 15,
      marginHorizontal: 8,
    },
    buttonText: {
      color: 'white',
      fontWeight: 'bold',
      fontSize: hp('2%'),
    },
  });

  const styles = isLandscape ? landscapeStyles : portraitStyles;
  useEffect(() => {
    // 화면 방향 변화 감지를 위해 이벤트 리스너 등록
    Orientation.addOrientationListener(handleOrientationChange);

    // 컴포넌트가 언마운트될 때 이벤트 리스너 제거
    return () => {
      Orientation.removeOrientationListener(handleOrientationChange);
    };
  }, []);

  const handleOrientationChange = orientation => {
    setIsLandscape(orientation === 'LANDSCAPE');
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.container}>
        <View style={styles.smallContainer}>
          <Text style={styles.Text}>UMM</Text>
          {/* 아이디 비밀번호 텍스트 박스 묶음 */}
          <View style={styles.fixToInput}>
            <TextInput
              style={styles.textFormTop}
              placeholder={'아이디'}
              value={userId}
              onChangeText={setUserId}
              autoCapitalize="none"
              returnKeyType="next"
              underlineColorAndroid="#f000"
              blurOnSubmit={false}
              
            />
            {/* <MyButton text="ddd" /> */}
            <TextInput
              style={styles.textFormTop}
              placeholder={'비밀번호'}
              value={userPassword}
              secureTextEntry={true} // 비밀번호 타입으로 변경
              onChangeText={setUserPassword}
              autoCapitalize="none"
              returnKeyType="next"
              underlineColorAndroid="#f000"
              blurOnSubmit={false}
            />
          </View>

          <View style={styles.buttonContainer}>
            {/* 로그인 하면 회원이 접근가능한 page로 */}
            <TouchableOpacity
              style={styles.button}
              onPress={() => {
                //navigation.navigate('MyPage')
                login();
              }}>
              <Text style={styles.buttonText}>로그인</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.button}
              onPress={() => navigation.navigate('Register')}>
              <Text style={styles.buttonText}>회원가입</Text>
            </TouchableOpacity>
            {/* 소셜 로그인 버튼 */}
          </View>
          <View style={styles.socialLogin}>
            <TouchableOpacity
              style={styles.social_button}
              onPress={() => navigation.navigate('Register')}>
              <Text style={styles.buttonText}>카카오 로그인</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.social_button}
              onPress={() => navigation.navigate('Register')}>
              <Text style={styles.buttonText}>구글 로그인</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
}

// const styles = StyleSheet.create({
//   //   container: {
//   //     flex: 1,
//   //     backgroundColor: '#F3E99F',
//   //     alignItems: 'center',
//   //     justifyContent: 'center',
//   //   },
//   //   smallContainer: {
//   //     backgroundColor: '#FDFBEC',
//   //     alignItems: 'center',
//   //     justifyContent: 'center',
//   //     width: wp('75%'), // 스크린 가로 크기 100%
//   //     height: hp('70%'), // 스크린 세로 크기 70%
//   //     borderRadius: wp('2%'),
//   //   },
//   //   Text: {
//   //     flex: 1,
//   //     bottom: 100,
//   //     color: 'black',
//   //     fontSize: hp('10%'),
//   //     fontWeight: 'bold',
//   //     marginTop: hp('15%'),
//   //   },
//   //   fixToInput: {
//   //     flex: 1,
//   //     flexDirection: 'col',
//   //     justifyContent: 'space-between',
//   //     marginTop: hp('2%'),
//   //     padding: hp('2%'),
//   //   },
//   //   buttonContainer: {
//   //     flex: 2,
//   //     flexDirection: 'col',
//   //     marginTop: hp('3%'),
//   //   },
//   //   socialLogin: {
//   //     flexDirection: 'row',
//   //     marginBottom: hp('3%'),
//   //   },
//   //   textFormTop: {
//   //     //로그인 비밀번호 텍스트 인풋
//   //     width: wp('50%'),
//   //     backgroundColor: '#FFFFFF',
//   //     marginBottom: hp('1%'),
//   //     paddingHorizontal: hp('1%'),
//   //     height: hp('5%'),
//   //     borderRadius: 10,
//   //     borderColor: 'gray',
//   //     borderWidth: 1,
//   //   },
//   //   button: {
//   //     width: wp('50%'),
//   //     height: hp('5%'),
//   //     backgroundColor: '#1E2B22',
//   //     justifyContent: 'center',
//   //     alignItems: 'center',
//   //     borderRadius: 15,
//   //     marginHorizontal: 10,
//   //     marginBottom: hp('1%'),
//   //   },
//   //   social_button: {
//   //     width: wp('30%'),
//   //     height: hp('5%'),
//   //     backgroundColor: '#1E2B22',
//   //     justifyContent: 'center',
//   //     alignItems: 'center',
//   //     borderRadius: 15,
//   //     marginHorizontal: 8,
//   //   },
//   //   buttonText: {
//   //     color: 'white',
//   //     fontWeight: 'bold',
//   //     fontSize: hp('2%'),
//   //   },
// });
