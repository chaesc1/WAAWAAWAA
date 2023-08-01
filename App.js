import React from 'react';

import LandingPage from './src/LandingPage';
import LoginPage from './src/LoginPage';
import MemberMainPage from './src/MemberMainPage'; //로그인시 메인페이지
import CounsellingPage from './src/CounsellingPage'; //상담페이지
import QuizPage from './src/QuizPage'; //퀴즈 페이지
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

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
          {/* 로그인 시 멤버메인페이지 */}
          <Stack.Screen
            name="MemberMainPage"
            component={MemberMainPage}
            options={{
              title: '',
              headerBackTitleVisible: false,
              headerBackImage: 'BackBtn',
              headerStyle: {
                backgroundColor: '#f3e99f',
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
          {/* 퀴즈 페이지 */}
          {/* 스무고개 페이지 */}
          {/* 끝말잇기 페에지 */}
        </Stack.Navigator>
      }
    </NavigationContainer>
  );
};

export default App;
