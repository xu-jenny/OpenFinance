import { NextApiRequest, NextApiResponse } from "next";
import fs from 'fs';
import path from "path";
import { openaiComplete } from "@/utils/openai-client";
import { createQuery } from "@/utils/prisma-client";
import { prismaCli } from "@/prisma/prisma";
import { Prisma } from "@prisma/client";

function constructPrompt(question: string){
    const filePath = path.join(process.cwd(), 'prompts', 'discover.txt');
    let prompt = fs.readFileSync(filePath, 'utf8');

    const dbFilePath = path.join(process.cwd(), 'prompts', 'database.txt')
    let database = fs.readFileSync(dbFilePath, 'utf8');
   
    const exFilePath = path.join(process.cwd(), 'prompts', 'discover_examples.txt')
    let examples = fs.readFileSync(exFilePath, 'utf8');
   
    prompt = prompt.replace("{{database}}", database)
    prompt = prompt.replace("{{examples}}", examples)
    prompt = prompt.replace("{{question}}", question)
    return prompt
}

async function handleLLMResponse(question: string, response: string){
    if(response == 'Query Not Supported') {
        createQuery(question, response, "UNDEFINED_DISCOVER_QUERY")
        throw new IllegalSQLError()
    }
    createQuery(question, response, undefined)
}

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse,
  ) {
    console.log("discover endpoint")
    const { message } = req.body;
    console.log(message)
    if (!message) {
      return res.status(400).json({ message: 'No message in the request' });
    }

    const prompt = constructPrompt(message)
    console.log(prompt)
    return res.status(200).json({ prompt: prompt })
    // try {
    //     let response = await openaiComplete(prompt);
    //     console.log(response)
    //     const serializedArray = await handleLLMResponse(message, response)
    //     res.status(200).json({ data: serializedArray });
    // } catch (error) {
    //     createQuery(message, undefined, error as string)
    //     console.log('error', error);
    //     res.status(400).json({ message: 'Server error, please try again later!' });
    // }
  }