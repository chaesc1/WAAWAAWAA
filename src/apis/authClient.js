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
    const res = await authClient.post('/signin/refresh', {
      accessToken: access,
      refreshToken: refresh,
    });
    await AsyncStorage.removeItem('accessToken');
    await AsyncStorage.setItem('accessToken', res.data.accessToken);
    return res.data.accessToken;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

authClient.interceptors.request.use(async function (config) {
  let token = await AsyncStorage.getItem('accessToken');
  const exp = jwtDecode(token);

  if (Date.now() / 1000 > exp.exp) {
    try {
      const newToken = await getNewToken();
      config.headers['Authorization'] = `Bearer ${newToken}`;
    } catch (error) {
      console.log('Token refresh failed:', error);
    }
  } else {
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  return config;
});

export default authClient;
