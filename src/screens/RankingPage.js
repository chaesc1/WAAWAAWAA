import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import authClient from '../apis/authClient';
import { ArrowLeftIcon } from 'react-native-heroicons/solid';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import noAuthClient from '../apis/noAuthClient';
import LottieView from 'lottie-react-native';

const RankingPage = ({ navigation }) => {
  const [rankingData, setRankingData] = useState([]);

  useEffect(() => {
    fetchRankingData();
  }, []);

  const fetchRankingData = async () => {
    try {
      const res = await noAuthClient({
        method: 'get',
        url: '/memory-game/ranking',
      });

      // 정렬된 랭킹 데이터를 사용하여 상위 3명만 선택
      const sortedRankingData = res.data.sort((a, b) => b.score - a.score);
      const top3Ranking = sortedRankingData.slice(0, 3);

      setRankingData(top3Ranking);
    } catch (error) {
      console.log(error);
    }
  }

  const getMedalIcon = (index) => {
    if (index === 0) {
      return '🥇'; 
    } else if (index === 1) {
      return '🥈'; 
    } else if (index === 2) {
      return '🥉'; 
    } else {
      return ''; // 그 외 순위
    }
  }

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
          source={require('../../assets/animations/Ranking.json')}
          style={styles.image}
          autoPlay
          loop
        />
        <Text style={styles.pageTitle}>우리 작은 슈퍼스타들의 순위</Text>
      </View>

      <View style={styles.rankingHeader}>
        {rankingData.map((user, index) => (
          <View key={index} style={styles.rankingItem}>
            <View style={styles.medalContainer}>
              <Text style={styles.medal}>{getMedalIcon(index)}</Text>
            </View>
            <View style={styles.userInfo}>
              <Text style={styles.userName}>
                {user.username}
              </Text>
              <Text style={styles.userScore}>
                {`${user.score}점`}
              </Text>
            </View>
          </View>
        ))}
      </View>
      <View style={styles.gameButton}>
        <TouchableOpacity onPress={() => navigation.navigate('MemoryGame')}>
          <Text style={styles.buttonText}>1등을 쟁취하러 가볼까?</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#D8E4E5',
  },
  backButtonContainer: {
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
  rankingHeader: {
    flexDirection: 'column',
    marginBottom: hp('5%'),
  },
  rankingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 10,
    marginTop: hp('3%'),
    justifyContent: 'space-between',
  },
  medalContainer: {
    marginRight: 10,
  },
  medal: {
    fontSize: 50,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  userScore: {
    fontSize: 18,
  },
  profileContainer: {
    flexDirection: 'column',
    alignItems: 'center',
    marginBottom: 20,
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 20,
    marginTop: hp(3),
  },
  image: {
    width: 150,
    height: 150,
    //marginBottom: 10,
  },
  pageTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  gameButton: {
    backgroundColor: 'skyblue',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
  },
});

export default RankingPage;
