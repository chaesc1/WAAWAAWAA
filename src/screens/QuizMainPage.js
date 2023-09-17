import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  TextInput,
} from 'react-native';
import axios from 'axios';
import Footer from '../components/footer';
import config from '../../config/index'; // OpenAI API 키를 포함하는 파일

const apiUrl = 'https://api.openai.com/v1/chat/completions';

const QuizMainPage = ({navigation, route}) => {
  const [inputValue, setInputValue] = useState(route.params.inputValue);
  const [quizQuestion, setQuizQuestion] = useState('');
  const [isLoading, setLoading] = useState(false);
  const [quizQuestions, setQuizQuestions] = useState([]);
  const [result, setResult] = useState('');
  const [isAnswerCorrect, setAnswerCorrect] = useState(false); // 정답 맞는지 여부 추가

  const generateQuizQuestion = async () => {
    setLoading(true);
    console.log(inputValue);
    try {
      const response = await axios.post(
        apiUrl,
        {
          model: 'gpt-3.5-turbo',
          messages: [
            {
              role: 'user',
              content: inputValue + '퀴즈 1개 내줘',
            },
          ],

          temperature: 0.9,
          n: 1, // 생성할 퀴즈 개수
        },
        {
          headers: {
            Authorization: `Bearer ${config.OPENAI_API_KEY}`,
            'Content-Type': 'application/json',
          },
        },
      );
      console.log('data : ', response.data.choices[0].message);
      const generatedQuestions = response.data.choices.map(choice =>
        choice.message.content.trim(),
      );
      setQuizQuestions(generatedQuestions);
      // console.log('API Response:', response.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const checkAnswer = () => {
    if (quizQuestions.includes(result)) {
      setAnswerCorrect(true);
    } else {
      setAnswerCorrect(false);
    }
  };

  useEffect(() => {
    generateQuizQuestion();
  }, []);

  return (
    <View style={styles.container}>
      <SafeAreaView>
        <Text style={styles.headingText}>퀴즈 출제</Text>
        <View style={styles.quizContainer}>
          {isLoading ? (
            <Text>Loading...</Text>
          ) : (
            <>
              {quizQuestions.map((question, index) => (
                <Text key={index} style={styles.quizQuestion}>
                  {question}
                </Text>
              ))}
            </>
          )}
          <TouchableOpacity
            style={styles.generateButton}
            onPress={generateQuizQuestion}>
            <Text style={styles.buttonText}>새로운 퀴즈 생성</Text>
          </TouchableOpacity>
          <TextInput
            style={styles.searchInput}
            placeholder="정답을 입력하세요"
            onChangeText={text => setResult(text)}
            onSubmitEditing={checkAnswer} // 입력 후 엔터를 누르면 정답 체크
          />
        </View>
      </SafeAreaView>
      <Footer/>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#F3E99F',
  },
  headingText: {
    marginBottom: 26,
    fontWeight: 'bold',
    fontSize: 26,
    alignSelf: 'center',
  },
  quizContainer: {
    alignItems: 'center',
  },
  quizQuestion: {
    marginBottom: 20,
    fontSize: 18,
    textAlign: 'center',
  },
  generateButton: {
    backgroundColor: 'purple',
    padding: 8,
    borderRadius: 4,
    marginBottom: 10,
  },
  startButton: {
    backgroundColor: 'purple',
    padding: 8,
    borderRadius: 4,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  searchInput: {
    width: 250,
    height: 40,
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: -39,
    alignSelf: 'center',
  },
});

export default QuizMainPage;
