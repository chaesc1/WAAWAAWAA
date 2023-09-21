import AsyncStorage from '@react-native-async-storage/async-storage';

const isTokenAvailable = async () => {
  try {
    const token = await AsyncStorage.getItem('accessToken'); // 토큰 키를 사용하여 AsyncStorage에서 토큰을 가져옴
    // console.log("accesstoken이다다다:",token);
    // console.log(!!token);
    return !!token; // 토큰이 존재하면 true를 반환, 없으면 false 반환
    
  } catch (error) {
    console.error('토큰 확인 중 에러:', error);
    return false; // 에러 발생 시 false 반환
  }
};

export default isTokenAvailable;
