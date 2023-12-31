import React, {useState, useEffect} from 'react';
import {Alert} from 'react-native';

import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import authClient from '../apis/authClient';
import {ArrowLeftIcon} from 'react-native-heroicons/solid';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import LottieView from 'lottie-react-native';

const MemoryGame = ({navigation}) => {
  const [gameBoard, setGameBoard] = useState([]);
  const [hint, setHint] = useState([]);
  const [answer, setAnswer] = useState([]);
  const [selectedTiles, setSelectedTiles] = useState([]);
  const [score, setScore] = useState(0);
  const [isGameStarted, setIsGameStarted] = useState(false);
  const [showHint, setShowHint] = useState(false);

  const gameStart = async () => {
    try {
      const res = await authClient({
        headers: {
          count: Number(3),
        },
        method: 'get',
        url: '/memory-game',
      });
      console.log('server data:', res.data);
      setAnswer(res.data);
      setHint(res.data); // 힌트로 표시
      setIsGameStarted(true);
      setSelectedTiles([]);
      setShowHint(true);

      // 0.5초 후에 힌트를 초기화
      setTimeout(() => {
        setShowHint(false);
        setHint([]);
      }, 200);
    } catch (error) {
      console.log(error);
    }
  };

  const updateScore = async () => {
    try {
      const res = await authClient({
        method: 'post',
        url: '/memory-game',
        data: {score},
      });
      console.log(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const board = Array(3).fill(Array(3).fill(0));
    setGameBoard(board);
  }, []);

  const handleTileClick = (row, col) => {
    if (isGameStarted) {
      if (selectedTiles.length < 3) {
        setSelectedTiles([...selectedTiles, [row, col]]);
      }
    }
  };

  const checkAnswer = async () => {
    console.log('서버에서 받은 정답:', answer);
    console.log('내가 선택한 값:', selectedTiles);

    // 정답 배열과 사용자 선택 배열을 1차원 배열로 변환하여 정렬
    const flatAnswer = answer.flat().sort();
    const flatSelectedTiles = selectedTiles.flat().sort();

    // 배열 내의 요소와 위치까지 비교
    const isAnswerCorrect = flatAnswer.every(
      (tile, index) => tile === flatSelectedTiles[index],
    );

    // 사용자가 3칸을 선택하지 않거나, 정답이 아닌 경우 처리
    if (selectedTiles.length !== 3 || !isAnswerCorrect) {
      Alert.alert('다시 선택해봐!', undefined, [
        {text: '확인', onPress: () => setTimeout(gameStart)},
      ]);
    } else {
      // 정답일 경우
      setScore(prevScore => prevScore + 1);
      Alert.alert('잘했어! 스코어 +1! 👍🏻', undefined, [
        {text: '확인', onPress: () => setTimeout(gameStart)},
      ]);
    }

  };

  const saveScore = async () => {
    // 게임이 진행 중인 경우에만 확인 창을 띄웁니다.
    if (isGameStarted) {
      Alert.alert(
        '게임 종료',
        '정말 게임을 그만할거야?🥲',
        [
          {
            text: '아니! ',
            style: 'cancel',
          },
          {
            text: '응!',
            onPress: async () => {
              try {
                await updateScore();

                Alert.alert('스코어가 저장되었어!!💯');
                navigation.navigate('MyPage');
              } catch (error) {
                console.log(error);
              }
            },
          },
        ],
        {cancelable: false},
      );
    } else {
      // 게임이 진행 중이 아니면 바로 저장
      await updateScore();
      Alert.alert('스코어가 저장되었습니다!');
      navigation.navigate('MyPage');
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.backButtonContainer}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}>
          <ArrowLeftIcon size={wp('6%')} color="white" />
        </TouchableOpacity>
      </View>
      <View style={styles.profileContainer}>
        <LottieView
          source={require('../../assets/animations/Game.json')}
          style={styles.image}
          autoPlay
          loop
        />
      </View>

      <View style={styles.gameBoardContainer}>
        <View style={styles.gameBoard}>
          {gameBoard.map((row, rowIndex) => (
            <View style={styles.row} key={rowIndex}>
              {row.map((_, colIndex) => (
                <TouchableOpacity
                  key={colIndex}
                  style={[
                    styles.tile,
                    selectedTiles.some(
                      tile => tile[0] === rowIndex && tile[1] === colIndex,
                    ) && styles.selectedTile,
                    hint.length > 0 &&
                      hint.some(h => h[0] === rowIndex && h[1] === colIndex) &&
                      styles.hintTile,
                  ]}
                  onPress={() => handleTileClick(rowIndex, colIndex)}>
                  {isGameStarted && <Text style={styles.tileText}>눌려!</Text>}
                </TouchableOpacity>
              ))}
            </View>
          ))}
        </View>
        <Text style={styles.score}>현재 스코어: {score}</Text>
        <View style={styles.ButtonContainer}>
          {isGameStarted ? (
            <TouchableOpacity style={styles.checkButton} onPress={checkAnswer}>
              <Text style={styles.buttonText}>결과 확인</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity style={styles.startButton} onPress={gameStart}>
              <Text style={styles.buttonText}>시작</Text>
            </TouchableOpacity>
          )}
          {isGameStarted && (
            <TouchableOpacity style={styles.saveButton} onPress={saveScore}>
              <Text style={styles.buttonText}>스코어 저장하기</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
      <View style={styles.cautionContainer}>
        <Text style={styles.cautionTitle}>🚨주의사항 및 규칙🚨</Text>
        <Text style={styles.caution}>
          1️⃣ 스코어를 저장하지 않고 나가면 점수 저장이 안 돼요.
        </Text>
        <Text style={styles.caution}>2️⃣ 힌트는 다시 볼 수 없어요.</Text>
        <Text style={styles.caution}>3️⃣ 무조건 3칸을 선택해야해요.</Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: wp(5),
    backgroundColor: '#D8E4E5',
  },
  backButtonContainer: {
    justifyContent: 'flex-start',
    width: wp(10),
    marginTop: wp(7),
    right: wp(4.5),
  },
  backButton: {
    backgroundColor: '#1E2B22',
    padding: wp('1%'),
    borderTopRightRadius: wp('5%'),
    borderBottomLeftRadius: wp('5%'),
    marginLeft: wp('2%'),
  },
  profileContainer: {
    flexDirection: 'column',
    alignItems: 'center',
    marginBottom: 20,
    backgroundColor: 'white',
    //padding: 15,
    borderRadius: 20,
    //width: 50,
    marginTop: hp(2),
  },
  image: {
    width: 150,
    height: 150,
    //marginBottom: 10,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
  gameBoardContainer: {
    //flex: 1,
    alignItems: 'center',
    // backgroundColor: '#F4CE14',
    padding: 15,
    borderRadius: 20,
    marginBottom: hp(3),
  },
  pageTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  gameBoard: {
    width: '100%',
    aspectRatio: 1,
    borderWidth: 1,
    borderColor: 'black',
  },

  row: {
    flexDirection: 'row',
  },
  tile: {
    width: '33.33%',
    aspectRatio: 1,
    borderWidth: 1,
    borderColor: 'black',
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectedTile: {
    backgroundColor: 'lightblue',
  },
  hintTile: {
    backgroundColor: 'lightgreen',
  },
  tileText: {
    fontSize: 16,
  },
  ButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  startButton: {
    marginTop: 20,
    backgroundColor: 'green',
    padding: 10,
    borderRadius: 5,
  },
  checkButton: {
    marginTop: 20,
    backgroundColor: 'skyblue',
    padding: 10,
    borderRadius: 5,
    marginLeft: 10,
  },
  saveButton: {
    marginTop: 20,
    backgroundColor: 'blue',
    padding: 10,
    borderRadius: 5,
    marginLeft: 20,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
  },
  score: {
    fontSize: 18,
    marginTop: hp(2),
  },
  cautionContainer: {
    backgroundColor: 'white',
    flex: 1,
    flexDirection: 'column',
    height: hp(16),
    borderRadius: 30,
    marginBottom: hp(6.5),
    padding: 10,
  },

  cautionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  caution: {
    fontSize: 14,
    marginBottom: 10,
  },
});

export default MemoryGame;
