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
  SafeAreaView,
  Platform,
} from 'react-native';
import axios from 'axios';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import noAuthClient from '../apis/noAuthClient';

export default function RegisterPage({navigation}) {
  const [username, setUsername] = useState('');
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // 유효성 검사
  const [isName, setIsName] = useState(false);
  const [isId, setIsId] = useState(false);
  const [isPassword, setIsPassword] = useState(false);
  const [isPasswordConfirm, setIsPasswordConfirm] = useState(false);

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
      <SafeAreaView style={styles.container}>
        <View style={styles.smallContainer}>
          <Text style={styles.Text}>회원가입</Text>
          {/* 텍스트입력 */}
          <View style={styles.fixToInput}>
            <TextInput
              style={styles.textFormTop}
              placeholder={'이름'}
              value={username}
              autoCapitalize="none"
              returnKeyType="next"
              onChange={onChangeNickName}
              // onSubmitEditing={() =>
              //   passwordInputRef.current && passwordInputRef.current.focus()
              // }
              underlineColorAndroid="#f000"
              blurOnSubmit={false}
            />
            <TextInput
              style={styles.textFormTop}
              placeholder={'아이디'}
              //onChangeText={value => updateInput('email', value)}
              autoCapitalize="none"
              returnKeyType="next"
              // onSubmitEditing={() =>
              //   passwordInputRef.current && passwordInputRef.current.focus()
              // }
              value={userId}
              onChange={onChangeId}
              underlineColorAndroid="#f000"
              blurOnSubmit={false}
            />
            <TextInput
              style={styles.textFormTop}
              placeholder={'비밀번호'}
              secureTextEntry={true} // 비밀번호 타입으로 변경
              //onChangeText={value => updateInput('password', value)}
              autoCapitalize="none"
              returnKeyType="next"
              // onSubmitEditing={() =>
              //   passwordInputRef.current && passwordInputRef.current.focus()
              // }
              value={password}
              onChange={onChangePassword}
              underlineColorAndroid="#f000"
              blurOnSubmit={false}
            />
            {/* {confirmPassword()}
              {formHasErrors()} */}
            <TextInput
              style={styles.textFormTop}
              placeholder={'비밀번호 확인'}
              secureTextEntry={true} // 비밀번호 타입으로 변경
              //onChangeText={(userPassword) => setUserId(userPassword)}
              autoCapitalize="none"
              returnKeyType="next"
              // onSubmitEditing={() =>
              //   passwordInputRef.current && passwordInputRef.current.focus()
              // }
              value={confirmPassword}
              onChange={onChangePasswordConfirm}
              underlineColorAndroid="#f000"
              blurOnSubmit={false}
            />
          </View>
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.button} onPress={register}>
              <Text style={styles.buttonText}>회원가입</Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  smallContainer: {
    backgroundColor: '#E2F6CA',
    alignItems: 'center',
    justifyContent: 'center',
    width: wp('75%'), // 스크린 가로 크기 100%
    height: hp('70%'), // 스크린 세로 크기 70%
    borderRadius: wp('6%'),
    padding: -10,
  },
  Text: {
    bottom: 100,
    color: 'black',
    fontSize: hp('7%'),
    fontWeight: 'bold',
    marginTop: hp('20%'),
  },
  fixToInput: {
    flex: 1,
    flexDirection: 'col',
    justifyContent: 'space-between',
    marginTop: hp('2%'),
    padding: hp('2%'),
  },
  buttonContainer: {
    flex: 0.5,
    flexDirection: 'col',
    marginTop: hp('10%'),
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
