// 좌표 던지는 거 받아서 맞추는 게임
import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Touchable } from 'react-native';
import axios from 'axios';
import { Card } from 'react-native-elements';
import authClient from '../apis/authClient';
import {ArrowLeftIcon} from 'react-native-heroicons/solid';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
const MemoryGame = ({navigation}) => {
  const [gameBoard, setGameBoard] = useState([]);
  const [answer, setAnswer] = useState([]);
  const [selectedTiles, setSelectedTiles] = useState([]);

  // 게임 시작 api
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
    } catch (error) {
      console.log(error);
    }
  }

  // 게임 점수 등록 api
  const updateScore = async () => {
    try {
      const res = await authClient({
        method:'get',
        url:'/memory-game',
        data: score,
      });
      console.log(res.data);
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    // 게임 보드 초기화
    const board = Array(3).fill(Array(3).fill(0));
    setGameBoard(board);
  }, []);

  const handleTileClick = (row, col) => {
    setSelectedTiles([...selectedTiles, [row, col]]);
  };

  const checkAnswer = () => {
    // 사용자의 선택과 정답을 비교
    if (JSON.stringify(selectedTiles) === JSON.stringify(answer)) {
      console.log('정답입니다!');
      // 게임 통과
    } else {
      console.log('틀렸습니다. 다시 시도하세요.');
      // 게임 재시작 또는 오류 메시지 표시
    }
    setSelectedTiles([]); // 선택 초기화
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
      <Text style={styles.title}>기억력 게임</Text>
      <View style={styles.gameBoard}>
        {gameBoard.map((row, rowIndex) => (
          <View style={styles.row} key={rowIndex}>
            {row.map((_, colIndex) => (
              <TouchableOpacity
                key={colIndex}
                style={[
                  styles.tile,
                  selectedTiles.some((tile) => tile[0] === rowIndex && tile[1] === colIndex) && styles.selectedTile
                ]}
                onPress={() => handleTileClick(rowIndex, colIndex)}
              >
                <Text>눌려!</Text>
              </TouchableOpacity>
            ))}
          </View>
        ))}
      </View>
      <View style={styles.ButtonContainer}>
      
      <TouchableOpacity style={styles.resetButton} onPress={gameStart}>
        <Text>시작!</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.checkButton} onPress={checkAnswer}>
        <Text>결과 확인!</Text>
      </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white'
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
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
  gameBoard: {
    borderWidth: 1,
    borderColor: 'black',
    width: 200,
  },
  row: {
    flexDirection: 'row',
    
  },
  tile: {
    width: 60,
    height: 60,
    borderWidth: 1,
    borderColor: 'black',
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectedTile: {
    backgroundColor: 'lightblue',
  },
  checkButton: {
    marginTop: 20,
    backgroundColor: 'skyblue',
    padding: 10,
    borderRadius: 5,
    marginLeft: 10,
  },
  resetButton: {
    marginTop: 20,
    backgroundColor: 'green',
    padding: 10,
    borderRadius: 5,
    
  },
  ButtonContainer : {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 20,
  }
});

export default MemoryGame;