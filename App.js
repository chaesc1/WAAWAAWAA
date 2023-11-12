import React, {useEffect, useState} from 'react';
import OnboardingPage from './src/screens/OnboardingPage';
import MemberMainPage from './src/screens/MemberMainPage'; //로그인시 메인페이지
import CounsellingPage from './src/screens/CounsellingPage'; //상담페이지
import QuizPage from './src/screens/QuizPage'; //퀴즈 페이지
import ConnectEndingPage from './src/screens/ConnectEnding'; //끝말잇기
import DrawingPage from './src/screens/DrawingPage';
import StaticsPage from './src/screens/StaticsPage'; // 통계 페이지
import ForgetPassword from './src/screens/ForgetPassword'; // 비밀번호 잊으셨나요 페이지
import MyPage from './src/screens/MyPage';
import newLogin from './src/screens/LoginPage';
import newRegister from './src/screens/RegisterPage';
import RankingPage from './src/screens/RankingPage';
import MemoryGame from './src/screens/MemoryGame';

// //tailwind
// import tw from 'twrnc';
// import {config, GluestackUIProvider, Text} from '@gluestack-ui/themed';
// import isTokenAvailable from './src/utils/isTokenAvailable';

// import sttsPage from './src/STTS';
//import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import StoryPage from './src/screens/StoryPage';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Onbording">
        {/* 초기화면 */}
        <Stack.Screen
          name="Onboarding"
          options={{headerShown: false}}
          component={OnboardingPage}
        />
        {/* 로그인 화면 */}
        <Stack.Screen
          name="LoginPage"
          component={newLogin}
          options={{
            title: '',
            headerBackTitleVisible: false,
            headerBackImage: 'BackBtn',
            headerShown: false,
            headerStyle: {
              backgroundColor: '#FAF1E4',
            },
          }}
        />
        {/* 비밀번호를 잊으셨나요 화면 */}
        <Stack.Screen
          name="ForgetPassword"
          component={ForgetPassword}
          options={{
            title: '',
            headerBackTitleVisible: false,
            headerBackImage: 'BackBtn',
            headerShown: false,
            headerStyle: {
              backgroundColor: '#FAF1E4',
            },
          }}
        />
        {/* 회원가입 페이지 */}
        <Stack.Screen
          name="Register"
          component={newRegister}
          options={{
            title: '',
            headerBackTitleVisible: false,
            headerBackImage: 'BackBtn',
            headerShown: false,
            headerStyle: {
              backgroundColor: '#FAF1E4',
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
            headerShown: false,
            headerStyle: {
              backgroundColor: '#FAF1E4',
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
            headerShown: false,
            headerBackImage: 'BackBtn',
            headerStyle: {
              backgroundColor: '#FFFFFF',
            },
          }}
        />
        {/* 이야기 페이지 */}
        <Stack.Screen
          name="StoryPage"
          component={StoryPage}
          options={{
            title: '',
            headerBackTitleVisible: false,
            headerShown: false,
            headerBackImage: 'BackBtn',
            headerStyle: {
              backgroundColor: '#FFFFFF',
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
            headerShown: false,
            headerBackImage: 'BackBtn',
            headerStyle: {
              backgroundColor: '#FFFFFF',
            },
          }}
        />
        {/* 끝말잇기 페에지 */}
        <Stack.Screen
          name="ConnectStart"
          component={ConnectEndingPage}
          options={{
            title: '',
            headerBackTitleVisible: false,
            headerBackImage: 'BackBtn',
            headerShown: false,
            headerStyle: {
              backgroundColor: '#FFFFFF',
            },
          }}
        />
        {/* 그림그리기 페이지 */}
        <Stack.Screen
          name="Drawing"
          component={DrawingPage}
          options={{
            title: '',
            headerBackTitleVisible: false,
            headerShown: false,
            headerBackImage: 'BackBtn',
            headerStyle: {
              backgroundColor: '#FAF1E4',
            },
          }}
        />
        {/* 통계 페이지*/}
        <Stack.Screen
          name="StaticsPage"
          component={StaticsPage}
          options={{
            headerShown: false,
            title: '',
            headerBackTitleVisible: false,
            headerBackImage: 'BackBtn',
            headerStyle: {
              backgroundColor: '#FAF1E4',
            },
          }}
        />
        {/*마이 페이지*/}
        <Stack.Screen
          name="MyPage"
          component={MyPage}
          options={{
            title: '',
            headerBackTitleVisible: false,
            headerShown: false,
            headerBackImage: 'BackBtn',
            headerStyle: {
              backgroundColor: '#FAF1E4',
            },
          }}
        />
        {/*랭킹 페이지*/}
        <Stack.Screen
          name="RankingPage"
          component={RankingPage}
          options={{
            title: '',
            headerBackTitleVisible: false,
            headerShown: false,
            headerBackImage: 'BackBtn',
            headerStyle: {
              backgroundColor: '#FAF1E4',
            },
          }}
        />
        {/*기억력게임 페이지*/}
        <Stack.Screen
          name="MemoryGame"
          component={MemoryGame}
          options={{
            title: '',
            headerBackTitleVisible: false,
            headerShown: false,
            headerBackImage: 'BackBtn',
            headerStyle: {
              backgroundColor: '#FAF1E4',
            },
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
