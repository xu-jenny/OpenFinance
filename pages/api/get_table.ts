import { NextApiRequest, NextApiResponse } from "next";
import fs from 'fs';
import path from "path";
import { openaiComplete } from "@/utils/openai-client";
import { createQuery } from "@/utils/prisma-client";
import { prismaCli } from "@/prisma/prisma";
import { Prisma } from "@prisma/client";
import { TableNames } from "./discover";
import { supabaseClient } from "@/utils/supabase-client";


function constructAPIResponse(tableNames: TableNames[]){
    // const filePath = path.join(process.cwd(), 'prompts', 'database.txt');
    // let metadata = getTableMetadata(tableNames, filePath)
    // console.log(metadata)
    // return JSON.stringify(metadata)
}

async function getTableDescription(tableName: string) {
    // find download link in supabase
    const { data } = supabaseClient
        .storage
        .from('tables')
        .getPublicUrl(`${tableName}.csv`)
        return data
  }

function isValidTableName(name: string): name is TableNames {
    return Object.values(TableNames).includes(name as TableNames);
  }

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse,
  ) {
    console.log("get table endpoint")
    const table = req.query.filename as string;
    console.log(req.query)
    console.log(table)
    if(!table){
        return res.status(400).json({ message: 'No table name in the request param' });
    }
    if(!isValidTableName(table)){
        return res.status(400).json({ message: 'table name provided is not valid' });
    }

    // check if in postgres

    // find corresponding metadata

    try {
        let link = getTableDescription(table)
        console.log(link)
    } catch (error) {
        console.log('error in getTableDescription', error);
        res.status(400).json({ message: 'Server error, please try again later!' });
    }
  }