import React from 'react';

import LandingPage from './src/screens/LandingPage';
import LoginPage from './src/screens/LoginPage';
import MemberMainPage from './src/screens/MemberMainPage'; //로그인시 메인페이지
import CounsellingPage from './src/screens/CounsellingRe'; //상담페이지
import QuizPage from './src/screens/QuizPage_test'; //퀴즈 페이지
import QuizMainPage from './src/screens/QuizMainPage'; //퀴즈 메인 화면
import RegisterPage from './src/screens/RegisterPage'; //회원가입
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
// import sttsPage from './src/STTS';

const Stack = createNativeStackNavigator();
const App = () => {
  return (
    <NavigationContainer>
      {
        <Stack.Navigator>
          {/* 초기화면 */}
          <Stack.Screen
            name="LandingPage"
            component={LandingPage}
            options={{
              title: '',
              headerBackTitleVisible: false,
              headerBackImage: 'BackBtn',
              headerShown: false,
            }}
          />
          {/* 로그인 화면 */}
          <Stack.Screen
            name="LoginPage"
            component={LoginPage}
            options={{
              title: '',
              headerBackTitleVisible: false,
              headerBackImage: 'BackBtn',
              headerShown: true,
              headerStyle: {
                backgroundColor: '#f3e99f',
              },
            }}
          />
          {/* 회원가입 페이지 */}
          <Stack.Screen
            name="Register"
            component={RegisterPage}
            options={{
              title: '',
              headerBackTitleVisible: false,
              headerBackImage: 'BackBtn',
              headerShown: true,
              headerStyle: {
                backgroundColor: '#f3e99f',
              },
            }}
          />
          {/* 로그인 시 멤버메인페이지 */}
          <Stack.Screen
            name="MemberMainPage"
            component={MemberMainPage}
            options={{
              title: '',
              headerBackTitleVisible: false,
              headerBackImage: 'BackBtn',
              headerStyle: {
                backgroundColor: '#ffffff',
              },
            }}
          />
          {/* 상담페이지 */}
          <Stack.Screen
            name="CounsellingPage"
            component={CounsellingPage}
            options={{
              title: '',
              headerBackTitleVisible: false,
              headerBackImage: 'BackBtn',
              headerStyle: {
                backgroundColor: '#f3e99f',
              },
            }}
          />
          {/* 퀴즈 첫 시작페이지 */}
          <Stack.Screen
            name="Quiz"
            component={QuizPage}
            options={{
              title: '',
              headerBackTitleVisible: false,
              headerBackImage: 'BackBtn',
              headerStyle: {
                backgroundColor: '#f3e99f',
              },
            }}
          />
          {/* 퀴즈 게임 화면 */}
          <Stack.Screen
            name="QuizStart"
            component={QuizMainPage}
            options={{
              title: '',
              headerBackTitleVisible: false,
              headerBackImage: 'BackBtn',
              headerStyle: {
                backgroundColor: '#f3e99f',
              },
            }}
          />
          {/* 스무고개 페이지 */}
          {/* 끝말잇기 페에지 */}
        </Stack.Navigator>
      }
    </NavigationContainer>
  );
};

export default App;
