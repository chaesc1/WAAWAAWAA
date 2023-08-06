import React from 'react';
import {useState, useEffect} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Dimensions,
} from 'react-native';

export default function WordChainPagePhone({navigation, styles, array}) {
  const [message, setMessage] = useState('');
  return (
    <View style={styles.container}>
      <ScrollView>
        {array.map((item, i) => {
          return (
            <View
              key={i}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: item.user === 'gold' ? 'flex-start' : 'flex-end',
                justifyContent: 'flex-end',
                marginBottom: 10,
              }}>
              <View
                style={[
                  styles.chat,
                  {
                    justifyContent:
                      item.user === 'gold' ? 'flex-start' : 'flex-end',
                  },
                ]}>
                {item.user === 'gold' && (
                  <Image
                    style={styles.goldPicture}
                    source={require('../../assets/gold.png')}
                  />
                )}
                <View
                  style={[
                    styles.chatBox,
                    {flex: item.content.length > 15 ? 1 : null},
                  ]}>
                  <Text style={styles.chatContent}>{item.content}</Text>
                </View>
              </View>
            </View>
          );
        })}
      </ScrollView>
      <View style={styles.inputContainer}>
        <TouchableOpacity style={styles.micButton}>
          <Image
            style={styles.sendMic}
            //source={require("../../assets/mic-ffffff.png")}
          />
        </TouchableOpacity>
        <TextInput
          style={styles.input}
          placeholder="대화를 입력하세요..."
          value={message}
          onChangeText={text => setMessage(text)}
        />
        <TouchableOpacity style={styles.sendButton}>
          <Text style={styles.sendButtonText}>전송</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
