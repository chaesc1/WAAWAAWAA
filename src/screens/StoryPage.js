// 이야기 페이지
import {
  Alert,
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ScrollView,
  TextInput,
} from 'react-native';
import React, {useState, useEffect} from 'react';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import Voice from '@react-native-voice/voice';
import {ArrowLeftIcon} from 'react-native-heroicons/solid';
import Tts from 'react-native-tts';

import {AccessToken, sendConnectEndingText} from '../constants';
import Footer from '../components/footer';

Tts.requestInstallData();

export default CounsellingRe = ({navigation}) => {
  const [messages, setMessages] = useState([]);
  const [result, setResult] = useState();
  const [recording, setRecording] = useState(recording);
  const [loading, setLoading] = useState(false);
  const [speaking, setSpeaking] = useState(false);
  const [answerCount, setAnswerCount] = useState(0);
  const [book, setBook] = useState(0);

  const fetchResponse = () => {
    if (result.trim().length > 0) {
      let newMessages = [...messages];
    }
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
    setAnswerCount(0);
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
    [
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
    ],
    [
      '옛날에 채연이라는 꼬마 펭귄이 살았어요',
      '꼬마 펭귄 채연이는 저녁 밥으로 물고기를 먹고있었어요',
      '마침 채연이의 집을 지나가던 예림이는 군침을 삼켰어요',
      '와 맛있겠다',
      '나 혼자 먹기에 많은데 조금 나눠줄까',
      '정말 고마워',
      '채연이는 예림이에게 물고기를 나눠주고 다시 식사를 시작했어요',
      '그 때 창 밖에서 꼬르륵 소리가 들렸어요',
      '거기 누구야',
      '나 수연이야 너무 배고파',
      '그럼 내 물고기를 나눠줄게',
      '와 맛있겠다 고마워',
      '채연이는 수연이에게도 물고기를 나눠주고 다시 식사를 시작했어요',
      '킁킁 어디서 물고기 냄새가 나는데',
      '정훈아 안녕 물고기 먹고싶니',
      '응 같이 먹어도 돼?',
      '물론',
      '다음 날 채연이는 머리가 아파서 물고기를 잡으러 갈 수 없었어요',
      '아이고 머리야 배도 고파 으앙',
      '똑똑똑 누구세요',
      '채연아 괜찮아',
      '펭귄 마을 친구들이 물고기를 잡아서 병문안을 왔어요',
      '모두가 사이좋게 물고기를 나눠먹었답니다',
    ],
  ];

  return (
    <View style={styles.container}>
      <Image
        blurRadius={40}
        source={require('../../assets/images/Background_2.png')}
        style={styles.backgroundImage}
      />
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.backButtonContainer}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backButton}>
            <ArrowLeftIcon size={wp('6%')} color="white" />
          </TouchableOpacity>
        </View>
      </SafeAreaView>
      <SafeAreaView style={{flex: 1}}>
        {/* Icon */}
        <View style={{flexDirection: 'row', justifyContent: 'center'}}>
          <Image
            source={require('../../assets/images/bot.png')}
            style={{height: hp(15), width: hp(15)}}
          />
        </View>
        {/* feature,message */}
        <View>
          <View
            style={{
              height: hp(50),
              backgroundColor: 'transparent',
              borderRadius: 20,
              padding: 16,
              marginBottom: 16,
            }}>
            <View style={{flex: 1, marginVertical: 1, marginLeft: 8}}>
              <Text style={styles.assistantHeading}>
                이야기를 따라해봐~!!!!
              </Text>
              <Text
                style={{
                  fontSize: wp(4),
                  fontWeight: 'bold',
                  color: '#374151',
                  marginTop: 5,
                }}>
                {storyMessage[book][answerCount]}
              </Text>
              <TextInput
                style={{
                  marginTop: 8,
                  borderBottomWidth: 1, // borderBottom의 두께를 1로 설정
                  borderBottomColor: 'black',
                }}
                value={result}
                editable={false} // TextInput을 읽기 전용으로 설정
              />
            </View>
            <ScrollView
              style={{
                padding: 8,
                borderRadius: 10,
                backgroundColor: book === 1 ? 'lightblue' : 'lightpink',
                overflow: 'scroll',
                height: hp(5),
              }}>
              {storyMessage[book].slice(0, answerCount).map((story, i) => {
                return <Text key={i}>{story}</Text>;
              })}
            </ScrollView>
            <View
              style={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              {answerCount > 0 && (
                <TouchableOpacity
                  style={{marginRight: 8}}
                  onPress={() => {
                    setAnswerCount(answerCount - 1);
                  }}>
                  <Text>이전</Text>
                </TouchableOpacity>
              )}
              {/* 녹음 , clear, 정지 버튼 */}
              <View style={styles.buttonsContainer}>
                {loading ? (
                  <Image
                    source={require('../../assets/images/loading.gif')}
                    style={styles.buttonImage}
                  />
                ) : recording ? (
                  <TouchableOpacity
                    style={styles.button}
                    onPress={stopRecording}>
                    {/* Recording Stop Button */}
                    <Image
                      source={require('../../assets/images/voiceLoading-unscreen.gif')}
                      style={styles.buttonImage}
                    />
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity
                    style={styles.button}
                    onPress={startRecording}>
                    {/* Recording start Button */}
                    <Image
                      source={require('../../assets/images/recordingIcon.png')}
                      style={styles.buttonImage}
                    />
                  </TouchableOpacity>
                )}
                {/* left side */}
                {speaking > 0 && (
                  <TouchableOpacity
                    style={styles.stopButton}
                    onPress={stopSpeaking}>
                    <Text style={styles.buttonText}>Stop</Text>
                  </TouchableOpacity>
                )}
              </View>

              {answerCount < storyMessage[book].length - 1 && (
                <TouchableOpacity
                  onPress={() => {
                    if (
                      storyMessage[book][answerCount].replace(/(\s*)/g, '') ===
                      result?.replace(/(\s*)/g, '')
                    ) {
                      setAnswerCount(answerCount + 1);
                      Alert.alert('잘했어요!');
                      setResult('');
                    } else {
                      Alert.alert('조금 더 정확하게 말해볼까요?');
                    }
                  }}>
                  <Text>다음</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        </View>
        {/* 책 선택창 */}
        <View
          style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
          }}>
          <TouchableOpacity
            style={{display: 'flex', alignItems: 'center'}}
            onPress={() => setBook(0)}>
            {book === 0 ? (
              <Image
                source={require('../../assets/images/su_hand_penguin.png')}
                style={{height: hp(15), width: hp(10)}}
              />
            ) : (
              <Image
                source={require('../../assets/images/su_penguin.png')}
                style={{height: hp(15), width: hp(10)}}
              />
            )}
            <Text>게으른 꼬마 펭귄</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={{display: 'flex', alignItems: 'center'}}
            onPress={() => {
              setAnswerCount(0);
              setResult('');
              setBook(1);
            }}>
            {book === 1 ? (
              <Image
                source={require('../../assets/images/chae_hand_penguin.png')}
                style={{height: hp(15), width: hp(10)}}
              />
            ) : (
              <Image
                source={require('../../assets/images/chae_penguin.png')}
                style={{height: hp(15), width: hp(10)}}
              />
            )}
            <Text>마음씨 고운 꼬마 펭귄</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
      <Footer />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundImage: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    zIndex: -1,
  },
  backButtonContainer: {
    justifyContent: 'flex-start',
    width: wp(10),
  },
  backButton: {
    backgroundColor: '#1E2B22',
    padding: wp('1%'),
    borderTopRightRadius: wp('5%'),
    borderBottomLeftRadius: wp('5%'),
    marginLeft: wp('2%'),
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
