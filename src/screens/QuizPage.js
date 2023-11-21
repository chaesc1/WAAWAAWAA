import React, {useEffect, useState} from 'react';
import {
  View,
  Image,
  Text,
  StyleSheet,
  SafeAreaView,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import Voice from '@react-native-voice/voice';
import Tts from 'react-native-tts';
import {ArrowLeftIcon} from 'react-native-heroicons/solid';
import Lottie from 'lottie-react-native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import authClient from '../apis/authClient';

const QuizPage = ({navigation}) => {
  const [quiz, setQuiz] = useState([]);
  const [currentQuizIndex, setCurrentQuizIndex] = useState(0);
  const [messages, setMessages] = useState([]);
  const [recording, setRecording] = useState(recording);
  const [loading, setLoading] = useState(false);
  const [speaking, setSpeaking] = useState(false);
  const [result, setResult] = useState(''); //이후 말하는 text 설정
  const [hideClearButton, setHideClearButton] = useState(false);

  const startTextToSpeech = message => {
    setSpeaking(true);
    if (!message.includes('https')) {
      Tts.getInitStatus().then(() => {
        Tts.speak(quiz[currentQuizIndex]?.question, {
          iosVoiceId: 'com.apple.ttsbundle.Yuna-compact',
          rate: 0.5,
        });
      });
    }

    const correctAnswer = quiz[currentQuizIndex].answer === result;
    if (correctAnswer) {
      Alert.alert('잘했어요!');
      if (currentQuizIndex + 1 < quiz.length) {
        setCurrentQuizIndex(currentQuizIndex + 1);
      } else {
        setCurrentQuizIndex(0);
      }
      setResult('');
    } else {
      Alert.alert('조금 더 생각해봐');
    }
  };

  const clear = () => {
    setLoading(false);
    setMessages([]);
    setSpeaking(false);
    setRecording(false);
    Voice.stop();
    Tts.stop();
  };
  const stopSpeaking = () => {
    Tts.stop();
    setSpeaking(false);
    setHideClearButton(true);
  };
  const speechStartHandler = e => {
    setHideClearButton(true);
  };
  const speechEndHandler = e => {
    setRecording(false);
    setHideClearButton(true);
  };
  const speechResultsHandler = e => {
    console.log('speech event: ', e);
    const text = e.value[0];

    setResult(text);
    setHideClearButton(true);
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
      console.log('errpr:', error);
    }
    setHideClearButton(true);
  };

  const stopRecording = async () => {
    setRecording(true);
    Tts.stop();
    try {
      await Voice.stop();
      setRecording(false);
      //fetch Response
      //fetchResponse();
    } catch (error) {
      console.log('error:', error);
    }
    setHideClearButton(true);
  };

  const getQuizData = async () => {
    try {
      const res = await authClient({
        method: 'get',
        url: '/quiz',
      });
      const userData = res.data;
      setQuiz(userData);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    getQuizData();

    // voice handler events
    Voice.onSpeechStart = speechStartHandler;
    Voice.onSpeechEnd = speechEndHandler;
    Voice.onSpeechResults = speechResultsHandler;
    Voice.onSpeechError = speechErrorHandler;
    // text to speech events
    // TTS 초기화
    Tts.setIgnoreSilentSwitch('ignore');
    Tts.setDefaultLanguage('ko-KR'); // 한국어 설정
    Tts.setDefaultRate(0.6); // 음성 속도 설정
    Tts.addEventListener('tts-start', event => console.log('start', event));
    Tts.addEventListener('tts-finish', event => {
      setSpeaking(false);
    });
    Tts.addEventListener('tts-cancel', event => console.log('cancel', event));
    return () => {
      Voice.destroy().then(Voice.removeAllListeners);
    };
  }, []);

  return (
    <KeyboardAwareScrollView
      contentContainerStyle={{flex: 1}}
      extraScrollHeight={20}>
      <View style={styles.container}>
        <Image
          blurRadius={40}
          source={require('../../assets/images/simple.jpg')}
          style={styles.backgroundImage}
        />

        <SafeAreaView style={styles.safeArea}>
          <View style={styles.backButtonContainer}>
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              style={styles.backButton}>
              <ArrowLeftIcon size={wp('6%')} color="white" />
            </TouchableOpacity>
            <Text style={styles.pageTitle}>퀴즈</Text>
          </View>
          <View style={styles.imageContainer}>
            <Lottie
              source={require('../../assets/animations/BlueBear.json')}
              style={styles.image}
              loop
              autoPlay
            />
          </View>
          <View style={styles.triangle}></View>
          <View style={styles.speechBubble}>
            <ScrollView>
              <View style={styles.textWrap}>
                <Text style={{fontSize: 16}}>
                  {quiz[currentQuizIndex]?.question}
                </Text>
              </View>
            </ScrollView>
          </View>
        </SafeAreaView>
        {/* 녹음 , clear, 정지 버튼 */}

        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <TextInput
            value={result}
            placeholder="적어서도 보내봐!!"
            style={styles.textContainer}
            onChangeText={text => setResult(text)}></TextInput>
          <TouchableOpacity
            style={styles.passButton}
            onPress={() =>
              Alert.alert('진짜 넘길 거야?', '다시 한번 생각해봐', [
                {
                  text: '응',
                  onPress: () => {
                    if (currentQuizIndex + 1 < quiz.length) {
                      setCurrentQuizIndex(currentQuizIndex + 1);
                    } else {
                      setCurrentQuizIndex(0);
                    }
                    setResult('');
                  },
                },
                {text: '아니'},
              ])
            }>
            <Text style={styles.buttonText}>넘기기</Text>
          </TouchableOpacity>
          {!loading && (
            <TouchableOpacity
              style={styles.sendButton}
              onPress={() => startTextToSpeech(result)}>
              <Text style={styles.buttonText}>전송</Text>
            </TouchableOpacity>
          )}
        </View>
        <View style={styles.buttonsContainer}>
          {loading ? (
            <Lottie
              source={require('../../assets/animations/loading.json')}
              style={styles.loadingIcon}
              loop
              autoPlay
            />
          ) : recording ? (
            <TouchableOpacity style={styles.button} onPress={stopRecording}>
              {/* Recording Stop Button */}
              <Lottie
                source={require('../../assets/animations/micOnLoading.json')}
                style={styles.buttonImage}
                loop
                autoPlay
              />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity style={styles.button} onPress={startRecording}>
              {/* Recording start Button */}
              <Lottie
                source={require('../../assets/animations/mic_ready.json')}
                style={styles.buttonImage}
                loop
                autoPlay
                speed={1.2}
              />
            </TouchableOpacity>
          )}
          {/* right side */}
          {messages.length > 0 && !hideClearButton && (
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
      </View>
    </KeyboardAwareScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
    // top: hp(),
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
    marginBottom: wp(3),
    right: wp(3),
    flexDirection: 'row',
    gap: 20,
    paddingHorizontal: 20,
  },
  pageTitle: {
    width: wp('50%'),
    fontSize: wp('6%'),
    fontWeight: 'bold',
  },
  backButton: {
    width: wp('8%'),
    backgroundColor: '#1E2B22',
    padding: wp('1%'),
    borderTopRightRadius: wp('5%'),
    borderBottomLeftRadius: wp('5%'),
    marginLeft: wp('2%'),
  },
  speechBubble: {
    position: 'absolute',
    backgroundColor: '#00aabb',
    alignSelf: 'center',
    width: wp(90),
    height: hp(12.5),
    borderRadius: 12,
    padding: 16,
    marginTop: hp(18),
    flex: 1,
  },
  textWrap: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: hp(8.5),
  },
  triangle: {
    position: 'absolute',
    left: '50%',
    width: wp(1),
    height: 0,
    backgroundColor: 'transparent',
    borderStyle: 'solid',
    borderTopWidth: 20,
    borderTopColor: '#00aabb',
    borderRightWidth: 20,
    borderRightColor: 'transparent',
    borderLeftWidth: 20,
    borderLeftColor: 'transparent',
    marginLeft: wp(-10), // 중앙 정렬을 위해 마이너스 마진 설정
    marginTop: hp(30),
    zIndex: -1,
  },
  textContainer: {
    backgroundColor: '#FFFFFF',
    width: wp(67),
    height: hp(4),
    borderRadius: 30,
    marginLeft: wp(3),
    paddingLeft: wp(3),
  },
  assistantMessageContainer: {
    flex: 1,
    justifyContent: 'center', // 수직 중앙 정렬 (상하 중앙 정렬)
    alignItems: 'center', // 수직 중앙 정렬 (상하 중앙 정렬)
    alignSelf: 'center',
  },
  assistantMessage: {
    fontSize: wp(5),
    textAlign: 'center', // 가로 중앙 정렬 (가운데 정렬)
    color: '#374151',
  },
  image: {
    width: wp('50%'),
    height: hp('40%'),
  },
  imageContainer: {
    marginTop: hp(20),
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingIcon: {
    width: hp(10),
    height: hp(10),
    alignItems: 'center',
    justifyContent: 'center',
  },
  button: {
    width: hp(10),
    height: hp(10),
    borderRadius: hp(5),
    alignItems: 'center',
    justifyContent: 'center',
    // marginRight: 8, // Add margin right for spacing
  },
  textStyle: {
    width: 30,
    height: 30,
  },
  buttonsContainer: {
    width: wp(100),
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: hp(5), // Add margin top for spacing
  },
  buttonImage: {
    width: hp(20),
    height: hp(20),
  },
  clearButton: {
    backgroundColor: '#6B7280',
    borderRadius: 20,
    padding: 8,
    position: 'absolute',
    right: wp(5),
    bottom: 10,
  },
  sendButton: {
    backgroundColor: '#6B7280',
    borderRadius: 20,
    padding: wp(2.3),
    position: 'absolute',
    right: wp(3),
  },
  stopButton: {
    backgroundColor: '#EF4444',
    borderRadius: 20,
    padding: 8,
    position: 'absolute',
    left: wp(5),
    top: 10,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  passButton: {
    backgroundColor: '#6B7280',
    borderRadius: 20,
    padding: wp(2),
    position: 'absolute',
    right: wp(15),
  },
});

export default QuizPage;
