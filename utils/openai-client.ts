import { OpenAI } from 'langchain/llms';
const { Configuration, OpenAIApi } = require('openai');

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

export const openaiComplete = async (prompt: string) => {
  try {
    const result = await openai.createCompletion({
      model: 'text-davinci-003',
      temperature: 0,
      max_tokens: 256,
      top_p: 1,
      frequency_penalty: 0.0,
      presence_penalty: 0.0,
      prompt,
    });
    return result['data']['choices'][0]['text'].trim();
  } catch (e) {
    console.error('Error invokign openaiComplete', e);
  }
};
