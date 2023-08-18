import React, {useEffect, useState} from 'react';
import {
  View,
  Image,
  Text,
  StyleSheet,
  SafeAreaView,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import Voice from '@react-native-voice/voice';
import Icon from 'react-native-vector-icons/FontAwesome5';
import QuizPage from './QuizPage';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

const QuizPage_test = ({navigation}) => {
  const [result, setResult] = useState('');
  const [isLoading, setLoading] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [recording, setRecording] = useState(false);

  useEffect(() => {
    Voice.onSpeechStart = onSpeechStartHandler;
    Voice.onSpeechEnd = onSpeechEndHandler;
    Voice.onSpeechResults = onSpeechResultsHandler;

    return () => {
      Voice.destroy().then(Voice.removeAllListeners);
    };
  }, []);

  const onSpeechStartHandler = e => {
    // setLoading(true);
    console.log('start handler==>>>', e);
  };
  const onSpeechEndHandler = e => {
    // setLoading(false);
    console.log('stop handler', e);
  };

  const onSpeechResultsHandler = e => {
    let text = e.value[0];
    setResult(text);
    console.log('speech result handler', e);
  };

  const startRecording = async () => {
    setLoading(true);
    try {
      await Voice.start('ko-KR');
    } catch (error) {
      console.log('error raised', error);
    }
  };

  const stopRecording = async () => {
    try {
      await Voice.stop();
      setLoading(false);
      console.log('음성인식 종료');
    } catch (error) {
      console.log('error raised', error);
    }
  };

  const onPressConfirm = () => {
    if (result.trim() === '') {
      setShowAlert(true);
      Alert.alert('경고', '입력값을 입력하세요.', [{text: '확인'}]);
      setShowAlert(false);
    } else {
      setShowAlert(false);
      navigation.navigate('QuizStart', {inputValue: result});
    }
  };

  return (
    <View style={styles.container}>
      <SafeAreaView>
        <Text style={styles.headingText}>Select Topic</Text>
        <Image
          source={require('../../assets/images/bot.png')}
          style={styles.headingImg}
        />
        <View style={styles.textInputStyle}>
          <TextInput
            value={result}
            placeholder="your text"
            style={{flex: 1}}
            onChangeText={text => setResult(text)}
          />
        </View>
        {/* 녹음, 정지 ,확인  뷰 */}
        <View style={styles.buttonView}>
          {isLoading ? (
            <TouchableOpacity onPress={stopRecording}>
              {/* Recording Stop Button */}
              <Image
                source={require('../../assets/images/voiceLoading-unscreen.gif')}
                style={{width: wp(14), height: hp(7)}}
              />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity onPress={startRecording}>
              {/* Recording Start Button */}
              <Image
                source={require('../../assets/images/recordingIcon.png')}
                style={{width: wp(14), height: hp(8)}}
              />
            </TouchableOpacity>
          )}
          <View style={styles.coloredBox}>
            <TouchableOpacity style={{backgroundColor: 'gray-400'}}>
              <Text
                style={{color: 'white', fontWeight: 'bold'}}
                onPress={() => onPressConfirm()}>
                확인
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center', // 화면 수직 중앙 정렬
    alignItems: 'center', // 화면 수평 중앙 정렬
    padding: 20,
    backgroundColor: '#F3E99F',
  },
  headingImg: {
    width: wp(50),
    height: hp(30),
    alignSelf: 'center',
  },
  headingText: {
    marginBottom: 26,
    fontWeight: 'bold',
    fontSize: 26,
    alignSelf: 'center',
  },
  textInputStyle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'white',
    height: hp('7%'),
    width: wp('75%'),
    borderRadius: 20,
    paddingHorizontal: 16,
    shadowOffset: {width: 0, height: 1},
    shadowRadius: 2,
    elevation: 2,
    shadowOpacity: 0.4,
  },
  confirmButton: {
    marginTop: 24,
    backgroundColor: 'purple',
    padding: 8,
    borderRadius: 4,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  buttonView: {
    flex: 0.6,
    justifyContent: 'center',
    alignItems: 'center',
  },
  confirmText: {
    color: 'white',
    fontWeight: 'bold',
    backgroundColor: '#111010',
  },
  coloredBox: {
    backgroundColor: '#CBD5E0', // bg-neutral-400와 같은 색상
    borderRadius: 16, // rounded-3xl와 같은 라운드 값
    padding: 10, // p-2와 같은 패딩 값
    position: 'relative',
  },
});

export default QuizPage_test;
