import React, {useEffect, useState} from 'react';
import LandingPage from './src/screens/LandingPage';
import LoginPage from './src/screens/LoginPage';
import MemberMainPage from './src/screens/MemberMainPage'; //로그인시 메인페이지
import CounsellingPage from './src/screens/CounsellingRe'; //상담페이지
import QuizPage from './src/screens/QuizPage_test'; //퀴즈 페이지
import QuizMainPage from './src/screens/QuizMainPage'; //퀴즈 메인 화면
import RegisterPage from './src/screens/RegisterPage'; //회원가입
import ConnectEndingPage from './src/screens/ConnectEnding'; //끝말잇기
import TwentyQuestionPage from './src/screens/TwentyQuestion'; // 스무고개 페이지
import MyPage from './src/screens/MyPage';
import Footer from './src/components/footer'; // 하단바
import QuizPage2 from './src/screens/QuizPage';

//tailwind
import tw from 'twrnc';
import {config, GluestackUIProvider, Text} from '@gluestack-ui/themed';
import isTokenAvailable from './src/utils/isTokenAvailable';

// import sttsPage from './src/STTS';
//import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import StoryPage from './src/screens/StoryPage';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();
//const Tab = createBottomTabNavigator();

const App = () => {
  // const [loggedIn, setLoggedIn] = useState(false);
  // const userId =  AsyncStorage.getItem('userId');
  // console.log(userId);
  // const checkLoginStatus = async () => {
  //   try {
  //     if (userId != null) {
  //       setLoggedIn(true);
  //     } else {
  //       console.log('에러에러');
  //       setLoggedIn(false);
  //     }
  //   } catch (error) {
  //     console.error('Error reading userId from AsyncStorage:', error);
  //   }
  // };
  // console.log("현재 loggedIn 상태:"+loggedIn)

  // useEffect(() => {
  //   checkLoginStatus();
  // }, [userId]);

  return (
    <NavigationContainer>
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
              backgroundColor: '#FFFFFF',
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
              backgroundColor: '#FFFFFF',
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
            headerBackImage: 'BackBtn',
            headerStyle: {
              backgroundColor: '#FFFFFF',
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
              backgroundColor: '#FFFFFF',
            },
          }}
        />
        {/* 스무고개 페이지 */}
        <Stack.Screen
          name="TwentyQuestion"
          component={TwentyQuestionPage}
          options={{
            title: '',
            headerBackTitleVisible: false,
            headerBackImage: 'BackBtn',
            headerStyle: {
              backgroundColor: '#FFFFFF',
            },
          }}
        />
        {/* 끝말잇기 페에지 */}
        {/*마이 페이지*/}
        <Stack.Screen name="MyPage" component={MyPage} />
        <Stack.Screen
          name="ConnectStart"
          component={ConnectEndingPage}
          options={{
            title: '',
            headerBackTitleVisible: false,
            headerBackImage: 'BackBtn',
            headerStyle: {
              backgroundColor: '#FFFFFF',
            },
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
