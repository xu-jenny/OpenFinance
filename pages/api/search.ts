import { NextApiRequest, NextApiResponse } from "next";
import fs from 'fs';
import path from "path";
import { openaiComplete } from "@/utils/openai-client";
import { createQuery } from "@/utils/prisma-client";


function parseLLMResponse(inputString: string) {
    const dataArrayMatches = inputString.match(/data:\s+\[([^\]]*)\]/);
    const dataArray = dataArrayMatches ? dataArrayMatches[1].split(',') : [];

    // Extract reason
    const reasonMatches = inputString.match(/reason:\s+(.+)/);
    const reason = reasonMatches ? reasonMatches[1] : '';

    // console.log('Data Array:', dataArray);
    // console.log('Reason:', reason);
    return [dataArray, reason]
}

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse,
  ) {
    const { question } = req.body;
    if (!question) {
        return res.status(400).json({ message: 'No question in the request' });
    }
    const q = question.trim().replaceAll('\n', ' ');
    const filePath = path.join(process.cwd(), 'prompts', 'search.txt');
    const prompt = fs.readFileSync(filePath, 'utf8');
    const llmPrompt = prompt+q
    // console.log(llmPrompt)
    let response = 'data: [WARN,MN_CRIME]\nreason: You want to associate unemployment with crime rate. WARN contains unemployment data, MN_CRIME contains crime data in MN.'
    const [tables, reason] = parseLLMResponse(response)
    // let datasets = await openaiComplete(llmPrompt)
    // console.log(datasets)

    // if (datasets == 'N/A'){
    //     createQuery(question, "NO_DATASET", undefined)
    //     return res.status(400).json({message: "No dataset can satisify the question"})
    // }
    // createQuery(question, datasets, undefined)
    res.status(200).json({ tables, reason })
  }