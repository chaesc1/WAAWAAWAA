import React, {useState, useEffect, useCallback} from 'react';
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
  Image,
  ScrollView,
} from 'react-native';
import {themeColors} from '../../theme';
import {SafeAreaView} from 'react-native-safe-area-context';
import {ArrowLeftIcon} from 'react-native-heroicons/solid';
import {useNavigation} from '@react-navigation/native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import Lottie from 'lottie-react-native';
import axios from 'axios';
import noAuthClient from '../apis/noAuthClient';
export default function SignUpScreen() {
  const navigation = useNavigation();
  const [username, setUsername] = useState('');
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const [age, setAge] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [PasswordLength, setPasswordLength] = useState('');
  const [ConfirmPasswordLength, setConfirmPasswordLength] = useState('');
  //오류메시지 상태저장
  const [nameMessage, setNameMessage] = useState('');
  const [idMessage, setIdMessage] = useState('');
  const [passwordMessage, setPasswordMessage] = useState('');
  const [passwordConfirmMessage, setPasswordConfirmMessage] = useState('');

  // 유효성 검사
  const [isName, setIsName] = useState(false);
  const [isId, setIsId] = useState(false);
  const [isPassword, setIsPassword] = useState(false);
  const [isPasswordConfirm, setIsPasswordConfirm] = useState(false);
  const [isAge, setIsAge] = useState(false);

  // 이름
  const onChangeNickName = useCallback(e => {
    const nickname = e.nativeEvent.text;
    setUsername(nickname);
    if (nickname.length < 3 || nickname.length > 15) {
      setNameMessage('3글자 이상 15글자 미만으로 입력해주세요.');
      setIsName(false);
    } else {
      setNameMessage('올바른 닉네임 형식입니다 :)');
      setIsName(true);
    }
  }, []);

  // 아이디
  const onChangeId = useCallback(e => {
    const idCurrent = e.nativeEvent.text;
    setUserId(idCurrent);
    if (idCurrent.length < 3 || idCurrent.length > 15) {
      setIdMessage('3글자 이상 15글자 미만으로 입력해주세요.');
      setIsId(false);
    } else {
      setIdMessage('올바른 ID 형식입니다.');
      setIsId(true);
    }
  }, []);
  // 비밀번호
  const onChangePassword = useCallback(e => {
    // const passwordRegex =
    //   /^(?=.*[a-zA-Z])(?=.*[!@#$%^*+=-])(?=.*[0-9]).{8,25}$/;
    // const passwordCurrent = e.target.value;
    // console.log(passwordRegex.test(passwordCurrent));
    // setPassword(passwordCurrent);
    // if (!passwordRegex.test(passwordCurrent)) {
    //   console.log(`입력된 비밀번호${passwordCurrent}`);
    //   setPasswordMessage(
    //     '숫자,영문자,특수문자 조합으로 8자리 이상 입력해주세요!',
    //   );
    //   setIsPassword(false);
    // } else {
    //   setPasswordMessage('안전한 비밀번호에요 : )');
    //   setIsPassword(true);
    // }
  }, []);
  // 비밀번호 확인
  const onChangePasswordConfirm = useCallback(
    e => {
      // const passwordConfirmCurrent = e.target.value;
      // setConfirmPassword(passwordConfirmCurrent);
      // if (password == passwordConfirmCurrent) {
      //   setIsPasswordConfirm(false);
      //   setPasswordConfirmMessage('비밀번호를 똑같이 입력했어요 : )');
      // } else {
      //   setIsPasswordConfirm(false);
      //   setPasswordConfirmMessage('비밀번호가 틀려요. 다시 확인해주세요');
      // }
    },
    [password],
  );
  // 나이 확인
  const onChangeAge = useCallback(e => {
    const ageConfirmCurrent = e.nativeEvent.text;
    setAge(ageConfirmCurrent);

    if (age === ageConfirmCurrent) {
      setIsAge(true);
    } else {
      setIsAge(false);
    }
  }, []);
  // 유저생성 요청 api
  const register = async () => {
    // 모든 필드의 유효성을 확인
    if (isName && isId && isPassword && isPasswordConfirm && isAge) {
      console.log(username, userId, password, age);
      try {
        const res = await noAuthClient({
          method: 'post',
          url: `/users`,
          data: {
            username: username,
            userId: userId,
            password: password,
            age: Number(age),
          },
        });

        if (res.status === 201) {
          Alert.alert('유저 생성 성공');
          navigation.navigate('LoginPage'); // 회원가입 성공 시 로그인 페이지로 이동
        } else {
          // 서버 응답이 실패인 경우
          Alert.alert('유저 생성 실패', '유저 생성에 실패했습니다.');
        }
      } catch (error) {
        console.log('Test Error:', error.response);
      }
    } else {
      // 필드 중 하나라도 유효하지 않으면 오류 메시지 표시
      Alert.alert('입력 정보를 확인하세요', '유효하지 않은 정보가 있습니다.');
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.container}>
        <SafeAreaView style={styles.safeArea}>
          <View style={styles.backButtonContainer}>
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              style={styles.backButton}>
              <ArrowLeftIcon size={wp('6%')} color="white" />
            </TouchableOpacity>
          </View>
          {/* 이미지 */}
          <View style={styles.imageContainer}>
            <Lottie
              source={require('../../assets/animations/Bear.json')}
              style={styles.image}
              loop
              speed={0.8}
              autoPlay
            />
          </View>
        </SafeAreaView>
        <View style={styles.formContainer}>
          <ScrollView style={styles.form}>
            <Text style={styles.label}>Name</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter Name"
              value={username}
              autoCapitalize="none"
              returnKeyType="next"
              onChange={onChangeNickName}
              underlineColorAndroid="#f000"
              blurOnSubmit={false}
            />
            {username.length > 0 && (
              <Text
                style={{color: 'red'}}
                className={`message ${isName ? 'success' : 'error'}`}>
                {nameMessage}{' '}
              </Text>
            )}
            <Text style={styles.label}>ID</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter ID"
              autoCapitalize="none"
              returnKeyType="next"
              value={userId}
              onChange={onChangeId}
              underlineColorAndroid="#f000"
              blurOnSubmit={false}
            />
            {userId.length > 0 && (
              <Text className={`message ${isId ? 'success' : 'error'}`}>
                {idMessage}{' '}
              </Text>
            )}
            <Text style={styles.label}>Password</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter Password"
              secureTextEntry
              autoCapitalize="none"
              returnKeyType="next"
              value={password}
              onChangeText={text => {
                console.log(`비밀번호: ${text}`);
                const Length = text.length;
                setPasswordLength(Length);
                console.log(`비밀번호 길이: ${PasswordLength}`);

                const passwordRegex =
                  /^(?=.*[a-zA-Z])(?=.*[!@#$%^*+=-])(?=.*[0-9]).{8,25}$/;
                const passwordCurrent = text;
                // console.log(passwordRegex.test(passwordCurrent));
                setPassword(passwordCurrent);
                if (!passwordRegex.test(passwordCurrent)) {
                  // console.log(`입력된 비밀번호${passwordCurrent}`);
                  setPasswordMessage(
                    '숫자,영문자,특수문자 조합으로 8자리 이상 입력해주세요!',
                  );
                  setIsPassword(false);
                } else {
                  setPasswordMessage('안전한 비밀번호에요 : )');
                  setIsPassword(true);
                }
              }}
              // onChange={onChangePassword}
              underlineColorAndroid="#f000"
              blurOnSubmit={false}
            />
            {PasswordLength > 0 && (
              <Text className={`message ${isPassword ? 'success' : 'error'}`}>
                {passwordMessage}{' '}
              </Text>
            )}
            <Text style={styles.label}>ReEnter Password</Text>
            <TextInput
              style={styles.input}
              secureTextEntry
              placeholder="ReEnter Password"
              autoCapitalize="none"
              returnKeyType="next"
              value={confirmPassword}
              onChangeText={text => {
                console.log(`비밀번호: ${text} ${password}`);
                const Length = text.length;
                setConfirmPasswordLength(Length);
                console.log(`비밀번호 길이: ${ConfirmPasswordLength}`);
                const passwordConfirmCurrent = text;
                setConfirmPassword(passwordConfirmCurrent);
                if (password == passwordConfirmCurrent) {
                  setIsPasswordConfirm(false);
                  setPasswordConfirmMessage('비밀번호를 똑같이 입력했어요 : )');
                } else {
                  setIsPasswordConfirm(false);
                  setPasswordConfirmMessage(
                    '비밀번호가 틀려요. 다시 확인해주세요',
                  );
                }
              }}
              // onChange={onChangePasswordConfirm}
              underlineColorAndroid="#f000"
              blurOnSubmit={false}
            />
            {ConfirmPasswordLength > 0 && (
              <Text
                className={`message ${
                  isPasswordConfirm ? 'success' : 'error'
                }`}>
                {passwordConfirmMessage}{' '}
              </Text>
            )}
            <Text style={styles.label}>Age</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter Age"
              value={age}
              onChange={onChangeAge}
            />
          </ScrollView>
          {/* 버튼 */}
          <TouchableOpacity style={styles.signUpButton} onPress={register}>
            <Text style={styles.signUpButtonText}>회원가입</Text>
          </TouchableOpacity>
          <Text style={styles.orText}>Or</Text>
          <View style={styles.loginContainer}>
            <Text style={styles.loginText}>이미 계정이 있나요?</Text>
            <TouchableOpacity onPress={() => navigation.navigate('LoginPage')}>
              <Text style={styles.loginLink}> 로그인</Text>
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
    backgroundColor: themeColors.bg,
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
    marginBottom: hp('10.4%'),
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: wp('45%'),
    height: hp('35%'),
  },
  formContainer: {
    flex: 1,
    backgroundColor: 'white',
    borderTopLeftRadius: wp('12%'),
    borderTopRightRadius: wp('12%'),
    paddingHorizontal: wp('4%'),
    paddingTop: hp('40%'),
  },
  form: {
    marginTop: hp('-37.5%'),
  },
  label: {
    color: 'gray',
    marginLeft: wp('1.3%'),
  },
  input: {
    height: hp(5),
    padding: wp('2%'),
    backgroundColor: '#F0F0F0',
    color: 'gray',
    borderRadius: wp('8%'),
    marginBottom: wp('2%'),
  },
  signUpButton: {
    backgroundColor: '#1E2B22',
    borderRadius: wp('8%'),
    paddingVertical: wp('4%'),
    marginTop: hp('1%'),
  },
  signUpButtonText: {
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
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: hp('3%'),
  },
  loginText: {
    color: 'gray',
    fontWeight: 'bold',
    marginBottom: hp('4%'),
  },
  loginLink: {
    color: '#004225',
    fontWeight: '500',
  },
});
