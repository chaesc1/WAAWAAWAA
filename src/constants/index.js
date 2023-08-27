import key from '../../config/index';

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

export const AccessToken =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJob25naG9uZyIsImlhdCI6MTY5MzExNTAxMCwiZXhwIjozMDAxNjkzMTE1MDEwfQ.jFBZGb576s3K-Bmu_ZYzz6Ock5DxEQYfLGfcPCV9aMg';

// 이야기 이어가기
// 이야기 연습하기
// 지피티랑 놀기
