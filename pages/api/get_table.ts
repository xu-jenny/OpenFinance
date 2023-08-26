import { NextApiRequest, NextApiResponse } from "next";
import { prismaCli } from "@/prisma/prisma";
import { TableNames } from "./discover";
import { supabaseClient } from "@/utils/supabase-client";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";

async function getTable(tableName: string) {
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
    const tableName = req.query.tableName as string;
    console.log(tableName)
    if(!tableName){
        return res.status(400).json({ message: 'No table name in the request param' });
    }
    try {
        let row = await prismaCli.tableMetaData.findFirstOrThrow({ where: { tableName } })
        res.status(200).json({ data: row.tableName })
    } catch (e){
        if (e instanceof PrismaClientKnownRequestError){
            console.error("cannot find tablename", tableName,  e)
            res.status(400).json({ message: 'Tablename provided does not exist' });
        } else {
            console.error("unknown error fetching tableMetaData", e)
            res.status(400).json({ message: 'Server error, please try again later!' });
        }
    }
  }