import { prismaCli } from "@/prisma/prisma";
import { supabaseClient } from "./supabase-client";

export async function createQuery(question: string, response: string | undefined, error: string | undefined) {
    const user = await supabaseClient.auth.getUser();
    await prismaCli.query.create({
        data: {
            question: question,
            llm_response: response,
            error: error,
            userId: user?.data?.user?.id || ''
        }
    })
}