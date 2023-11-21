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
import Lottie from 'lottie-react-native';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import {ArrowLeftIcon} from 'react-native-heroicons/solid';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
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

  // 비밀번호 변경가능 유효성 검사
  const isPasswordValid = password => {
    const passwordRegex =
      /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return passwordRegex.test(password);
  };

  // 비밀번호 변경 -> 숫자, 영문자, 특수문자 조합으로 8자리 이상 안되면 fail
  const handlePasswordChange = async () => {
    console.log('비밀번호 변경 시도:', password);
    if (password === confirmPassword) {
      if (isPasswordValid(password)) {
        // 비밀번호 유효성 검사
        try {
          await authClient({
            method: 'put',
            url: '/users/password',
            data: {
              password: password,
            },
          });

          Alert.alert('비밀번호가 성공적으로 변경되었어! 다시 로그인을 해줘');

          // 로그아웃 및 로그인 페이지로 이동
          await logout();
        } catch (error) {
          console.log(error.response.data);
        }
      } else {
        Alert.alert(
          '비밀번호는 숫자, 특수문자, 영어를 포함하고 8자리 이상이어야해.',
        );
      }
    } else {
      Alert.alert('비밀번호가 일치하지않아. 다시 확인해줘!');
    }
  };

  // 로그아웃
  const logout = async () => {
    try {
      // AsyncStorage를 clear
      await AsyncStorage.clear();

      // LandingPage로 navigate
      navigation.navigate('LandingPage');
      console.log('로그아웃 되었어!');
    } catch (error) {
      console.error('로그아웃 오류:', error);
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
          username: nickname,
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

  // 로그아웃
  const handleLogout = async () => {
    const userId = AsyncStorage.getItem('userId');
    await AsyncStorage.clear();
    navigation.navigate('Onboarding');
  };

  // 회원탈퇴
  const handleWithdraw = async () => {
    // 회원탈퇴 다이얼로그 추가
    Alert.alert(
      '회원 탈퇴 확인',
      '정말로 회원을 탈퇴하시겠습니까?',
      [
        {
          text: '예',
          onPress: async () => {
            try {
              const res = await authClient({
                method: 'delete',
                url: '/users',
              });
              // LandingPage로 navigate
              navigation.navigate('LandingPage');
              await AsyncStorage.clear();
              Alert.alert('회원 탈퇴되었습니다.');
            } catch (error) {
              console.log(error);
            }
          },
        },
        {
          text: '아니요',
          style: 'cancel',
        },
      ],
      {cancelable: false},
    );
  };

  return (
    <ScrollView style={styles.scrollViewContainer}>
      <Image
        source={require('../../assets/images/simple.jpg')}
        style={styles.backgroundImage}
      />
      <View style={styles.container}>
        <View style={styles.backButtonContainer}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backButton}>
            <ArrowLeftIcon size={wp('6%')} color="white" />
          </TouchableOpacity>
          <Text style={styles.pageTitle}>마이페이지</Text>
        </View>
        <View style={styles.profileContainer}>
          <Lottie
            source={require('../../assets/animations/newBear.json')}
            style={styles.image}
            autoPlay
            loop
          />
          <View style={styles.profileInfoContainer}>
            <Text style={styles.username}>{user ? user.username : '이름'}</Text>
            <Text style={styles.age}>
              {user ? `나이: ${user.age}살` : '나이: ?'}
            </Text>
          </View>
        </View>
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
                placeholder="숫자, 영문자, 특수문자 조합으로 8자리이상"
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
            onPress={() => toggleAccordion(2)}>
            <Text style={styles.menuText}>나이 재설정</Text>
          </TouchableOpacity>
          {selectedMenu === 2 && (
            <View style={styles.accordionContent}>
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
            </View>
          )}

          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => navigation.navigate('StaticsPage')}>
            <FontAwesome5 name="chart-line" style={styles.graphIcon} />
            <View style={styles.statButtonContent}>
              <Text style={styles.statButtonTitle}>상담 통계 페이지 </Text>

              <Text style={styles.statButtonDescription}>
                {user ? user.username : '이름'}이가 대화한 내용들을 알고싶다면?
                접속해봐!
              </Text>
            </View>
            </TouchableOpacity>
          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => navigation.navigate('RankingPage')}>
            <View style={styles.statButtonContent}>
              <Text style={styles.statButtonTitle}>🥇랭킹 페이지 </Text>

              <Text style={styles.statButtonDescription}>
                {user ? user.username : '이름'}의 랭킹을 알고싶다면?
                접속해봐!
              </Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.withdrawLogoutButton}
            onPress={() =>
              Alert.alert(
                '로그아웃 확인',
                '정말로 로그아웃 하시겠습니까?',
                [
                  {
                    text: '예',
                    onPress: () => handleLogout,
                  },
                  {
                    text: '아니요',
                    style: 'cancel',
                  },
                ],
                {cancelable: false},
              )
            }>
            <Text style={styles.withdrawButtonText}>로그아웃</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.withdrawButton}
            onPress={handleWithdraw}>
            <Text style={styles.withdrawButtonText}>회원탈퇴</Text>
          </TouchableOpacity>
        </View>
        {/* </ScrollView> */}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollViewContainer: {
    backgroundColor: '#D8E4E5',
  },
  container: {
    position: 'relative',
    flex: 1,
    padding: 20,
  },
  backgroundImage: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    zIndex: -1,
  },
  backButtonContainer: {
    alignItems: 'center',
    justifyContent: 'flex-start',
    width: wp(10),
    marginTop: wp(6.4),
    right: wp(3),
    flexDirection: 'row',
    gap: 20,
  },
  pageTitle: {
    width: wp('50%'),
    fontSize: wp('6%'),
    fontWeight: 'bold',
  },
  backButton: {
    backgroundColor: '#1E2B22',
    padding: wp('1%'),
    borderTopRightRadius: wp('5%'),
    borderBottomLeftRadius: wp('5%'),
    marginLeft: wp('2%'),
  },
  profileContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 20,
    marginTop: hp(3),
  },

  profileInfoContainer: {
    flex: 1,
    marginLeft: 20,
  },

  image: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'pink',
    marginRight: 20,
  },

  username: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 10,
  },

  age: {
    fontSize: 16,
    color: '#000',
  },

  menuItem: {
    backgroundColor: '#fff',
    paddingVertical: 10,
    paddingHorizontal: 20,
    alignItems: 'center',
    marginBottom: 15,
    borderRadius: 20,
  },

  accordionContent: {
    paddingTop: 15,
    paddingBottom: 20,
    paddingHorizontal: 20,
    marginBottom: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },

  input: {
    borderWidth: 1,
    borderColor: 'transparent',
    padding: 10,
    marginBottom: 10,
  },

  menuContainer: {
    alignSelf: 'stretch',
  },

  confirmButton: {
    backgroundColor: '#AECEE0',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    alignItems: 'center',
  },

  confirmButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },

  button: {
    backgroundColor: '#CBFFA9',
    paddingVertical: 10,
    paddingHorizontal: 20,
    alignItems: 'center',
    marginBottom: 10,
    borderRadius: 14,
  },

  withdrawButton: {
    width: '100%',
    marginBottom: 10,
    backgroundColor: '#84BFE0',
    paddingVertical: 15,
    paddingHorizontal: 20,
    alignSelf: 'center',
    alignItems: 'center',
    borderRadius: 14,
  },
  withdrawLogoutButton: {
    width: '100%',
    marginBottom: 10,
    backgroundColor: '#FF6C6C',
    paddingVertical: 15,
    paddingHorizontal: 20,
    alignSelf: 'center',
    alignItems: 'center',
    borderRadius: 14,
  },
  withdrawButtonText: {
    color: 'white',
    fontSize: 14,

    fontWeight: 'bold',
  },

  graphIcon: {
    fontSize: 24,
    color: '#AECEE0',
    marginRight: 10,
  },
  statButtonContent: {
    flexDirection: 'column',
  },
  statButtonTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
  },
  statButtonDescription: {
    fontSize: 14,
    color: '#666',
  },
});

export default MyPage;