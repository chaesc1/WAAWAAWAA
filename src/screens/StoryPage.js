// 이야기 페이지
import {
  Alert,
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import axios from 'axios';
import React, {useState, useEffect, useRef} from 'react';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import Features from '../components/ConnectFeature';
import Voice from '@react-native-voice/voice';
import {ConnectEndApi} from '../api/OpenAI';
import Tts from 'react-native-tts';
import {AccessToken, sendConnectEndingText} from '../constants';
Tts.requestInstallData();

export default CounsellingRe = () => {
  const [messages, setMessages] = useState([]);
  const [result, setResult] = useState();
  const [recording, setRecording] = useState(recording);
  const [loading, setLoading] = useState(false);
  const [speaking, setSpeaking] = useState(false);
  const [count, setCount] = useState(0);
  const [gptLastLetter, setGptLastLetter] = useState('');
  const scrollViewRef = useRef();

  const fetchResponse = () => {
    if (result.trim().length > 0) {
      let newMessages = [...messages];
    }
  };
  const startTextToSpeech = message => {
    if (!message.content.includes('https')) {
      Tts.getInitStatus().then(() => {
        Tts.speak(message.content, {
          iosVoiceId: 'com.apple.ttsbundle.Yuna-compact',
          rate: 0.6,
        });
      });
    }
  };

  const updateScrollView = () => {
    setTimeout(() => {
      scrollViewRef?.current?.scrollToEnd({animated: true});
    }, 200);
  };

  const clear = () => {
    clearMessage();
    setLoading(true);
    Voice.stop();
    Tts.stop();
  };
  const stopSpeaking = () => {
    Tts.stop();
    setSpeaking(false);
  };
  const speechStartHandler = e => {
    console.log('speech start event', e);
  };
  const speechEndHandler = e => {
    setRecording(false);
    console.log('speech stop event', e);
  };
  const speechResultsHandler = e => {
    console.log('speech event: ', e);
    const text = e.value[0];
    setResult(text);
  };

  const speechErrorHandler = e => {
    console.log('speech error: ', e);
  };

  const startRecording = async () => {
    setRecording(true);
    Tts.stop();
    try {
      await Voice.start('ko-KR');
    } catch (error) {
      console.log('err:', error);
    }
  };

  const stopRecording = async () => {
    setRecording(true);
    Tts.stop();
    try {
      await Voice.stop();
      setRecording(false);
      //fetch Response
      fetchResponse();
    } catch (error) {
      console.log('err:', error);
    }
  };

  useEffect(() => {
    setCount(0);
    // voice handler events
    Voice.onSpeechStart = speechStartHandler;
    Voice.onSpeechEnd = speechEndHandler;
    Voice.onSpeechResults = speechResultsHandler;
    Voice.onSpeechError = speechErrorHandler;

    // text to speech events
    // TTS 초기화
    Tts.setDefaultLanguage('ko-KR'); // 한국어 설정
    Tts.setDefaultRate(0.8); // 음성 속도 설정

    Tts.addEventListener('tts-start', event => console.log('start', event));
    Tts.addEventListener('tts-finish', event => {
      console.log('finish', event);
      setSpeaking(false);
    });
    Tts.addEventListener('tts-cancel', event => console.log('cancel', event));
    return () => {
      // destroy the voice instance after component unmounts
      Voice.destroy().then(Voice.removeAllListeners);
    };
  }, []);

  const storyMessage = [
    '옛날에 수연이라는 꼬마 펭귄이 살았어요',
    '수연이의 배에서 꼬르륵 소리가 났어요',
    '아이 배고파 먹을 거 없나',
    '수연이는 냉장고를 열어봤지만 텅 비어있었어요',
    '귀찮아서 물고기를 잡아오지 않았기 때문이에요',
    '심심해진 수연이는 좋아하는 펭귄 친구 준성이에게 전화했어요',
    '나 심심한데 오늘 우리집에서 놀래',
    '으잉 너네집에서',
    '응 같이 물고기 먹자',
    '좋아',
    '수연이는 열심히 집을 치우고 꽃단장을 했어요',
    '똑똑똑 수연아 나야',
    '어서와 우리 뭐하고 놀까',
    '같이 물고기 먹자며',
    '수연이는 텅 빈 냉장고가 떠올랐어요',
    '어쩌지 물고기가 없는 것을 깜빡했어',
    '그럼 다음에 올게 안녕',
    '수연이는 슬퍼서 엉엉 울었어요',
    '진작 물고기 잡아놓을 걸',
    '그 날부터 수연이는 미루지 않고 꼬박꼬박 물고기를 잡으러 갔답니다',
  ];

  return (
    <View style={styles.container}>
      <SafeAreaView style={{flex: 1}}>
        {/* Icon */}
        <View style={{flexDirection: 'row', justifyContent: 'center'}}>
          <Image
            source={require('../../assets/images/bot.png')}
            style={{height: hp(15), width: hp(15)}}
          />
        </View>
        {/* feature,message */}
        <View style={{flex: 1.5, marginVertical: 10}}>
          <View
            style={{
              height: hp(55),
              backgroundColor: '#CBD5E0',
              borderRadius: 20,
              padding: 16,
            }}>
            <View style={{flex: 1, marginVertical: 1}}>
              <Text style={styles.assistantHeading}>
                이야기를 따라해봐~!!!!
              </Text>
              <Text>{storyMessage[count]}</Text>
              <Text>{result}</Text>
              {count > 0 && (
                <TouchableOpacity
                  onPress={() => {
                    setCount(count - 1);
                  }}>
                  <Text>이전</Text>
                </TouchableOpacity>
              )}
              {count < storyMessage.length - 1 && (
                <TouchableOpacity
                  onPress={() => {
                    if (
                      storyMessage[count].replace(/(\s*)/g, '') ===
                      result.replace(/(\s*)/g, '')
                    ) {
                      setCount(count + 1);
                      Alert.alert('잘했어요!');
                      setResult('');
                    } else {
                      console.log(storyMessage[count].replace(/(\s*)/g, ''));
                      console.log(result.replace(/(\s*)/g, ''));
                      Alert.alert('조금 더 정확하게 말해볼까요?');
                    }
                  }}>
                  <Text>다음</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        </View>
        {/* 녹음 , clear, 정지 버튼 */}
        <View style={styles.buttonsContainer}>
          {loading ? (
            <Image
              source={require('../../assets/images/loading.gif')}
              style={styles.buttonImage}
            />
          ) : recording ? (
            <TouchableOpacity style={styles.button} onPress={stopRecording}>
              {/* Recording Stop Button */}
              <Image
                source={require('../../assets/images/voiceLoading-unscreen.gif')}
                style={styles.buttonImage}
              />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity style={styles.button} onPress={startRecording}>
              {/* Recording start Button */}
              <Image
                source={require('../../assets/images/recordingIcon.png')}
                style={styles.buttonImage}
              />
            </TouchableOpacity>
          )}
          {/* right side */}
          {messages.length > 0 && (
            <TouchableOpacity style={styles.clearButton} onPress={clear}>
              <Text style={styles.buttonText}>Clear</Text>
            </TouchableOpacity>
          )}
          {/* left side */}
          {speaking > 0 && (
            <TouchableOpacity style={styles.stopButton} onPress={stopSpeaking}>
              <Text style={styles.buttonText}>Stop</Text>
            </TouchableOpacity>
          )}
        </View>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    paddingBottom: 10,
  },
  scrollView: {
    height: hp(60),
    backgroundColor: '#F4F4F4',
    borderRadius: 10,
    padding: 8,
  },
  assistantHeading: {
    fontSize: wp(5),
    fontWeight: 'bold',
    color: '#374151',
    marginLeft: 8,
  },
  assistantMessageContainer: {
    width: wp(75),
    backgroundColor: '#D1FAE5',
    padding: 8,
    borderRadius: 20,
    borderTopLeftRadius: 0,
    marginBottom: 10,
  },
  assistantMessage: {
    fontSize: wp(4),
    color: '#374151',
  },
  userMessageContainer: {
    width: wp(75),
    backgroundColor: 'white',
    padding: 8,
    borderRadius: 20,
    borderTopRightRadius: 0,
    alignSelf: 'flex-end',
    marginBottom: 10, // 조정된 값
  },
  userMessageContent: {
    flex: 0,
    justifyContent: 'center',
  },
  userMessageText: {
    fontSize: wp(4),
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 15, // Add margin top for spacing
  },
  button: {
    width: hp(10),
    height: hp(10),
    borderRadius: hp(5),
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16, // Add margin right for spacing
  },
  buttonImage: {
    width: hp(10),
    height: hp(10),
  },
  clearButton: {
    backgroundColor: '#6B7280',
    borderRadius: 20,
    padding: 8,
    position: 'absolute',
    right: 10,
    bottom: 10,
  },
  stopButton: {
    backgroundColor: '#EF4444',
    borderRadius: 20,
    padding: 8,
    position: 'absolute',
    left: 10,
    bottom: 10,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});
