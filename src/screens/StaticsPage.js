import React, { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  Alert,
  SafeAreaView,
  ActivityIndicator,
} from 'react-native';
import authClient from '../apis/authClient';
import Footer from '../components/footer';
import { BarChart } from 'react-native-chart-kit';
import {ArrowLeftIcon} from 'react-native-heroicons/solid';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

export default function StaticsPage({ navigation }) {
  const [showFrequentResult, setShowFrequentResult] = useState(false);
  const [showDangerResult, setShowDangerResult] = useState(false);
  const [frequentKeywords, setFrequentKeywords] = useState([]);
  const [dangerKeywords, setDangerKeywords] = useState([]);
  const [isLoadingFrequent, setIsLoadingFrequent] = useState(false);
  const [isLoadingDanger, setIsLoadingDanger] = useState(false);
  const [selectedDangerKeyword, setSelectedDangerKeyword] = useState(null);

  const toggleResult = (content) => {
    setShowFrequentResult(content === '자주 대화한 내용');
    setShowDangerResult(content === '위험 의심 내용');

    if (content === '자주 대화한 내용') {
      fetchFrequentKeywords();
    } else if (content === '위험 의심 내용') {
      fetchDangerKeywords();
    }
  };

  // 자주 등장한 키워드
  const fetchFrequentKeywords = async () => {
    setIsLoadingFrequent(true);
    try {
      const res = await authClient({
        method: 'get',
        url: '/counseling/most-frequent',
      });
      console.log(res.data);
      const keywords = res.data;
      setFrequentKeywords(keywords);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoadingFrequent(false);
    }
  };

  // 위험 의심 키워드
  const fetchDangerKeywords = async () => {
    setIsLoadingDanger(true);
    try {
      const res = await authClient({
        method: 'get',
        url: '/counseling/dangerous-keyword',
      });
      console.log(res.data);
      const keywords = res.data.dangerousContent || [];
      setDangerKeywords(keywords);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoadingDanger(false);
    }
  };

  // 막대 그래프 데이터 설정
  const frequentChartData = {
    labels: frequentKeywords.map((item) => item.keyword),
    datasets: [
      {
        data: frequentKeywords.map((item) => item.count),
      },
    ],
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.topBar}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}>
         <ArrowLeftIcon size={wp('6%')} color="white" />
        </TouchableOpacity>
      </View>
      <View style={styles.titleContainer}>
        <Text style={styles.titleText}>
          대화했던 내용들의 키워드를 확인해봐!
        </Text>
      </View>

      <View style={styles.buttonContainer}>
        <View style={styles.buttonWrapper}>
          <TouchableOpacity
            style={styles.startButton}
            onPress={() => toggleResult('자주 대화한 내용')}>
            <Text style={styles.startStoryText}>💬 자주 대화한 내용 💬</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.buttonWrapper}>
          <TouchableOpacity
            style={styles.startButton}
            onPress={() => toggleResult('위험 의심 내용')}>
            <Text style={styles.startStoryText}>💥 위험 의심 내용💥</Text>
          </TouchableOpacity>
        </View>
      </View>

      {showFrequentResult && (
        <View style={styles.chartContainer}>
        <BarChart
          data={frequentChartData}
          width={wp('90%')}
          height={hp('22%')} 
          yAxisSuffix="회" 
          yAxisInterval={10} 
          fromZero={true} 
          chartConfig={{
            backgroundGradientFrom: 'white',
            backgroundGradientTo: 'white',
            decimalPlaces: 1,
            color: (opacity = 0.3) => `rgba(255, 87, 166, ${opacity})`,
            barPercentage: 0.8, 
          }}
          style={{
            borderRadius: 10, 
            
          }}
        />
        </View>
      )}
      
      {showDangerResult && (
        <>
        {selectedDangerKeyword && (
          <View style={styles.dangerKeywordContentBox}>
            <Text style={styles.dangerKeywordContentTitle}>
              KeyWord: {selectedDangerKeyword.keyword}
            </Text>
            <Text>{selectedDangerKeyword.content.join(', ')}</Text>
          </View>
        )}
        </>
      )}

      <ScrollView style={styles.resultBox}>
        {showFrequentResult && (
          <>
            {isLoadingFrequent ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="red" />
              </View>
            ) : (
              frequentKeywords.map((item, index) => (
                <View key={index} style={styles.frequentKeywordBox}>
                  <Text>집계 횟수: {item.count}회</Text>
                  <Text>키워드: {item.keyword}</Text>
                </View>
              ))
            )}
          </>
        )}

        {showDangerResult && (
          <>
            {isLoadingDanger ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="red" />
              </View>
            ) : (
              dangerKeywords.map((item, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.dangerKeywordBox}
                  onPress={() => setSelectedDangerKeyword(item)}
                >
                  <Text>키워드: {item.keyword}</Text>
                  <Text>집계 횟수: {item.count}회</Text>
                </TouchableOpacity>
              ))
            )}
            
          </>
        )}
      </ScrollView>
      <Footer />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFD2E0',
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: wp(3),
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 20,
  },
  buttonWrapper: {
    flex: 1,
    marginHorizontal: 10,
    paddingBottom: 5,
  },
  startButton: {
    width: wp('45%'), 
    height: 40, 
    backgroundColor: '#FF81C0', 
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 15, 
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  startStoryText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16, 
  },
  resultBox: {
    backgroundColor: 'white',
    flex: 1,
    width: '90%',
    padding: 20,
    marginTop: 20,
    marginBottom: 20,
    borderRadius: 10,
    
  },
  chartContainer: {
    paddingTop: 20, // 상단 여백 추가
    alignItems: 'center',
    borderRadius: 30, 
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  dangerKeywordBox: {
    alignItems: 'center',
    backgroundColor: '#FFC3A0',
    paddingHorizontal: 10,
    paddingVertical: 8, 
    margin: 10,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  frequentKeywordBox: {
    alignItems: 'center',
    backgroundColor: '#FFC3A0',
    paddingHorizontal: 10,
    paddingVertical: 8, 
    margin: 10,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  dangerKeywordContentBox: {
    backgroundColor: 'white',
    padding: 20, 
    width: '90%',
    marginTop: 20,
    marginBottom: 10,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  dangerKeywordContentTitle: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 10, 
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backButtonContainer: {
    justifyContent: 'flex-start',
    width: wp(10),
    marginTop: wp(6.4),
    right: wp(3),
  },
  backButton: {
    backgroundColor: '#1E2B22',
    padding: wp('1%'),
    borderTopRightRadius: wp('5%'),
    borderBottomLeftRadius: wp('5%'),
    marginLeft: wp('2%'),
  },
  titleContainer: {
    alignItems: 'center',
  },
  titleText: {
    fontWeight: 'bold',
    paddingTop: 10,
    fontSize: 20, 
    color: 'black', 
  },
});
