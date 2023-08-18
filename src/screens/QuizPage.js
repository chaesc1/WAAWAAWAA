import React, {useState} from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import Voice from '@react-native-voice/voice';

export default function QuizPage({navigation}) {
  // const [searchText, setSearchText] = useState('');

  // const handleSearchChange = (text) => {
  //   setSearchText(text);
  // };

  // const handleSearchSubmit = () => {
  //   // 검색 동작을 수행하는 함수 또는 로직을 여기에 작성합니다.
  //   console.log('검색어:', searchText);
  //   // 예: 데이터를 가져오거나 검색 결과를 업데이트하는 등의 동작 수행
  // };
  const [searchText, setSearchText] = useState(''); // searchText 상태 변수 초기화
  const [result, setResult] = useState('');
  const [error, setError] = useState('');
  const [isRecording, setIsRecording] = useState(false);

  Voice.onSpeechStart = () => setIsRecording(true);
  Voice.onSpeechEnd = () => setIsRecording(false);
  // Voice.onSpeechError = err => setError(err.error);
  Voice.onSpeechError = err =>
    setError(`${err.error.code}: ${err.error.message}`);
  Voice.onSpeechResults = result => {
    setResult(result.value[0]);
    // const recognizedText = result.value[0];
    // setResult(recognizedText); // 옵션: 필요에 따라 음성인식 결과를 보여주기 위해 result 상태를 유지할 수 있습니다
    // setSearchText(recognizedText); // 음성인식 결과로 searchText 상태를 업데이트합니다
  };

  const startRecording = async () => {
    try {
      await Voice.start('ko-KR');
    } catch (err) {
      console.error('녹음 시작 오류:', err);
      setError(err.message);
    }
  };

  const stopRecording = async () => {
    try {
      await Voice.stop();
    } catch (error) {
      console.error('녹음 종료 오류:', error);
      setError(error.message);
    }
  };

  return (
    // 음성인식 테스트 코드
    // <View>
    //   <Text style={{fontSize: 30, color: 'green', fontWeight: '500'}}>
    //     Voice Input
    //   </Text>
    //   <Text>{result}</Text>
    //   <Text>{error}</Text>

    //   <TouchableOpacity
    //     style={{marginTop: 30}}
    //     onPress={isRecording ? stopRecording : startRecording}>
    //     <Text style={{color: 'red'}}>
    //       {isRecording ? 'Stop Recording' : 'Start Recording'}
    //     </Text>
    //   </TouchableOpacity>
    // </View>
    <View style={styles.container}>
      {/* 바깥의 네모모양 창 */}
      <View style={styles.square}>
        <Text style={styles.mainText}></Text>
        {/* 내부의 또 다른 네모모양 창 */}
        <View style={styles.innerSquare}>
          {/* 내부의 또 다른 네모모양 창의 내부 */}
          <View style={styles.innerInnerSquare}>
            <Text style={styles.text}>주제를 선택해주세요</Text>
          </View>
          {/* 검색창 */}
          <TextInput
            style={styles.searchInput}
            placeholder="주제를 입력하세요"
            value={result}
            onChangeText={text => setResult(text)}
          />
          {/* sound 사진 마이크 아이콘 클릭시 음성인식 -> textinput 으로*/}
          <TouchableOpacity style={styles.soundPicture}>
            <Icon
              name={isRecording ? 'mic-off' : 'mic'}
              size={30}
              style={{marginRight: 15}}
              onPress={isRecording ? stopRecording : startRecording} // 마이크 버튼 누를 때 음성 인식 시작 또는 종료
            />
          </TouchableOpacity>

          {/* 확인 버튼 */}
          <TouchableOpacity
            style={styles.startButton}
            onPress={() => navigation.navigate('QuizStart')}>
            <Text style={styles.buttonText}>확인</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F3E99F', // 바깥 배경색 변경
  },
  square: {
    width: 560,
    height: 600,
    backgroundColor: '#FFF9DE',
    justifyContent: 'flex-start', // 세로 방향으로 위쪽으로 정렬
    alignItems: 'center',
    marginBottom: 20,
  },
  innerSquare: {
    width: 480,
    height: 320,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FF6D60',
  },
  innerInnerSquare: {
    width: 300,
    height: 50,
    backgroundColor: '#EDEDED',
    marginBottom: 10,
    position: 'absolute', // 절대 위치로 설정
    top: 50, // 위에서부터 20의 거리
    left: 80, // 왼쪽에서부터 20의 거리
    justifyContent: 'center',
    alignItems: 'center',
  },
  soundPicture: {
    width: 40,
    height: 40,
    position: 'absolute',
    top: 204,
    right: 115,
  },
  mainText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 120, // 텍스트 아래 간격 조정
    marginTop: 20, // 텍스트 위 간격 조정
  },
  text: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  searchInput: {
    width: 250,
    height: 40,
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: -39,
    marginTop: 120,
    marginLeft: -100,
  },
  startButton: {
    marginLeft: 300,
    backgroundColor: '#DDDDDD',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 5,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});
