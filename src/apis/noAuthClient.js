import axios from 'axios';

const noAuthClient = axios.create({
  baseURL: 'http://15.164.50.203:3000',
  headers: {
    'Content-Type': 'application/json',
  },
});

export default noAuthClient;