import key from '../../config/index';
import axios from 'axios';

export const apiKey = key;

export const dummyMessages = [
  {
    role: 'user',
    content: 'How are you?',
  },
  {
    role: 'assistant',
    content: "I'm fine, How may i help you today.",
  },
  {
    role: 'user',
    content: 'create an image of a dog playing with cat',
  },
  {
    role: 'assistant',
    content:
      'https://storage.googleapis.com/pai-images/ae74b3002bfe4b538493ca7aedb6a300.jpeg',
  },
];

export const sendConnectEndingText = (body, AccessToken) => {
  console.log(body, AccessToken);
  axios
    .post('http://15.164.50.203:3000/word-chain', body, {
      headers: {
        Authorization: `Bearer ${AccessToken}`, // 헤더에 AccessToken 추가
        'Content-Type': 'application/json', // 원하는 헤더 값 추가
      },
    })
    .then(response => {
      console.log('API Response:', response.data);
    })
    .catch(error => {
      console.error('Post API Error:', error.response.data);
    });
};

export const AccessToken =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJxd2VyIiwiaWF0IjoxNjkyNDM0MzYyLCJleHAiOjE2OTI0MzQ2NjJ9.0gtNGHwd6kqNAyHlY4ZsFz7UQD0wplYvXKsgrg1FRlY';
