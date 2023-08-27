import axios from 'axios';
import jwtDecode from 'jwt-decode';
import AsyncStorage from '@react-native-async-storage/async-storage';

const authClient = axios.create({
  baseURL: 'http://15.164.50.203:3000',
  headers: {
    'Content-Type': 'application/json',
  },
});

// 새 토큰 발급
const getNewToken = async () => {
  const access = await AsyncStorage.getItem('accessToken');
  const refresh = await AsyncStorage.getItem('refreshToken');
  try {
    const res = await axios({
      method: 'post',
      url: `http://15.164.50.203:3000/signin/refresh`,
      data: {
        refreshToken: refresh,
      },
    });
    // response data가 accessToken만 날라옴
    await AsyncStorage.removeItem('accessToken');
    //await AsyncStorage.removeItem('refreshToken');
    await AsyncStorage.setItem('accessToken', res.data.accessToken);
    //await AsyncStorage.setItem('refreshToken', res.data.refreshToken);
    console.log(res.data);
    return res.data.accessToken;
  } catch (error) {
    console.log(error);
  }
};

// axios 요청 전 수행할 작업
authClient.interceptors.request.use(async function (config) {
  // 현재 토큰 가져오기
  let token = await AsyncStorage.getItem('accessToken');
  console.log(token);
  try {
    const exp = jwtDecode(token);
    // 토큰 만료여부 확인
    if (Date.now() / 1000 > exp.exp) {
      console.log('만료된 토큰', token);
      getNewToken().then(newToken => {
        console.log('새 토큰', newToken);
        config.headers['Authorization'] = `Bearer ${newToken}`;
      });
    } else {
      console.log('토큰이 아직 만료 안됐어요!');
      config.headers['Authorization'] = `Bearer ${token}`;
    }
  } catch (e) {
    console.log(e);
  }
  return config;
});

export default authClient;
