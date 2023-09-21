import React, { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Alert,
  SafeAreaView,
} from 'react-native';
import authClient from '../apis/authClient';
import Footer from '../components/footer';

export default function StaticsPage({ navigation }) {
  const [showFrequentResult, setShowFrequentResult] = useState(true);
  const [showDangerResult, setShowDangerResult] = useState(false);
  const [frequentKeywords, setFrequentKeywords] = useState([]);
  const [dangerKeywords, setDangerKeywords] = useState([]);
  const [isLoadingFrequent, setIsLoadingFrequent] = useState(false);
  const [isLoadingDanger, setIsLoadingDanger] = useState(false);

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
      const keywords = res.data.dangerousContent || [];
      setDangerKeywords(keywords);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoadingDanger(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={{ fontWeight: 'bold', fontSize: 20, paddingTop: 30 }}>
        어떤 주제로 대화를 많이 했을까요?
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

      {/* 자주 등장한 키워드 */}
      {showFrequentResult && (
        <ScrollView style={styles.resultBox}>
          {isLoadingFrequent ? (
            <Text>Loading...</Text>
          ) : (
            frequentKeywords.map((item, index) => (
              <View key={index} style={styles.keywordBox}>
                <Text>Count: {item.count}</Text>
                <Text>Keyword: {item.keyword}</Text>
              </View>
            ))
          )}
        </ScrollView>
      )}

      {/* 위험 의심 키워드 */}
      {showDangerResult && (
        <ScrollView style={styles.resultBox}>
          {isLoadingDanger ? (
            <Text>Loading...</Text>
          ) : (
            dangerKeywords.map((item, index) => (
              <View key={index} style={styles.keywordBox}>
                <Text>{item}</Text>
              </View>
            ))
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
  resultBox: {
    backgroundColor: 'white',
    flex: 1,
    width: '90%',
    padding: 20,
    marginTop: 20,
    marginBottom: 20,
    borderRadius: 10,
  },
  keywordBox: {
    backgroundColor: 'lightgray',
    paddingHorizontal: 10,
    paddingVertical: 5,
    margin: 5,
    borderRadius: 5,
  },
});