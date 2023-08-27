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
import Features from '../components/feature';
import {dummyMessages} from '../constants';
import {AccessToken, addCounsellingLog} from '../constants';
import Voice from '@react-native-voice/voice';
import {apiCall} from '../api/OpenAI';
import Tts from 'react-native-tts';
Tts.requestInstallData();

export default CounsellingRe = () => {
  const [messages, setMessages] = useState([]);
  const [result, setResult] = useState();
  const [recording, setRecording] = useState(recording);
  const [loading, setLoading] = useState(false);
  const [speaking, setSpeaking] = useState(false);
  const scrollViewRef = useRef();

  const getMessage = () => {
    axios
      .get('http://15.164.50.203:3000/counseling', {
        headers: {
          Authorization: `Bearer ${AccessToken}`, // 헤더에 AccessToken 추가
          'Content-Type': 'application/json', // 원하는 헤더 값 추가
        },
      })
      .then(response => {
        console.log('API Response:', response.data);
        setMessages(response.data);
      })
      .catch(error => {
        console.error('API Error:', error.response.data);
      });
  };

  const fetchResponse = () => {
    if (result.trim().length > 0) {
      let newMessages = [...messages];
      newMessages.push({role: 'user', content: result.trim()});
      updateScrollView();
      setLoading(true);

      if (newMessages.length > 0) {
        // console.log(error.response.data);
        const body = {
          sender: newMessages[newMessages.length - 1].role,
          content: newMessages[newMessages.length - 1].content,
          time: new Date(),
        };

        axios
          .post('http://15.164.50.203:3000/counseling', body, {
            headers: {
              Authorization: `Bearer ${AccessToken}`, // 헤더에 AccessToken 추가
              'Content-Type': 'application/json', // 원하는 헤더 값 추가
            },
          })
          .then(response => {
            getMessage();
            console.log('API Response:', response.data);
          })
          .catch(error => {
            console.error('Post API Error:', error.response.data);
          });
      }

      // fetching response from chatGPT with our prompt and old messages
      apiCall(result.trim(), newMessages).then(res => {
        console.log('got api data');
        setLoading(false);
        if (res.success) {
          console.log('gpt 대답', res.data[res.data.length - 1]);
          setResult('');
          updateScrollView();
          const body = {
            content: res.data[res.data.length - 1].content,
            sender: res.data[res.data.length - 1].role,
            time: new Date(),
          };
          axios
            .post('http://15.164.50.203:3000/counseling', body, {
              headers: {
                Authorization: `Bearer ${AccessToken}`, // 헤더에 AccessToken 추가
                'Content-Type': 'application/json', // 원하는 헤더 값 추가
              },
            })
            .then(response => {
              getMessage();
              console.log('API Response:', response.data);
            })
            .catch(error => {
              console.error('Post API Error:', error.response.data);
            });

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
    axios
      .delete('http://15.164.50.203:3000/counseling', {
        headers: {
          Authorization: `Bearer ${AccessToken}`, // 헤더에 AccessToken 추가
          'Content-Type': 'application/json', // 원하는 헤더 값 추가
        },
      })
      .then(response => {
        Alert.alert('메세지 삭제 성공!');
        setLoading(false);
        console.log('API Response:', response.data);
        getMessage();
      })
      .catch(error => {
        console.error('API Error:', error.response.data);
      });
    setLoading(true);
    setSpeaking(false);
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
      console.log('errpr:', error);
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
      console.log('errpr:', error);
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

  // console.log('result', result);
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
                  <Text style={styles.assistantHeading}>Counselling</Text>
                  <ScrollView
                    ref={scrollViewRef}
                    bounces={false}
                    style={styles.scrollView}
                    showsVerticalScrollIndicator={false}>
                    {messages.map((message, index) => {
                      console.log(message);
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
