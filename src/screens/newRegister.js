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
} from 'react-native';
import {themeColors} from '../../theme';
import {SafeAreaView} from 'react-native-safe-area-context';
import {ArrowLeftIcon} from 'react-native-heroicons/solid';
import {useNavigation} from '@react-navigation/native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import axios from 'axios';
export default function SignUpScreen() {
  const navigation = useNavigation();
  const [username, setUsername] = useState('');
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const [age, setAge] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // 유효성 검사
  const [isName, setIsName] = useState(false);
  const [isId, setIsId] = useState(false);
  const [isPassword, setIsPassword] = useState(false);
  const [isPasswordConfirm, setIsPasswordConfirm] = useState(false);
  const [isAge, setIsAge] = useState(false);

  // 이름
  const onChangeNickName = useCallback(e => {
    setUsername(e.nativeEvent.text);
  }, []);

  // 아이디
  const onChangeId = useCallback(e => {
    const idCurrent = e.nativeEvent.text;
    setUserId(idCurrent);

    setIsId(true);
  }, []);

  // 비밀번호
  const onChangePassword = useCallback(e => {
    const passwordRegex =
      /^(?=.*[a-zA-Z])(?=.*[!@#$%^*+=-])(?=.*[0-9]).{8,25}$/;
    const passwordCurrent = e.nativeEvent.text;
    setPassword(passwordCurrent);

    if (!passwordRegex.test(passwordCurrent)) {
      setIsPassword(false);
    } else {
      setIsPassword(true);
    }
  }, []);

  // 비밀번호 확인
  const onChangePasswordConfirm = useCallback(
    e => {
      const passwordConfirmCurrent = e.nativeEvent.text;
      setConfirmPassword(passwordConfirmCurrent);

      if (password === passwordConfirmCurrent) {
        setIsPasswordConfirm(true);
      } else {
        setIsPasswordConfirm(false);
      }
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
    try {
      const res = await axios({
        method: 'post',
        url: `http://15.164.50.203:3000/users`,
        data: {
          username: username,
          userId: userId,
          password: password,
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
      console.log('Test Error:', error);
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
          <View style={styles.imageContainer}>
            <Image
              source={require('../../assets/images/signup.png')}
              style={styles.image}
            />
          </View>
        </SafeAreaView>
        <View style={styles.formContainer}>
          <View style={styles.form}>
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
            <Text style={styles.label}>Password</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter Password"
              secureTextEntry
              autoCapitalize="none"
              returnKeyType="next"
              value={password}
              onChange={onChangePassword}
              underlineColorAndroid="#f000"
              blurOnSubmit={false}
            />
            <Text style={styles.label}>Password</Text>
            <TextInput
              style={styles.input}
              secureTextEntry
              placeholder="ReEnter Password"
              autoCapitalize="none"
              returnKeyType="next"
              value={confirmPassword}
              onChange={onChangePasswordConfirm}
              underlineColorAndroid="#f000"
              blurOnSubmit={false}
            />
            <Text style={styles.label}>Age</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter Age"
              value={age}
              onChange={onChangeAge}
            />
            {/* 버튼 */}
            <TouchableOpacity style={styles.signUpButton} onPress={register}>
              <Text style={styles.signUpButtonText}>회원가입</Text>
            </TouchableOpacity>
          </View>
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
    marginTop: hp(5),
    width: wp('45%'),
    height: hp('15%'),
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
    marginTop: hp('2%'),
  },
  loginText: {
    color: 'gray',
    fontWeight: 'bold',
  },
  loginLink: {
    color: '#004225',
    fontWeight: '500',
  },
});
