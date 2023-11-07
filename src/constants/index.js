import key from '../../config/index';

export const apiKey = key;

export const categories = ['퀴즈', '이야기 말하기', '끝말잇기', '상담하기'];

export const menuItems = [
  {
    name: '퀴즈',
    desc: '퀴즈놀이 하자',
    link: 'Quiz',
    image: require('../../assets/animations/Bear.json'),
  },
  {
    name: '상담하기',
    desc: '고민을 말해봐..!',
    link: 'CounsellingPage',
    image: require('../../assets/animations/GreenBear.json'),
  },
  {
    name: '이야기 말하기!',
    desc: '이야기를 맞춰봐!!',
    link: 'StoryPage',
    image: require('../../assets/animations/BlueBear.json'),
  },
  {
    name: '끝말잇기',
    desc: '끝말잇기 하자!!!',
    link: 'ConnectStart',
    image: require('../../assets/animations/YellowBear.json'),
  },
  {
    name: '그림 그리기!',
    desc: '하고싶은걸 그려봐!',
    link: 'Drawing',
    image: require('../../assets/animations/GreenBear.json'),
  },
  {
    name: '기억력 게임',
    desc: '너의 기억력을 테스트해봐!',
    link: 'MemoryGame',
    image: require('../../assets/animations/Bear.json'),
  }
];
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
