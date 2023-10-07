import React, { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { View, Text, StyleSheet, Image, TouchableOpacity, TextInput, ScrollView, Alert, SafeAreaView , ActivityIndicator} from 'react-native';
import authClient from '../apis/authClient';
import Footer from '../components/footer';
import { BarChart } from 'react-native-chart-kit';

export default function StaticsPage({ navigation }) {
  const [showFrequentResult, setShowFrequentResult] = useState(true);
  const [showDangerResult, setShowDangerResult] = useState(false);
  const [frequentKeywords, setFrequentKeywords] = useState([]);
  const [dangerKeywords, setDangerKeywords] = useState([]);
  const [isLoadingFrequent, setIsLoadingFrequent] = useState(false);
  const [isLoadingDanger, setIsLoadingDanger] = useState(false);
  const [selectedDangerKeyword, setSelectedDangerKeyword] = useState(null);

  const toggleResult = (content) => {
    setShowFrequentResult(false);
    setShowDangerResult(false);

    if (content === '자주 대화한 내용') {
      fetchFrequentKeywords();
      setShowFrequentResult(true);
    } else if (content === '위험 의심 내용') {
      fetchDangerKeywords();
      setShowDangerResult(true);
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
      <Text style={{ fontWeight: 'bold', fontSize: 20, paddingTop: 30 }}>
        대화했던 내용들의 통계를 볼 수 있어요!
      </Text>

      <View style={styles.buttonContainer}>
        <View style={styles.buttonWrapper}>
          <TouchableOpacity
            style={styles.startButton}
            onPress={() => toggleResult('자주 대화한 내용')}>
            <Text style={styles.startStoryText}>자주 대화한 내용</Text>
            
          </TouchableOpacity>
        </View>
        <View style={styles.buttonWrapper}>
          <TouchableOpacity
            style={styles.startButton}
            onPress={() => toggleResult('위험 의심 내용')}>
            <Text style={styles.startStoryText}>위험 의심 내용</Text>
            
          </TouchableOpacity>
        </View>
      </View>

      {/* 자주 대화한 내용 막대 그래프 */}
      {showFrequentResult && (
        <ScrollView style={styles.resultBox}>
          {isLoadingFrequent ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="green" />
            </View>
          ) : (
            <>
              <BarChart
                data={frequentChartData}
                width={300}
                height={200}
                yAxisSuffix=""
                yAxisInterval={1}
                chartConfig={{
                  backgroundColor: 'white',
                  backgroundGradientFrom: 'white',
                  backgroundGradientTo: 'white',
                  decimalPlaces: 0, // 소수점 없애기
                  color: (opacity = 1) => `rgba(50, 100, 10, ${opacity})`,
                }}
              />
              {frequentKeywords.map((item, index) => (
                <View key={index} style={styles.frequentKeywordBox}>
                  <Text>집계 횟수: {item.count}회</Text>
                  <Text>키워드: {item.keyword}</Text>
                </View>
              ))}
            </>
          )}
        </ScrollView>
      )}

      {/* 위험 의심 키워드 */}
      {showDangerResult && (
        <ScrollView style={styles.resultBox}>
          {isLoadingDanger ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="green" />
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
          {selectedDangerKeyword && (
            <View style={styles.dangerKeywordContentBox}>
              <Text style={styles.dangerKeywordContentTitle}>
                Content: {selectedDangerKeyword.keyword} 
              </Text>
              <Text>{selectedDangerKeyword.content.join(', ')}</Text>
            </View>
          )}
        </ScrollView>
      )}
      <Footer />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FAF1E4',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  buttonWrapper: {
    flex: 1,
    marginHorizontal: 10,
  },
  startButton: {
    width: '100%',
    height: 40,
    backgroundColor: '#1E2B22',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 15,
  },
  startStoryText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 18,
  },
  chartContainer: {
    marginTop: 20,
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
  dangerKeywordBox: {
    alignItems: 'center',
    backgroundColor: '#B0D9B1',
    paddingHorizontal: 10,
    paddingVertical: 5,
    margin: 10,
    borderRadius: 20,
  },
  frequentKeywordBox: {
    alignItems: 'center',
    backgroundColor: '#B0D9B1',
    paddingHorizontal: 10,
    paddingVertical: 5,
    margin: 10,
    borderRadius: 20,
  },
  dangerKeywordContentBox: {
    backgroundColor: '#D4EDDA',
    padding: 10,
    marginTop: 10,
    borderRadius: 10,
  },
  dangerKeywordContentTitle: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
