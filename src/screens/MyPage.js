import React, {useState, useEffect} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Alert,
} from 'react-native';
import Footer from '../components/footer';
import authClient from '../apis/authClient';

const MyPage = ({navigation}) => {
  const [selectedMenu, setSelectedMenu] = useState(null);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [age, setAge] = useState(null);
  const [nickname, setNickname] = useState('');
  const [user, setUser] = useState(null); // 유저 정보 상태

  useEffect(() => {
    checkUser();
  }, []);

  const toggleAccordion = menuIndex => {
    if (selectedMenu === menuIndex) {
      setSelectedMenu(null);
    } else {
      setSelectedMenu(menuIndex);
    }
  };

  // 비밀번호 변경
  const handlePasswordChange = async () => {
    console.log('비밀번호 변경 시도:', password);
    if (password === confirmPassword) {
      try {
        await authClient({
          method: 'put',
          url: '/users/password',
          data: {
            password: password,
          },
        });
      } catch (error) {
        console.log(error.response.data);
      }
    } else {
      Alert.alert('비밀번호를 다시 확인해주세요.');
    }
  };

  // 나이 변경
  const handleAgeChange = async () => {
    console.log('나이 변경 시도:', age);

    try {
      await authClient({
        method: 'put',
        url: '/users/age',
        data: {
          age: Number(age),
        },
      });
      Alert.alert('나이가 변경되었습니다.');
    } catch (error) {
      console.log(error.response.data);
    }
  };

  // 닉네임 변경
  const handleNickChange = async () => {
    console.log('닉네임 변경 시도:', nickname);
    try {
      const res = await authClient({
        method: 'put',
        url: '/users/username',
        data: {
          username: nickname, // 닉네임 값을 요청 데이터에 포함
        },
      });
    } catch (error) {
      console.log(error);
    }

    //navigation.navigate('Mypage');
    Alert.alert('닉네임이 변경되었습니다.');
  };

  // user 조회
  const checkUser = async () => {
    try {
      const res = await authClient({
        method: 'get',
        url: '/users',
      });
      console.log(res.data);
      const userData = res.data;
      setUser(userData);
    } catch (error) {
      console.log(error);
    }
  };

  // logout
  const logout = async () => {
    try {
      // AsyncStorage를 clear
      await AsyncStorage.clear();

      // LandingPage로 navigate
      navigation.navigate('LandingPage');
      console.log('로그아웃 되었음!');
    } catch (error) {
      console.error('로그아웃 오류:', error);
    }
  };

  // 회원탈퇴
  const handleWithdraw = async () => {
    try {
      const res = await authClient({
        method: 'delete',
        url: '/users',
      });
      // LandingPage로 navigate
      navigation.navigate('LandingPage');
      Alert.alert('회원탈퇴 되었습니다.');
    } catch (error) {
      console.log('회원탈퇴 실패', error);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.profileContainer}>
        <Image
          source={require('../../assets/gold.png')}
          style={styles.avatar}
        />
        <Text style={styles.username}>{user ? user.username : '이름'}</Text>
        <Text style={styles.age}>
          {user ? `나이: ${user.age}살` : '나이: ?'}
        </Text>
      </View>
      {/* <ScrollView contentContainerStyle={styles.scrollContent}> */}
      <View style={styles.menuContainer}>
        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => toggleAccordion(0)}>
          <Text style={styles.menuText}>비밀번호 변경</Text>
        </TouchableOpacity>
        {selectedMenu === 0 && (
          <View style={styles.accordionContent}>
            <TextInput
              style={styles.input}
              placeholder="변경할 비밀번호"
              value={password}
              onChangeText={text => setPassword(text)}
              secureTextEntry
            />
            <TextInput
              style={styles.input}
              placeholder="비밀번호 재확인"
              value={confirmPassword}
              onChangeText={text => setConfirmPassword(text)}
              secureTextEntry
            />
            <TouchableOpacity
              onPress={handlePasswordChange}
              style={styles.confirmButton}>
              <Text style={styles.confirmButtonText}>변경하기</Text>
            </TouchableOpacity>
          </View>
        )}
        <TouchableOpacity
          style={styles.menuItem}
          // 통계 페이지로 연결 시켜둠.
          onPress={() => navigation.navigate('StaticsPage')}>
          <Text style={styles.menuText}>통계 페이지</Text>
        </TouchableOpacity>
        {/* {selectedMenu === 1 && (
          <View style={styles.accordionContent}>
            
            <Text>Statistics Content</Text>
          </View>
        )} */}
        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => toggleAccordion(2)}>
          <Text style={styles.menuText}>나이 설정</Text>
        </TouchableOpacity>
        {selectedMenu === 2 && (
          <View style={styles.accordionContent}>
            {/* Your age settings form can go here */}
            <TextInput
              style={styles.input}
              placeholder="변경하고 싶으신 나이를 입력해주세요."
              value={age?.toString()}
              onChangeText={setAge}
            />
            <TouchableOpacity
              onPress={handleAgeChange}
              style={styles.confirmButton}>
              <Text style={styles.confirmButtonText}>변경하기</Text>
            </TouchableOpacity>
          </View>
        )}
        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => toggleAccordion(3)}>
          <Text style={styles.menuText}>닉네임 변경</Text>
        </TouchableOpacity>
        {selectedMenu === 3 && (
          <View style={styles.accordionContent}>
            {/* Your nickname change form can go here */}

            {/* Your age settings form can go here */}
            <TextInput
              style={styles.input}
              placeholder="변경하고 싶으신 닉네임을 입력해주세요."
              value={nickname}
              onChangeText={setNickname}
            />
            <TouchableOpacity
              onPress={handleNickChange}
              style={styles.confirmButton}>
              <Text style={styles.confirmButtonText}>변경하기</Text>
            </TouchableOpacity>
            {/* 추가: 비밀번호 변경 시 사용자 정보 조회 */}
          </View>
        )}

        <TouchableOpacity style={styles.button} onPress={handleWithdraw}>
          <Text style={styles.buttonText}>회원탈퇴</Text>
        </TouchableOpacity>
      </View>

      {/* </ScrollView> */}
    </View>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#CBFFA9',
    paddingVertical: 10,
    paddingHorizontal: 20,
    alignItems: 'center',
    marginBottom: 10,
    borderRadius: 14,
  },
  buttonText: {
    fontSize: 18,
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start', // Align profile section to the top
    padding: 20,
    backgroundColor: '#FFFFFF',
  },
  scrollContent: {
    flexGrow: 1, // Allow scrolling when content overflows
  },

  profileContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
  },
  username: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  age: {
    fontSize: 16,
    color: 'gray',
  },
  menuContainer: {
    alignSelf: 'stretch',
  },
  menuItem: {
    backgroundColor: '#CBFFA9',
    paddingVertical: 10,
    paddingHorizontal: 20,
    alignItems: 'center',
    marginBottom: 10,
    borderRadius: 14,
  },
  menuText: {
    fontSize: 18,
  },
  accordionContent: {
    borderTopWidth: 1,
    borderTopColor: 'gray',
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginBottom: 5,
    backgroundColor: '#B5C99A',
    shadowOpacity: 0.3,
  },
  input: {
    borderWidth: 1,
    borderColor: 'gray',
    padding: 10,
    marginBottom: 10,
  },
  confirmButton: {
    backgroundColor: '#BA704F',
    paddingVertical: 10,
    paddingHorizontal: 20,

    alignItems: 'center',
  },
  confirmButtonText: {
    color: 'white',
    fontSize: 18,
  },
});

export default MyPage;
