import React, {useState, useEffect} from 'react';
import {GiftedChat, InputToolbar} from 'react-native-gifted-chat';
import {StyleSheet, TouchableOpacity} from 'react-native';
import FontAwesome5Icon from 'react-native-vector-icons/FontAwesome5';
import axios from 'axios';
import Voice from 'react-native-voice';

const apiKey = '';
const apiUrl = 'https://api.openai.com/v1/chat/completions';

const ChatScreen = () => {
  const [messages, setMessages] = useState([]);
  const [isRecording, setIsRecording] = useState(false); // Add isRecording state and its setter

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
              content: '넌 또래상담사야',
            },
          ],
          model: 'gpt-3.5-turbo',
          temperature: 0.5,
        },
        {
          headers: {
            Authorization: `Bearer ${apiKey}`,
            'Content-Type': 'application/json',
          },
        },
      );

      return response.data.choices[0].message.content;
    } catch (err) {
      console.log(err, 'api call error');
    }
  };
  const onMicrophonePress = () => {
    setIsRecording(!isRecording);
    // You can implement voice recording functionality here
    // For simplicity, I'll just set a default response when the microphone is clicked
    if (isRecording) {
      onSend([
        {
          _id: Math.random().toString(36).substring(7),
          text: '금쪽이 말하는중',
          createdAt: new Date(),
          user: {
            _id: 2,
            name: 'GPT-3.5-turbo',
          },
        },
      ]);
    }
  };

  // Function to render the microphone button
  const renderMicrophoneButton = () => {
    return (
      <TouchableOpacity onPress={onMicrophonePress}>
        <FontAwesome5Icon
          name={isRecording ? 'microphone' : 'microphone-slash'}
          size={25}
          color={isRecording ? 'red' : 'black'}
        />
      </TouchableOpacity>
    );
  };

  const onSend = async (newMessages = []) => {
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
          //avatar: require("../assets/chatgptlogo.png"),
        },
      },
    ];

    setMessages(prev => GiftedChat.append(prev, chatMessage));
  };

  const user = {
    _id: 1,
    name: 'Developer',
  };

  const renderInputToolbar = props => {
    // return <InputToolbar {...props} containerStyle={styles.input} />;
    return (
      <InputToolbar
        {...props}
        containerStyle={styles.input}
        renderAccessory={renderMicrophoneButton} // Render the microphone button inside the input toolbar
      />
    );
  };

  return (
    <GiftedChat
      messages={messages}
      onSend={onSend}
      user={user}
      placeholder={'whats on your mind?'}
      showUserAvatar={true}
      showAvatarForEveryMessage={true}
      renderInputToolbar={renderInputToolbar}
      messagesContainerStyle={styles.messageContainer}
    />
  );
};

export default ChatScreen;

const styles = StyleSheet.create({
  messageContainer: {
    paddingBottom: 16,
  },
  input: {
    borderColor: 'transparent',
    borderWidth: 0,
    borderRadius: 4,
    marginBottom: 16,
  },
});
