import axios from 'axios';
// import config from '../../config/index';

import {
  AccessToken,
  sendConnectEndingText,
  addCounsellingLog,
} from '../constants';

const client = axios.create({
  headers: {
    Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
    'Content-Type': 'application/json',
  },
});

const chatGptUrl = 'https://api.openai.com/v1/chat/completions';
//챗봇상담
export const apiCall = async (prompt, messages) => {
  try {
    const res = await client.post(chatGptUrl, {
      model: 'gpt-3.5-turbo-1106',
      // messages,
      messages: [
        {
          role: 'system',
          content:
            '너는 또래상담사로서 user;의 고민을 들어줘야해. 최대한 간단하게 답해줘.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: 0,
    });

    console.log(res);
    let answer = res.data?.choices[0]?.message?.content;
    messages.push({role: 'assistant', content: answer.trim()});

    console.log('gpt:', res.data?.choices[0]?.message);
    const body = {
      content: res.data?.choices[0]?.message?.content,
      sender: res.data?.choices[0]?.message?.role,
      time: new Date(),
    };

    // addCounsellingLog(body, AccessToken); //post -> get

    // console.log('got chat response', answer);
    return Promise.resolve({success: true, data: messages});
  } catch (err) {
    console.log('error: adsad', err);
    return Promise.resolve({success: false, msg: err.message});
  }
};
// 끝말잇기
export const ConnectEndApi = async (prompt, messages) => {
  try {
    const res = await client.post(chatGptUrl, {
      model: 'gpt-3.5-turbo-1106',
      // messages,
      messages: [
        {
          role: 'system',
          content:
            // '끝말잇기는 단어를 말하면 그 단어의 맨 끝 글자에 이어서 말하는 놀이이다. 전에 말한 단어 금지 국어사전에 등재되지 않은 단어는 금지 등 여러 규칙들이 있다 명사인 단어만 가능하고 고유명사는 안되며, 지명은 예외이다. 또한 두음법칙을 사용하면 안 되고, 너가 틀린 단어를 말하면 졌어 라고 말해야해.',
            'user;와 끝말잇기 해줘. 단어로만 말해야해, 문장을 말하면 안돼, 전에 말한 중복된 단어 금지,명사인 단어만 가능해, 고유명사 안돼 , 국어사전에 등재된 단어만 가능해.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: 0.1,
    });

    let answer = res.data?.choices[0]?.message?.content;
    messages.push({role: 'assistant', content: answer.trim()});

    return Promise.resolve({success: true, data: messages});
  } catch (err) {
    console.log('error: ', err);
    return Promise.resolve({success: false, msg: err.message});
  }
};
// 수다, 아키네이터
// prompt : user 가 말한 주제  - fixed value
// messages :
// userAnswer : user - non_fixed value
export const QuizGenerate = async (prompt, messages) => {
  console.log('get Prompt', prompt, 'Message', messages);
  try {
    const res = await client.post(chatGptUrl, {
      model: 'gpt-3.5-turbo',
      // messages,
      messages: [
        {
          role: 'system',
          content: `한문제씩 랜덤 퀴즈 내줘`,
        },
      ],
      temperature: 0.9,
      frequency_penalty: 0,
      presence_penalty: 0,
    });
    console.log(res.data.choices[0]);
    let answer = res.data?.choices[0]?.message?.content;
    messages.push({role: 'assistant', content: answer.trim()});
    console.log('got chat response', answer);
    return Promise.resolve({success: true, data: messages});
  } catch (err) {
    console.log('error: ', err);
    return Promise.resolve({success: false, msg: err.message});
  }
};

// 스무고개 api
export const TwentyAPI = async (prompt, messages) => {
  console.log('get Prompt', prompt, 'Message', messages);
  try {
    const res = await client.post(chatGptUrl, {
      model: 'gpt-3.5-turbo',
      // messages,
      messages: [
        {
          role: 'user',
          content: `이 메시지가 '나먼저' 이면? ${prompt} . 그러면 너는 내가 생각하는 것을 질문을 통해 맞춰야해`,
        },
      ],
      temperature: 0.2,
    });
    console.log(res.data.choices[0]);
    let answer = res.data?.choices[0]?.message?.content;
    messages.push({role: 'assistant', content: answer.trim()});
    // console.log('got chat response', answer);
    return Promise.resolve({success: true, data: messages});
  } catch (err) {
    console.log('error: ', err);
    return Promise.resolve({success: false, msg: err.message});
  }
};
