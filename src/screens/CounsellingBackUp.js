import {useState, useEffect} from 'react';
import {StyleSheet, Dimensions} from 'react-native';
import config from '../../config';
import Icon from 'react-native-vector-icons/FontAwesome5';
const apiUrl = 'https://api.openai.com/v1/chat/completions';

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

import axios from 'axios';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import {
  GiftedChat,
  Bubble,
  InputToolbar,
  LeftAction,
} from 'react-native-gifted-chat';

const ChatScreen = () => {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    // GPT가 먼저 말을 건네도록 초기 대화를 시작
    const startChat = async () => {
      const response = await sendMessage('안녕하세요');
      handleResponse(response);
    };

    startChat();
  }, []);

  const sendMessage = async message => {
    try {
      const response = await axios.post(
        apiUrl,
        {
          messages: [
            {
              role: 'system',
              content: '또래상담사 :',
            },
            {
              role: 'assistant',
              content: message,
            },
          ],
          model: 'gpt-3.5-turbo',
          temperature: 0.2,
        },
        {
          headers: {
            Authorization: `Bearer ${config.OPENAI_API_KEY}`,
            'Content-Type': 'application/json',
          },
        },
      );

      return response.data.choices[0].message.content;
    } catch (err) {
      console.log(config.OPENAI_API_KEY);
      console.log(err, 'API call error');
    }
  };

  const handleSend = async newMessages => {
    const userMessage = newMessages[0].text;

    setMessages(prev =>
      GiftedChat.append(prev, [
        {
          _id: Math.random().toString(36).substring(7),
          text: userMessage,
          createdAt: new Date(),
          user: {
            _id: 1,
            name: 'Developer',
          },
        },
      ]),
    );

    const gptResponse = await sendMessage(userMessage);
    handleResponse(gptResponse);
  };

  const handleResponse = response => {
    const gptMessage = {
      _id: Math.random().toString(36).substring(7),
      text: response,
      createdAt: new Date(),
      user: {
        _id: 2,
        name: 'GPT-3.5-turbo',
      },
    };

    setMessages(prev => GiftedChat.append(prev, [gptMessage]));
  };

  const user = {
    _id: 1,
    name: 'Developer',
  };

  //TextInput 관련 쪽 -> 왼쪽에 마이크 버튼 넣고 싶은데.
  const renderInputToolbar = props => {
    return <InputToolbar {...props} containerStyle={styles.input} />;
  };

  return (
    <View style={{flex: 1, backgroundColor: '#F3E99F'}}>
      <GiftedChat
        messages={messages}
        onSend={handleSend}
        user={user}
        renderBubble={props => (
          <Bubble
            {...props}
            wrapperStyle={{
              right: {
                backgroundColor: '#2eccEE',
              },
              left: {
                backgroundColor: '#1abc9c',
              },
            }}
            textStyle={{
              right: {
                color: '#000',
              },
              left: {
                color: '#000',
              },
            }}
          />
        )}
        renderInputToolbar={renderInputToolbar}
      />
      {/* <Icon name="heart" size={30} color="#900" /> */}
      {Platform.OS === 'ios' ? (
        <KeyboardAvoidingView behavior="padding" />
      ) : null}
    </View>
  );
};

export default ChatScreen;

const styles = StyleSheet.create({
  messageContainer: {
    paddingBottom: 16,
  },
  input: {
    backgroundColor: '#D9D9D9',
    borderColor: 'transparent',
    borderWidth: 0,
    borderRadius: 4,
  },
});
