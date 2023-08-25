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

export enum TableNames {
    AU_CONTAMINATED_SITES = 'AU_CONTAMINATED_SITES',
    AU_EPA_PRIORITY_SITES = 'AU_EPA_PRIORITY_SITES'
  }

function handleLLMResponse(question: string, response: string){
    if(response == 'Query Not Supported') {
        createQuery(question, response, "UNDEFINED_DISCOVER_QUERY")
        throw new IllegalSQLError()
    }
    
    const identifiers = response.slice(1, -1).split(', ');
    
    const validElements: TableNames[] = [];
    const invalidElements: string[] = [];
    
    for (const identifier of identifiers) {
        //@ts-ignore
        const castedIdentifier = TableNames[identifier] as TableNames;
        if (castedIdentifier !== undefined) {
            validElements.push(castedIdentifier);
        } else {
            invalidElements.push(identifier);
        }
    }

    if(invalidElements.length > 0){
        createQuery(question, response, `INVALID_ELEMENTS: ${invalidElements}`)
    } else {
        createQuery(question, response, undefined)
    }
    
    return validElements
}


type TableMetadata = { [key: string]: string };

function parseTableInfo(text: string): TableMetadata {
  const lines = text.split('\n');
  const metadata: TableMetadata = {};

  let currentTableName = '';
  for (const line of lines) {
    const trimmedLine = line.trim();
    let index = trimmedLine.indexOf(':')
    if (index != -1) {
      currentTableName = trimmedLine.substring(0, index).trim();
      metadata[currentTableName] = trimmedLine.substring(index+1).trim();
    }
  }

  return metadata;
}

function getTableMetadata(tableNames: TableNames[], filePath: string): TableMetadata {
  const fileContent = fs.readFileSync(filePath, 'utf-8');
  const parsedTableInfo = parseTableInfo(fileContent);

  const metadata: TableMetadata = {};

  for (const tableName of tableNames) {
    if (parsedTableInfo[tableName]) {
      metadata[tableName] = parsedTableInfo[tableName];
    }
  }

  return metadata;
}

function constructAPIResponse(tableNames: TableNames[]){
    const filePath = path.join(process.cwd(), 'prompts', 'database.txt');
    let metadata = getTableMetadata(tableNames, filePath)
    console.log(metadata)
    return JSON.stringify(metadata)
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
    try {
        let response = await openaiComplete(prompt);
        const tableNames : TableNames[] = handleLLMResponse(message, response)
        let metadata = constructAPIResponse(tableNames)
        res.status(200).json({ tables: tableNames, metadata});
    } catch (error) {
        createQuery(message, undefined, error as string)
        console.log('error', error);
        res.status(400).json({ message: 'Server error, please try again later!' });
    }
  }