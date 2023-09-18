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
  const [showResult, setShowResult] = useState(false);
  const [resultContent, setResultContent] = useState('');
  const [isLoading, setIsLoading] = useState(false) // API 요청 중인지 여부 판단 상태

  const toggleResult = (content) => {
    setShowResult(!showResult);
    setResultContent(content);

    if (content === '자주 대화한 내용') {
      fetchFrequentKeywords();
    } else if (content === '위험 의심 내용') {
      fetchDangerKeywords();
    }
      
  };

   // 자주 등장한 키워드
   const fetchFrequentKeywords = async () => {
    setIsLoading(true);
    try {
      const res = await authClient({
        method: 'get',
        url: '/counseling/most-frequent',
      });
      console.log(res.data);
      const keywords = res.data;
      setResultContent(keywords.join(', ')); // API 결과를 문자열로 변환하여 상태에 저장
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

   // 위험 의심 키워드
   const fetchDangerKeywords = async () => {
    setIsLoading(true);
    try {
      const res = await authClient({
        method: 'get',
        url: '/counseling/dangerous-keyword',
      });
      console.log(res.data);
      const keywords = res.data;
      setResultContent(keywords.join(', ')); // API 결과를 문자열로 변환하여 상태에 저장
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
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

      <View style={styles.resultBox}>
      {/* api 요청에 따른 결과를 노출시킬 공간입니다. */}
      {isLoading? (
        <Text>Loading...</Text>
      ) : (<Text>{resultContent}</Text>)}
      
        
        
      </View>
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
    flex: 1, // 화면의 남은 공간을 모두 차지하도록 함
    width: '90%', // 화면 너비의 90%를 차지하도록 설정
    padding: 20,
    marginTop: 20,
    marginBottom: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
});
