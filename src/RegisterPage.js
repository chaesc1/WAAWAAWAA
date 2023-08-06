import React, {useState, useEffect} from 'react';
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
import {StatusBar} from 'expo-status-bar';

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

export default function RegisterPage({navigation}) {
  // const [type, setType] = useState('로그인'); // 로그인 / 등록
  // const [action, setAction] = useState('로그인'); // 로그인 / 등록
  // const [actionMode, setActionMode] = useState('회원가입'); // 회원가입 / 로그인 화면으
  //   const [hasErrors, setHasErrors] = useState(false);

  //   const [form, setForm] = useState({
  //     email: {
  //       value: '',
  //       type: 'textInput',
  //       rules: {
  //         isRequired: true,
  //         isEmail: true,
  //       },
  //       valid: false,
  //     },
  //     password: {
  //       value: '',
  //       type: 'textInput',
  //       rules: {
  //         isRequired: true,
  //         minLength: 6,
  //       },
  //       valid: false,
  //     },
  //     confirmPassword: {
  //       value: '',
  //       type: 'textInput',
  //       rules: {
  //         confirmPassword: 'password',
  //       },
  //       valid: false,
  //     },
  //   });

  //   updateInput = (name, value) => {
  //     setHasErrors(false);
  //     let formCopy = form;
  //     formCopy[name].value = value;
  //     let rules = formCopy[name].rules;
  //     let valid = validationRules(value, rules, formCopy);
  //     formCopy[name].valid = valid;
  //     setForm(form => {
  //       return {...formCopy};
  //     });
  //   };

  //   confirmPassword = () => {
  //     return type != '로그인' ? (
  //       <Input
  //         value={form.confirmPassword.value}
  //         type={form.confirmPassword.type}
  //         secureTextEntry={true}
  //         placeholder="비밀번호 재입력"
  //         placeholderTextColor={'#ddd'}
  //         onChangeText={value => updateInput('confirmPassword', value)}
  //       />
  //     ) : null;
  //   };

  //   formHasErrors = () => {
  //   return hasErrors ? (
  //     <View style={styles.errorContainer}>
  //       <Text style={styles.errorLabel}>
  //         앗! 로그인 정보를 다시 확인해주세요~
  //       </Text>
  //     </View>
  //   ) : null;
  // };

  // changeForm = () => {
  //   type === '로그인'
  //     ? (setType('등록'), setAction('등록'), setActionMode('로그인 화면으로'))
  //     : (setType('로그인'), setAction('로그인'), setActionMode('회원가입'));
  // };

  // submitUser = () => {
  //   //Init.
  //   let isFormValid = true;
  //   let submittedForm = {};
  //   const formCopy = form;

  //   for (let key in formCopy) {
  //     if (type === '로그인') {
  //       if (key !== 'confirmPassword') {
  //         isFormValid = isFormValid && formCopy[key].valid;
  //         submittedForm[key] = formCopy[key].value;
  //       }
  //     } else {
  //       isFormValid = isFormValid && formCopy[key].valid;
  //       submittedForm[key] = formCopy[key].value;
  //     }
  //   }

  //   if (isFormValid) {
  //     if (type === '로그인') {
  //       console.log('로그인: ');
  //       for (let key in submittedForm) {
  //         console.log(submittedForm[key]);
  //       }
  //     } else {
  //       console.log('회원가입: ');
  //       for (let key in submittedForm) {
  //         console.log(submittedForm[key]);
  //       }
  //     }
  //   } else {
  //     setHasErrors(true);
  //   }
  // };
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
              autoCapitalize="none"
              returnKeyType="next"
              onSubmitEditing={() =>
                passwordInputRef.current && passwordInputRef.current.focus()
              }
              underlineColorAndroid="#f000"
              blurOnSubmit={false}
            />
            <TextInput
              style={styles.textFormTop}
              placeholder={'이메일 주소'}
              //onChangeText={value => updateInput('email', value)}
              autoCapitalize="none"
              returnKeyType="next"
              onSubmitEditing={() =>
                passwordInputRef.current && passwordInputRef.current.focus()
              }
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
              underlineColorAndroid="#f000"
              blurOnSubmit={false}
            />
          </View>
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.button}
              onPress={() => navigation.navigate('Login')}>
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
