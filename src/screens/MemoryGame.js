import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import authClient from '../apis/authClient';
import { ArrowLeftIcon } from 'react-native-heroicons/solid';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import LottieView from 'lottie-react-native';

const MemoryGame = ({ navigation }) => {
  const [gameBoard, setGameBoard] = useState([]);
  const [answer, setAnswer] = useState([]);
  const [selectedTiles, setSelectedTiles] = useState([]);
  const [score, setScore] = useState(0);
  const [isGameStarted, setIsGameStarted] = useState(false);
  

  const gameStart = async () => {
    try {
      const res = await authClient({
        headers: {
          count: Number(3),
        },
        method: 'get',
        url: '/memory-game',
      });
      console.log(res.data);
      setAnswer(res.data);
      setIsGameStarted(true);
      setSelectedTiles([]);
  
      // 정답을 표시하고 1초 후에 숨기기 위한 타이머 설정
      setTimeout(() => {
        setAnswer([]); // 정답을 숨김
      }, 500);
    } catch (error) {
      console.log(error);
    }
  }
  

  const updateScore = async () => {
    try {
      const res = await authClient({
        method: 'post',
        url: '/memory-game',
        data: { score },
      });
      console.log(res.data);
    } catch (error) {
      console.log(error);
    }
  }

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

  const checkAnswer = () => {
    console.log(selectedTiles);
    if (JSON.stringify(selectedTiles) === JSON.stringify(answer)) {
      console.log('정답입니다!');
      setScore(score + 1);
    } else {
      console.log('틀렸습니다. 다시 시도하세요.');
    }
    gameStart();
  };

  const saveScore = async () => {
    try {
      await updateScore();
      console.log('스코어가 저장되었습니다.');
    } catch (error) {
      console.log('스코어 저장에 실패했습니다.');
    }
  };

  return (
    <View style={styles.container}>
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
                  selectedTiles.some((tile) => tile[0] === rowIndex && tile[1] === colIndex) && styles.selectedTile,
                  answer.length > 0 && answer.some((ans) => ans[0] === rowIndex && ans[1] === colIndex) && styles.answerTile, // 정답 좌표에 해당하는 타일 스타일 적용
                ]}
                onPress={() => handleTileClick(rowIndex, colIndex)}
              >
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
          <TouchableOpacity style={styles.saveButton} onPress={saveScore}>
            <Text style={styles.buttonText}>스코어 저장하기</Text>
          </TouchableOpacity>
        </View>
        
        
      </View>
      <View style={styles.cautionContainer}>
        <Text style={styles.cautionTitle}>🚨주의사항 및 규칙🚨</Text>
        <Text style={styles.caution}>규칙</Text></View>
      
      
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#FFD2E0',
  },
  backButtonContainer: {
    justifyContent: 'flex-start',
    width: wp(10),
    marginTop: wp(2),
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
    marginTop: hp(3),
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
    //marginTop: hp(3),
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
  answerTile: {
    backgroundColor: 'lightgreen', // 정답 좌표에 해당하는 타일을 다르게 스타일링
  },  
  selectedTile: {
    backgroundColor: 'lightblue',
  },
  tileText: {
    fontSize: 16,
  },
  ButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    //marginTop: 20,
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
    backgroundColor: 'skyblue',
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
    marginTop: 20,
  },
  cautionContainer: {
    backgroundColor: 'white',
    flex: 1,
    flexDirection: 'row',
    height: 100,
    borderRadius: 30,
  },
 
  cautionTitle: {
    fontSize: 20, 
    fontWeight: 'bold',
    marginBottom: 10, 
  },
  caution: {
    fontSize: 16,
  },

});

export default MemoryGame;
