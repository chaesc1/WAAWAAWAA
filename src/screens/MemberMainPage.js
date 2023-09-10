import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
// 반응형 비율
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import Footer from '../components/footer';

export default function MemberMainPage({navigation}) {
  return (
    <View style={styles.container}>
      {/* 퀴즈, 상담 */}
      <View style={styles.row}>
        {/* 퀴즈 */}
        <View style={styles.column}>
          <TouchableOpacity onPress={() => navigation.navigate('Quiz')}>
            <View style={styles.additionalContent} />
            <View style={styles.Button}>
              <Text style={styles.Text}>수다</Text>
            </View>
          </TouchableOpacity>
        </View>
        {/* 상담 */}
        <View style={styles.column}>
          <TouchableOpacity
            onPress={() => navigation.navigate('CounsellingPage')}>
            <View style={styles.Button}>
              <Text style={styles.Text}>상담</Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.row}>
        <View style={styles.column}>
          <TouchableOpacity onPress={() => navigation.navigate('StoryPage')}>
            <View style={styles.Button}>
              <Text style={styles.Text}>이야기 말하기</Text>
            </View>
          </TouchableOpacity>
        </View>
        <View style={styles.column}>
          <TouchableOpacity onPress={() => navigation.navigate('ConnectStart')}>
            <View style={styles.Button}>
              <Text style={styles.Text}>끝말잇기</Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
      <Footer/>
    </View>
    
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3E99F',
    alignItems: 'center',
    justifyContent: 'center',
  },
  row: {
    flex: 1,
    flexDirection: 'row',
  },
  column: {
    flex: 1,
    borderWidth: 0,
    borderColor: 'black',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F3E99F',
  },
  wrapping: {
    width: wp('30%'),
    height: hp('30%'),
    justifyContent: 'center', // 수평 방향으로 중앙 정렬
    alignItems: 'center', // 수직 방향으로 중앙 정렬
    backgroundColor: '#F3E99F',
    borderRadius: 10,
  },
  Button: {
    width: wp('40%'),
    height: hp('30%'),
    justifyContent: 'center', // 수평 방향으로 중앙 정렬
    alignItems: 'center', // 수직 방향으로 중앙 정렬
    backgroundColor: '#FF6D60',
    borderRadius: 20,
    borderWidth: 30,
    borderColor: '#FDFBEC',
  },
  Text: {
    fontWeight: '600',
    color: 'white',
    fontSize: 20,
    borderRadius: 20,
  },
});
