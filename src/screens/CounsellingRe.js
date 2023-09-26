import {
  Alert,
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ArrowLeftIcon,
} from 'react-native';
import React, {useState, useEffect, useRef} from 'react';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import Features from '../components/feature';
import Voice from '@react-native-voice/voice';
import {apiCall} from '../api/OpenAI';
import Tts from 'react-native-tts';
import authClient from '../apis/authClient';
import Footer from '../components/footer';
import Lottie from 'lottie-react-native';
Tts.requestInstallData();

export default CounsellingRe = () => {
  const [messages, setMessages] = useState([]);
  const [result, setResult] = useState();
  const [recording, setRecording] = useState(recording);
  const [loading, setLoading] = useState(false);
  const [speaking, setSpeaking] = useState(false);
  const [hideClearButton, setHideClearButton] = useState(false);
  const scrollViewRef = useRef();

  const getMessage = async () => {
    try {
      const res = await authClient({
        method: 'get',
        url: '/counseling',
      });
      setMessages(res.data);
      setLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchResponse = async () => {
    if (result.trim().length > 0) {
      let newMessages = [...messages];
      newMessages.push({role: 'user', content: result.trim()});
      updateScrollView();
      setLoading(true);

      if (newMessages.length > 0) {
        const body = {
          sender: newMessages[newMessages.length - 1].role,
          content: newMessages[newMessages.length - 1].content,
          time: new Date(),
        };

        try {
          authClient({
            method: 'post',
            url: '/counseling',
            data: body,
          });
          await getMessage();
          setHideClearButton(false);
          setResult('');
        } catch (error) {
          console.log(error);
        }
      }

      apiCall(result.trim(), newMessages).then(async res => {
        setLoading(false);
        if (res.success) {
          setResult('');
          updateScrollView();
          const body = {
            content: res.data[res.data.length - 1].content,
            sender: res.data[res.data.length - 1].role,
            time: new Date(),
          };

          try {
            await authClient({
              method: 'post',
              url: '/counseling',
              data: body,
            });
            await getMessage();
            setHideClearButton(false);
          } catch (error) {
            console.error(error);
          }

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

  const clear = async () => {
    try {
      const res = await authClient({
        method: 'delete',
        url: '/counseling',
      });
      console.log(res.data);
      Alert.alert('다시 시작해볼까?');
      setLoading(false);
      getMessage();
    } catch (error) {
      console.log(error);
    }

    setLoading(true);
    setSpeaking(false);
    Voice.stop();
    Tts.stop();
  };
  const stopSpeaking = () => {
    Tts.stop();
    setSpeaking(false);
    setHideClearButton(true);
  };
  const speechStartHandler = e => {
    console.log('speech start event', e);
    setHideClearButton(true);
  };
  const speechEndHandler = e => {
    setRecording(false);
    console.log('speech stop event', e);
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
      // fetchResponse();
    } catch (error) {
      console.log('errpr:', error);
    }
    setHideClearButton(true);
  };
  useEffect(() => {
    getMessage();
    setLoading(true);
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
      console.log('finish', event);
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
      <SafeAreaView style={{flex: 1}}>
        {/* Icon */}
        <View style={{flexDirection: 'row', justifyContent: 'center'}}>
          <Lottie
            source={require('../../assets/animations/newBear.json')}
            style={styles.featureTitleIcon}
            loop
            speed={0.2}
            autoPlay
          />
        </View>
        {/* feature,message */}
        {messages.length > 0 ? (
          <View style={{flex: 1.5, marginVertical: 10}}>
            <View
              style={{
                height: hp(55),
                backgroundColor: '#CBD5E0',
                borderRadius: 20,
                padding: 16,
              }}>
              {messages.length > 0 ? (
                <View style={{flex: 1, marginVertical: 1}}>
                  <Text style={styles.assistantHeading}>Counselling</Text>
                  <ScrollView
                    ref={scrollViewRef}
                    bounces={false}
                    style={styles.scrollView}
                    showsVerticalScrollIndicator={false}>
                    {messages.map((message, index) => {
                      if (message.sender == 'assistant') {
                        //text gpt 대답 부분
                        return (
                          <View
                            key={index}
                            style={styles.assistantMessageContainer}>
                            <Text style={styles.assistantMessage}>
                              {message.content}
                            </Text>
                          </View>
                        );
                      } else {
                        return (
                          <View key={index} style={styles.userMessageContainer}>
                            <View style={styles.userMessageContent}>
                              <Text style={styles.userMessageText}>
                                {message.content}
                              </Text>
                            </View>
                          </View>
                        );
                      }
                    })}
                  </ScrollView>
                </View>
              ) : (
                <Features />
              )}
            </View>
          </View>
        ) : (
          <Features />
        )}
        {/* 녹음 , clear, 정지 버튼 */}

        <View style={styles.buttonsContainer}>
          <TextInput
            value={result}
            placeholder="your text"
            style={{flex: 1}}
            onChangeText={text => setResult(text)}
          />
          {loading ? (
            <Lottie
              source={require('../../assets/animations/loading.json')}
              style={styles.buttonImage}
              loop
              autoPlay
              speed={9}
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
          {!loading && (
            <TouchableOpacity onPress={fetchResponse}>
              <Text>전송</Text>
            </TouchableOpacity>
          )}
        </View>
      </SafeAreaView>
      <Footer />
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
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAF1E4',
    paddingBottom: 0,
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
    paddingLeft: 16,
    paddingRight: 16,
    marginTop: 20, // Add margin top for spacing
  },
  button: {
    width: hp(10),
    height: hp(10),
    borderRadius: hp(5),
    alignItems: 'center',
    justifyContent: 'center',
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
    right: wp(5),
    top: 10,
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
  featureTitleIcon: {
    width: wp(30),
    height: hp(20),
    alignContent: 'center',
    // marginTop: 1,
    right: wp(1),
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
});
