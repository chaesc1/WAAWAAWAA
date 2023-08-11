import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  TextInput,
  ScrollView,
} from 'react-native';

const MyPage = ({navigation}) => {
  const [selectedMenu, setSelectedMenu] = useState(null);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const toggleAccordion = menuIndex => {
    if (selectedMenu === menuIndex) {
      setSelectedMenu(null);
    } else {
      setSelectedMenu(menuIndex);
    }
  };

  const handlePasswordChange = () => {
    if (password === confirmPassword) {
      // Perform password change logic here
      navigation.navigate('LandingPage'); // Navigate to LandingPage after password change
    } else {
      // Show an error message or handle mismatched passwords
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.profileContainer}>
        <Image source={require('../assets/gold.png')} style={styles.avatar} />
        <Text style={styles.username}>시후</Text>
        <Text style={styles.age}>나이: 7</Text>
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
              placeholder="New Password"
              value={password}
              onChangeText={text => setPassword(text)}
              secureTextEntry
            />
            <TextInput
              style={styles.input}
              placeholder="Confirm Password"
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
            <Text>Age Settings Form</Text>
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
            <Text>Nickname Change Form</Text>
          </View>
        )}
      </View>
      {/* </ScrollView> */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start', // Align profile section to the top
    padding: 20,
    backgroundColor: '#F3E99F',
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
    backgroundColor: '#FDFBEC',
    paddingVertical: 10,
    paddingHorizontal: 20,
    alignItems: 'center',
    marginBottom: 10,
  },
  menuText: {
    fontSize: 18,
  },
  accordionContent: {
    borderTopWidth: 1,
    borderTopColor: 'gray',
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: '#FFE2DF',
  },
  input: {
    borderWidth: 1,
    borderColor: 'gray',
    padding: 10,
    marginBottom: 10,
  },
  confirmButton: {
    backgroundColor: 'blue',
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
