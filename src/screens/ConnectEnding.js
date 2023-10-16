// 끝말잇기 페이지
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
} from 'react-native';
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
import Footer from '../components/footer';
import Lottie from 'lottie-react-native';
import {ArrowLeftIcon} from 'react-native-heroicons/solid';
Tts.requestInstallData();

export default CounsellingRe = ({navigation}) => {
  const [messages, setMessages] = useState([]);
  const [result, setResult] = useState();
  const [recording, setRecording] = useState(recording);
  const [loading, setLoading] = useState(false);
  const [speaking, setSpeaking] = useState(false);
  const [gptLastLetter, setGptLastLetter] = useState('');
  const [hideClearButton, setHideClearButton] = useState(false);
  const scrollViewRef = useRef();

  const getMessage = async () => {
    try {
      const res = await authClient({
        method: 'get',
        url: '/word-chain',
      });
      setMessages(res.data);
      setLoading(false);
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
  const clearTextField = async () => {
    await setResult('');
    await getMessage();

    await updateScrollView();
  };

  const fetchResponse = async () => {
    if (result.trim().length > 0) {
      let newMessages = [...messages];
      console.log(gptLastLetter);
      if (result.trim().slice(0, 1) !== gptLastLetter && messages.length != 0) {
        Alert.alert('틀렸어!', '다시해!!', [
          {
            text: '응',
            onPress: () => {
              clearMessage();
              setLoading(true);
              setGptLastLetter('');
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
          await authClient({
            method: 'post',
            url: '/word-chain',
            data: body,
          });
          getMessage();
          setHideClearButton(false);
        } catch (error) {
          console.log(error);
        }

        updateScrollView();
        setLoading(true);

        try {
          const res = await ConnectEndApi(result?.trim() ?? '', newMessages);
          console.log(res, 'res');
          const gptResponse = res.data[res.data?.length - 1].content;

          if (gptResponse === '졌어' || gptResponse.slice(-1) === '.') {
            Alert.alert('GPT가 졌어!', '너가 이겼다!!', [
              {
                text: '우와! 한 번 더?',
                onPress: () => {
                  clearMessage();
                  setLoading(true);
                  setGptLastLetter('');
                },
              },
            ]);
          }

          setLoading(false);

          if (res.success) {
            setGptLastLetter(gptResponse.slice(-1));

            const gptAnswer = res.data?.[res.data?.length - 1];

            const gptBody = {
              content: gptAnswer?.content,
              sender: gptAnswer?.role,
              time: new Date(),
            };

            try {
              await authClient({
                method: 'post',
                url: '/word-chain',
                data: gptBody,
              });
              getMessage();
            } catch (error) {
              console.error(error);
            }

            clearTextField();
            startTextToSpeech(res.data?.[res.data?.length - 1]);
          } else {
            Alert.alert('Error', res.msg);
          }
        } catch (error) {
          console.error(error);
        }
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
      console.log('err:', error);
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
      fetchResponse();
    } catch (error) {
      console.log('err:', error);
    }
    setHideClearButton(true);
  };

  // 처음 들어왔을 때 서버에 값이 있다면 gptLastLetter에는 서버에서 받은 값을 설정
  useEffect(() => {
    const receivedLastWordMessageFromServer =
      messages &&
      messages.length > 0 &&
      messages[messages.length - 1].content.slice(-1);

    !gptLastLetter && setGptLastLetter(receivedLastWordMessageFromServer);
  }, [messages]);

  useEffect(() => {
    setLoading(true);
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
            source={require('../../assets/animations/GreenBear.json')}
            style={styles.image}
            loop
            autoPlay
          />
        </View>
        <View style={styles.triangle}></View>
        <ScrollView style={styles.speechBubble}>
          {messages.map((message, index) => {
            if (message.sender == 'assistant') {
              //text gpt 대답 부분
              return (
                <View style={{flex: 1, flexDirection: 'column'}}>
                  <View style={{flex: 1, backgroundColor: 'red'}}></View>
                  <View key={index} style={styles.assistantMessageContainer}>
                    <Text style={styles.assistantMessage}>
                      {message.content}
                    </Text>
                  </View>
                  <View style={{flex: 1, backgroundColor: 'blue'}}></View>
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
