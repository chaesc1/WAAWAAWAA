// 끝말잇기 페이지
import {
  Alert,
  Image,
  SafeAreaView,
  ScrollView,
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Pressable,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
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
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';

import {styles} from './CounsellingPage';
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
  const [modalVisible, setModalVisible] = useState(false);

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
    <KeyboardAwareScrollView
      contentContainerStyle={{flex: 1}}
      extraScrollHeight={20}>
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
                <Text style={styles.modalText}>끝말잇기 리스트</Text>
                <Pressable
                  style={[styles.button, styles.buttonClose]}
                  onPress={() => setModalVisible(!modalVisible)}>
                  <Text style={styles.textStyle}>X</Text>
                </Pressable>
              </View>
              <ScrollView style={{width: '100%', maxHeight: hp('40%')}}>
                {messages.map((message, index) => {
                  if (message.sender == 'assistant') {
                    return (
                      <View style={{flex: 1, flexDirection: 'column'}}>
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
            <Text style={styles.pageTitle}>끝말잇기</Text>
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
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
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
