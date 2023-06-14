import { OpenAI } from 'langchain/llms';
const { Configuration, OpenAIApi } = require("openai");

if (!process.env.OPENAI_API_KEY) {
  throw new Error('Missing OpenAI Credentials');
}

// export const openai = new OpenAI({
//   temperature: 0,
// });

export const openaiStream = new OpenAI({
  temperature: 0,
  streaming: true,
  callbackManager: {
    handleNewToken(token) {
      console.log(token);
    },
  },
});


const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
export const openai = new OpenAIApi(configuration);
