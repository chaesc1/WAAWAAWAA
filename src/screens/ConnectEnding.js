// 끝말잇기 페이지
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
import authClient from '../apis/authClient';
Tts.requestInstallData();

export default CounsellingRe = () => {
  const [messages, setMessages] = useState([]);
  const [result, setResult] = useState();
  const [recording, setRecording] = useState(recording);
  const [loading, setLoading] = useState(false);
  const [speaking, setSpeaking] = useState(false);
  const [gptLastLetter, setGptLastLetter] = useState('');
  const scrollViewRef = useRef();

  const getMessage = async () => {
    try {
      const res = await authClient({
        method: 'get',
        url: '/word-chain',
      });
      setMessages(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  const clearMessage = async () => {
    try {
      const res = await authClient({
        method: 'delete',
        url: '/word-chain',
      });
      console.log(res.data);
      Alert.alert('다시 시작해볼까?');
      setLoading(false);
      getMessage();
    } catch (error) {
      console.log(error);
    }
  };

  const fetchResponse = () => {
    if (result.trim().length > 0) {
      let newMessages = [...messages];
      if (result.trim().slice(0, 1) !== gptLastLetter && messages.length != 0) {
        Alert.alert('틀렸어!', '다시해!!', [
          {
            text: '응',
            onPress: () => {
              clearMessage();
              setLoading(true);
            },
          },
        ]);
      } else {
        newMessages.push({role: 'user', content: result.trim()});

        const body = {
          sender: newMessages[newMessages.length - 1].role,
          content: newMessages[newMessages.length - 1].content,
          time: new Date(),
        };

        try {
          authClient({
            method: 'post',
            url: '/word-chain',
            data: body,
          });
          getMessage();
        } catch (error) {
          console.log(error);
        }

        updateScrollView();
        setLoading(true);

        ConnectEndApi(result.trim(), newMessages).then(res => {
          setLoading(false);
          if (res.success) {
            setGptLastLetter(res.data[res.data.length - 1].content.slice(-1));

            const gptAnswer = res.data[res.data.length - 1];

            const gptBody = {
              content: gptAnswer?.content,
              sender: gptAnswer?.role,
              time: new Date(),
            };

            try {
              authClient({
                method: 'post',
                url: '/word-chain',
                data: gptBody,
              });
              getMessage();
            } catch (error) {
              console.error(error);
            }

            setResult('');
            updateScrollView();

            // now play the response to user
            startTextToSpeech(res.data[res.data.length - 1]);
          } else {
            Alert.alert('Error', res.msg);
          }
        });
      }
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
    getMessage();

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
                  <Text style={styles.assistantHeading}>끝말잇기!!!</Text>
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
                        //user input
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
    bottom: 10,
  },
  stopButton: {
    backgroundColor: '#EF4444',
    borderRadius: 20,
    padding: 8,
    position: 'absolute',
    left: wp(5),
    bottom: 10,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});
