import axios from 'axios';
import config from '../../config/index'; // OpenAI API 키를 포함하는 파일
const client = axios.create({
  headers: {
    Authorization: `Bearer ${config.OPENAI_API_KEY}`,
    'Content-Type': 'application/json',
  },
});

const chatGptUrl = 'https://api.openai.com/v1/chat/completions';

export const apiCall = async (prompt, messages) => {
  try {
    const res = await client.post(chatGptUrl, {
      model: 'gpt-3.5-turbo',
      messages,
      //   messages: [{}],
      temperature: 0.2,
    });

    let answer = res.data?.choices[0]?.message?.content;
    messages.push({role: 'assistant', content: answer.trim()});
    // console.log('got chat response', answer);
    return Promise.resolve({success: true, data: messages});
  } catch (err) {
    console.log('error: ', err);
    return Promise.resolve({success: false, msg: err.message});
  }
};
