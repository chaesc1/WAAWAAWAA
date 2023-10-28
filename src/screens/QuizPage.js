import React, {useEffect, useRef, useState} from 'react';
import {
  View,
  Image,
  Text,
  StyleSheet,
  SafeAreaView,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
  Alert,
} from 'react-native';
import Voice from '@react-native-voice/voice';
import Icon from 'react-native-vector-icons/FontAwesome5';
import Features from '../components/QuizFeature'; //첫 초기화면 굳이 넣어햐하나?
import {QuizGenerate} from '../api/OpenAI'; //퀴즈 생성 api 호출
import Tts from 'react-native-tts'; //TTS Library
import Footer from '../components/footer';
import {ArrowLeftIcon} from 'react-native-heroicons/solid';
import Lottie from 'lottie-react-native';

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

const QuizPage_test = ({navigation}) => {
  const [messages, setMessages] = useState([]);
  const [recording, setRecording] = useState(recording);
  const [loading, setLoading] = useState(false);
  const [speaking, setSpeaking] = useState(false);
  const [topic, setTopic] = useState(''); //처음 주제 설정
  const [result, setResult] = useState(''); //이후 말하는 text 설정
  const [hideClearButton, setHideClearButton] = useState(false);
  const scrollViewRef = useRef();

  const fetchResponse = () => {
    if (topic.trim().length > 0 && result.trim().length > 0) {
      //주제 값이 있으면
      //처음에는 quizGenerate를 호출해야하고
      let newMessages = [...messages];
      newMessages.push({role: 'user', content: result.trim()});
      setMessages([...newMessages]);
      updateScrollView();
      setLoading(true);

      // console.log('topic', topic);
      // console.log('newMessage', newMessages);
      // console.log('result.trim', result.trim());

      // fetching response from chatGPT with our prompt and old messages
      QuizGenerate(result.trim(), newMessages).then(res => {
        console.log('got api data');
        setLoading(false);
        if (res.success) {
          setMessages([...res.data]);
          setResult('');
          updateScrollView();

          // now play the response to user
          startTextToSpeech(res.data[res.data.length - 1]);
        } else {
          Alert.alert('Error', res.msg);
        }
      });
    } else {
      setTopic(result.trim());
      let newMessages = [...messages];
      newMessages.push({role: 'user', content: result.trim()});
      setMessages([...newMessages]);
      updateScrollView();
      setLoading(true);

      QuizGenerate(result.trim(), newMessages).then(res => {
        console.log('got api data');
        setLoading(false);
        if (res.success) {
          setMessages([...res.data]);
          setResult('');
          updateScrollView();

          // now play the response to user
          startTextToSpeech(res.data[res.data.length - 1]);
        } else {
          Alert.alert('Error', res.msg);
        }
      });
    }
  };
  const startTextToSpeech = message => {
    setSpeaking(true);
    if (!message.content.includes('https')) {
      Tts.getInitStatus().then(() => {
        Tts.speak(message.content, {
          iosVoiceId: 'com.apple.ttsbundle.Yuna-compact',
          rate: 0.5,
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
    setTopic('');
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
    // console.log('speech start event', e);
    setHideClearButton(true);
  };
  const speechEndHandler = e => {
    setRecording(false);
    // console.log('speech stop event', e);
    setHideClearButton(true);
  };
  const speechResultsHandler = e => {
    console.log('speech event: ', e);
    const text = e.value[0];
    // console.log('Topic : ', topic);

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
      console.log('errpr:', error);
    }
    setHideClearButton(true);
  };
  useEffect(() => {
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
      // console.log('finish', event);
      setSpeaking(false);
    });
    Tts.addEventListener('tts-cancel', event => console.log('cancel', event));
    return () => {
      // destroy the voice instance after component unmounts
      Voice.destroy().then(Voice.removeAllListeners);
    };
  }, []);

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
        <View style={styles.imageContainer}>
          <Lottie
            source={require('../../assets/animations/BlueBear.json')}
            style={styles.image}
            loop
            autoPlay
          />
        </View>
        <View style={styles.triangle}></View>
        <ScrollView style={styles.speechBubble}>
          {messages.map((message, index) => {
            if (message.role == 'assistant') {
              //text gpt 대답 부분
              return (
                <View style={{flex: 1, flexDirection: 'column'}}>
                  <View style={{flex: 1, backgroundColor: 'red'}}></View>
                  <View key={index} style={styles.assistantMessageContainer}>
                    {/* <Text style={styles.assistantMessage}>{message.content}</Text> */}
                    <Text style={styles.assistantMessage}>
                      한줄일떄 테스트요
                    </Text>
                  </View>
                  <View style={{flex: 1, backgroundColor: 'blue'}}></View>
                </View>
              );
            }
          })}
        </ScrollView>
      </SafeAreaView>
      {/* 녹음 , clear, 정지 버튼 */}
      <View>
        <TextInput
          value={result}
          placeholder="적어서도 보내봐!!"
          style={styles.textContainer}
          onChangeText={text => setResult(text)}
        />
        {!loading && (
          <TouchableOpacity style={styles.sendButton} onPress={fetchResponse}>
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
              source={require('../../assets/animations/ReadyRecord.json')}
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
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
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
  speechBubble: {
    position: 'absolute',
    backgroundColor: '#00aabb',
    width: wp(90),
    height: hp(17.5),
    borderRadius: 12,
    alignSelf: 'center',
    padding: 16,
    marginTop: hp(13),
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
    width: wp(80),
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
  buttonsContainer: {
    width: wp(100),
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: hp(10.5), // Add margin top for spacing
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
});

export default QuizPage_test;
