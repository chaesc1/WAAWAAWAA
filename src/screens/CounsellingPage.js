import {
  Alert,
  Image,
  Modal,
  Pressable,
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
import Features from '../components/feature';
import Voice from '@react-native-voice/voice';
import {apiCall} from '../api/OpenAI';
import Tts from 'react-native-tts';
import authClient from '../apis/authClient';
import Lottie from 'lottie-react-native';
import {ArrowLeftIcon} from 'react-native-heroicons/solid';
Tts.requestInstallData();

export default CounsellingRe = ({navigation}) => {
  const [messages, setMessages] = useState([]);
  const [result, setResult] = useState();
  const [recording, setRecording] = useState(recording);
  const [loading, setLoading] = useState(false);
  const [speaking, setSpeaking] = useState(false);
  const [hideClearButton, setHideClearButton] = useState(false);
  const scrollViewRef = useRef();
  const [modalVisible, setModalVisible] = useState(false);

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
      Alert.alert('채팅 내역 지우기 성공');
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
      <Image
        blurRadius={40}
        source={require('../../assets/images/simple.jpg')}
        style={styles.backgroundImage}
      />
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          Alert.alert('Modal has been closed.');
          setModalVisible(!modalVisible);
        }}>
        <View style={styles.centeredView}>
          <View style={styles.modalContainer}>
            <View style={styles.modalView}>
              <Text style={styles.modalText}>상담 리스트</Text>
              <Pressable
                style={[styles.button, styles.buttonClose]}
                onPress={() => setModalVisible(!modalVisible)}>
                <Text style={styles.textStyle}>X</Text>
              </Pressable>
            </View>
            <ScrollView style={{width: '100%', maxHeight: hp('40%')}}>
              {messages.map((message, index) => {
                if (message.sender == 'assistant') {
                  //text gpt 대답 부분
                  return (
                    <View
                      key={index}
                      style={{flex: 1, flexDirection: 'column'}}>
                      <View style={{flex: 1, backgroundColor: 'red'}}></View>
                      <View
                        key={index}
                        style={styles.assistantMessageContainer}>
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
          </View>
        </View>
      </Modal>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.backButtonContainer}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backButton}>
            <ArrowLeftIcon size={wp('6%')} color="white" />
          </TouchableOpacity>
          <Text style={styles.pageTitle}>상담</Text>
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
                {messages
                  .filter(message => message.sender === 'assistant')
                  .pop()?.content ?? ''}
              </Text>
            </View>
          </ScrollView>
        </View>
      </SafeAreaView>
      {/* 녹음 , clear, 정지 버튼 */}
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
        }}>
        <TextInput
          value={result}
          placeholder="적어서도 보내봐!!"
          style={styles.textContainer}
          onChangeText={text => setResult(text)}
        />
        <TouchableOpacity
          style={styles.button}
          onPress={() => setModalVisible(true)}>
          <Image
            source={require('../../assets/images/file.png')}
            style={styles.textStyle}></Image>
        </TouchableOpacity>
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

export const styles = StyleSheet.create({
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
    width: wp(70),
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
    top: 10,
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
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  modalContainer: {
    width: wp('90%'),
    margin: 20,
    backgroundColor: '#BFE5E9',
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    gap: 10,
  },
  modalView: {
    width: wp('90%'),
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingLeft: 20,
  },
  storyList: {
    gap: 10,
    paddingVertical: 5,
    width: '100%',
    borderBottom: '#000',
    borderBottomWidth: 1,
    textAlign: 'left',
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  buttonClose: {
    backgroundColor: 'transparent',
  },
  textStyle: {
    width: 30,
    height: 30,
  },
  modalText: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
