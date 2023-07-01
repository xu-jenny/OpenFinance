import { prismaCli } from "@/prisma/prisma";
import { supabaseClient } from "./supabase-client";

export async function createQuery(uid: string, question: string, response: string | undefined, error: string | undefined) {
    console.log("createQuery user:", uid)
    await prismaCli.question.create({
        data: {
          question: question,
          llm_response: response,
          error: error,
          uid: uid
        }
    })
}