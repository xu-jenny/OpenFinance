import { OpenAI } from 'langchain/llms';
import { LLMChain, ChatVectorDBQAChain, loadQAChain } from 'langchain/chains';
import { HNSWLib, SupabaseVectorStore } from 'langchain/vectorstores';
import { PromptTemplate } from 'langchain/prompts';

const CONDENSE_PROMPT =
  PromptTemplate.fromTemplate(`Given the following conversation and a follow up question, rephrase the follow up question to be a standalone question.

Chat History:
{chat_history}
Follow Up Input: {question}
Standalone question:`);

const QA_PROMPT = PromptTemplate.fromTemplate(
  `You are an AI assistant and a Notion expert. You are given the following extracted parts of a long document and a question. Provide a conversational answer based on the context provided.
You should only use hyperlinks as references that are explicitly listed as a source in the context below. Do NOT make up a hyperlink that is not listed below.
If you can't find the answer in the context below, just say "Hmm, I'm not sure." Don't try to make up an answer.
If the question is not related to Notion, notion api or the context provided, politely inform them that you are tuned to only answer questions that are related to Notion.
Choose the most relevant link that matches the context provided:

Question: {question}
=========
{context}
=========
Answer in Markdown:`,
);

const SQL_PROMPT = PromptTemplate.fromTemplate(`
Generate a single SQL query that fulfills this request: {request}

These are the table schemas:

WarnNotice:
companyName (String): name of the company that posted the notice
noticeDate (DateTime): the date the notice was posted
layoffDate (DateTime): the date the layoff will take effect
numAffected (Int): the number of employees affected
state (String): the state in which the layoff will happen. State is represented by its 2 letter abbreviation, such as NY, NJ, CA, etc.)

Only output the SQL query. Make sure the SQL query is correct before outputting it. Do not output any other words.
`);

export const makeChainWithVectorStore = (
  vectorstore: SupabaseVectorStore,
  onTokenStream?: (token: string) => void,
) => {
  const questionGenerator = new LLMChain({
    llm: new OpenAI({ temperature: 0 }),
    prompt: CONDENSE_PROMPT,
  });
  const docChain = loadQAChain(
    new OpenAI({
      temperature: 0,
      streaming: Boolean(onTokenStream),
      callbackManager: {
        handleNewToken: onTokenStream,
      },
    }),
    { prompt: QA_PROMPT },
  );

  return new ChatVectorDBQAChain({
    vectorstore,
    combineDocumentsChain: docChain,
    questionGeneratorChain: questionGenerator,
  });
};

export const makeChain = () => {
  const docChain = loadQAChain(
    new OpenAI({
      temperature: 0,
    }),
    { prompt: SQL_PROMPT },
  );

  return docChain
}
