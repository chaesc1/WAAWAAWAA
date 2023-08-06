import {useState, useEffect} from 'react';
import {StyleSheet, Dimensions} from 'react-native';
import config from '../config';
import Icon from 'react-native-vector-icons/FontAwesome5';
const apiUrl = 'https://api.openai.com/v1/chat/completions';

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

  const sendMessage = async message => {
    try {
      const response = await axios.post(
        apiUrl,
        {
          messages: [
            {
              role: 'user',
              content: message,
            },
            {
              role: 'system',
              content: '넌 또래상담사야 무조건이야..',
            },
          ],
          model: 'gpt-3.5-turbo',
          temperature: 0.5,
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
      console.log(process.env.OPENAI_API_KEY);
      console.log(err, 'api call error');
    }
  };
  // 메시지 추가
  const handleSend = async newMessages => {
    setMessages(prev => GiftedChat.append(prev, newMessages));

    const response = await sendMessage(newMessages[0].text);
    const chatMessage = [
      {
        _id: Math.random().toString(36).substring(7),
        text: response,
        createdAt: new Date(),
        user: {
          _id: 2,
          name: 'GPT-3.5-turbo',
        },
      },
    ];

    setMessages(prev => GiftedChat.append(prev, chatMessage));
  };

  const user = {
    _id: 1,
    name: 'Developer', //user name
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
                backgroundColor: '#2ecc71',
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
