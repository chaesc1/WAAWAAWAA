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
  Modal,
  Pressable,
} from 'react-native';
import Voice from '@react-native-voice/voice';
import Tts from 'react-native-tts'; //TTS Library
import {ArrowLeftIcon} from 'react-native-heroicons/solid';
import Lottie from 'lottie-react-native';

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

const StoryPage = ({navigation}) => {
  const [messages, setMessages] = useState([]);
  const [result, setResult] = useState();
  const [recording, setRecording] = useState(recording);
  const [loading, setLoading] = useState(false);
  const [speaking, setSpeaking] = useState(false);
  const [answerCount, setAnswerCount] = useState(0);
  const [book, setBook] = useState(0);
  const [modalVisible, setModalVisible] = useState(false);

  const startTextToSpeech = message => {
    setSpeaking(true);
    if (!message.includes('https')) {
      Tts.getInitStatus().then(() => {
        Tts.speak(message, {
          iosVoiceId: 'com.apple.ttsbundle.Yuna-compact',
          rate: 0.5,
        });
      });
    }

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
      '옛날에 수연이라는 꼬마 곰돌이가 살았어요',
      '수연이의 배에서 꼬르륵 소리가 났어요',
      '아이 배고파 먹을 거 없나',
      '수연이는 냉장고를 열어봤지만 텅 비어있었어요',
      '귀찮아서 사과를 따오지 않았기 때문이에요',
      '심심해진 수연이는 좋아하는 곰돌이 친구 준성이에게 전화했어요',
      '나 심심한데 오늘 우리집에서 놀래',
      '으잉 너네집에서',
      '응 같이 사과 먹자',
      '좋아',
      '수연이는 열심히 집을 치우고 꽃단장을 했어요',
      '똑똑똑 수연아 나야',
      '어서와 우리 뭐하고 놀까',
      '같이 사과 먹자며',
      '수연이는 텅 빈 냉장고가 떠올랐어요',
      '어쩌지 사과가 없는 것을 깜빡했어',
      '그럼 다음에 올게 안녕',
      '수연이는 슬퍼서 엉엉 울었어요',
      '진작 사과 따놓을 걸',
      '그 날부터 수연이는 미루지 않고 꼬박꼬박 사과를 따러 갔답니다',
    ],
    // [
    //   '옛날에 채연이라는 꼬마 펭귄이 살았어요',
    //   '꼬마 펭귄 채연이는 저녁 밥으로 물고기를 먹고있었어요',
    //   '마침 채연이의 집을 지나가던 예림이는 군침을 삼켰어요',
    //   '와 맛있겠다',
    //   '나 혼자 먹기에 많은데 조금 나눠줄까',
    //   '정말 고마워',
    //   '채연이는 예림이에게 물고기를 나눠주고 다시 식사를 시작했어요',
    //   '그 때 창 밖에서 꼬르륵 소리가 들렸어요',
    //   '거기 누구야',
    //   '나 수연이야 너무 배고파',
    //   '그럼 내 물고기를 나눠줄게',
    //   '와 맛있겠다 고마워',
    //   '채연이는 수연이에게도 물고기를 나눠주고 다시 식사를 시작했어요',
    //   '킁킁 어디서 물고기 냄새가 나는데',
    //   '정훈아 안녕 물고기 먹고싶니',
    //   '응 같이 먹어도 돼?',
    //   '물론',
    //   '다음 날 채연이는 머리가 아파서 물고기를 잡으러 갈 수 없었어요',
    //   '아이고 머리야 배도 고파 으앙',
    //   '똑똑똑 누구세요',
    //   '채연아 괜찮아',
    //   '펭귄 마을 친구들이 물고기를 잡아서 병문안을 왔어요',
    //   '모두가 사이좋게 물고기를 나눠먹었답니다',
    // ],
  ];

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
              <Text style={styles.modalText}>이야기 리스트</Text>
              <Pressable
                style={[styles.button, styles.buttonClose]}
                onPress={() => setModalVisible(!modalVisible)}>
                <Text style={styles.textStyle}>X</Text>
              </Pressable>
            </View>
            <ScrollView style={{width: '100%', maxHeight: hp('40%')}}>
              {storyMessage[book].slice(0, answerCount).map((story, i) => {
                return (
                  <View style={styles.storyList}>
                    <Text style={styles.storyText} key={i}>
                      {story}
                    </Text>
                  </View>
                );
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
          <Text style={styles.pageTitle}>스토리</Text>
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
              <Text>{storyMessage[book][answerCount]} </Text>
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
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  modalContainer: {
    width: wp('90%'),
    margin: 20,
    backgroundColor: 'white',
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

export default StoryPage;
