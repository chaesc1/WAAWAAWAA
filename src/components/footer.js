// 하단바 컴포넌트
import React, { useEffect, useState }from 'react';
import { useNavigation } from '@react-navigation/native';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import isTokenAvailable from '../utils/isTokenAvailable';

const Footer = ({}) => {
  const navigation = useNavigation();
  const [tokenAvailable, setTokenAvailable] = useState(false); // 토큰 존재 여부를 상태로 관리.

  const handleLogout = async () => {
    const userId =  AsyncStorage.getItem('userId');
    // 로그아웃
    await AsyncStorage.clear();
    // console.log("로그아웃 후:"+userId);
    //setTokenAvailable(false); // 로그아웃 시 토큰 상태를 false로 설정
    navigation.navigate('LandingPage'); // 로그인 화면으로 이동
  };

  // useEffect(() => {
  //   isTokenAvailable().then((result) => {
  //     setTokenAvailable(result);
  //   })
  // }, []);


  // if (!tokenAvailable) {
  //   console.log("tokenavailable값:",tokenAvailable)
  //   console.log('error!!!!!!!!!!')
  //   return null;
  // }

  return (
    <View style={styles.container}>
      <TouchableOpacity
      onPress={() => navigation.navigate('MyPage')}
      >
        <Text style={styles.tabBarButton}>마이페이지</Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => navigation.navigate('MemberMainPage')}
      >
        <Text style={styles.tabBarButton}>메인메뉴</Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={handleLogout}
      >
        <Text style={styles.tabBarButton}>로그아웃</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: 'lightgray', // 하단 탭 바 배경색
    height: 60, // 하단 탭 바 높이
    width: '100%',
  },
  tabBarButton: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default Footer;
