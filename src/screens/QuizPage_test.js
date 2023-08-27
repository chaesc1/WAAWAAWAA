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
import {QuizGenerate, apiCall} from '../api/OpenAI'; //퀴즈 생성 api 호출
import Tts from 'react-native-tts'; //TTS Library

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
          // startTextToSpeech(res.data[res.data.length - 1]);
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
    Tts.getInitStatus().then(() => {
      Tts.speak(message.content, {
        iosVoiceId: 'com.apple.ttsbundle.Yuna-compact',
        rate: 0.6,
      });
    });
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
    Voice.stop();
    Tts.stop();
  };
  const stopSpeaking = () => {
    Tts.stop();
    setSpeaking(false);
  };
  const speechStartHandler = e => {
    // console.log('speech start event', e);
  };
  const speechEndHandler = e => {
    setRecording(false);
    // console.log('speech stop event', e);
  };
  const speechResultsHandler = e => {
    console.log('speech event: ', e);
    const text = e.value[0];
    // console.log('Topic : ', topic);

    setResult(text);
  };

  const speechErrorHandler = e => {
    // console.log('speech error: ', e);
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
    // voice handler events
    Voice.onSpeechStart = speechStartHandler;
    Voice.onSpeechEnd = speechEndHandler;
    Voice.onSpeechResults = speechResultsHandler;
    Voice.onSpeechError = speechErrorHandler;

    // text to speech events
    // TTS 초기화
    Tts.setDefaultLanguage('ko-KR'); // 한국어 설정
    Tts.setDefaultRate(0.4); // 음성 속도 설정

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

  // //확인 버튼 누를때 inputvalue 가 없으면
  // const onPressConfirm = () => {
  //   if (result.trim() === '') {
  //     setShowAlert(true);
  //     Alert.alert('경고', '입력값을 입력하세요.', [{text: '확인'}]);
  //     setShowAlert(false);
  //   } else {
  //     setShowAlert(false);
  //     navigation.navigate('QuizStart', {inputValue: result});
  //   }
  // };

  return (
    // <View style={styles.container}>
    //   <SafeAreaView>
    //     <Text style={styles.headingText}>Select Topic</Text>
    //     <Image
    //       source={require('../../assets/images/bot.png')}
    //       style={styles.headingImg}
    //     />
    //     <View style={styles.textInputStyle}>
    //       <TextInput
    //         value={result}
    //         placeholder="your text"
    //         style={{flex: 1}}
    //         onChangeText={text => setResult(text)}
    //       />
    //     </View>
    //     {/* 녹음, 정지 ,확인  뷰 */}
    //     <View style={styles.buttonView}>
    //       {isLoading ? (
    //         <TouchableOpacity onPress={stopRecording}>
    //           {/* Recording Stop Button */}
    //           <Image
    //             source={require('../../assets/images/voiceLoading-unscreen.gif')}
    //             style={{width: wp(14), height: hp(7)}}
    //           />
    //         </TouchableOpacity>
    //       ) : (
    //         <TouchableOpacity onPress={startRecording}>
    //           {/* Recording Start Button */}
    //           <Image
    //             source={require('../../assets/images/recordingIcon.png')}
    //             style={{width: wp(14), height: hp(8)}}
    //           />
    //         </TouchableOpacity>
    //       )}
    //       <View style={styles.coloredBox}>
    //         <TouchableOpacity style={{backgroundColor: 'gray-400'}}>
    //           <Text
    //             style={{color: 'white', fontWeight: 'bold'}}
    //             onPress={() => onPressConfirm()}>
    //             확인
    //           </Text>
    //         </TouchableOpacity>
    //       </View>
    //     </View>
    //   </SafeAreaView>
    // </View>
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
                  <Text style={styles.assistantHeading}>Quiz</Text>
                  <ScrollView
                    ref={scrollViewRef}
                    bounces={false}
                    style={styles.scrollView}
                    showsVerticalScrollIndicator={false}>
                    {messages.map((message, index) => {
                      if (message.role == 'assistant') {
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

export default QuizPage_test;
