import { openaiComplete } from '@/utils/openai-client';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> {
  try {
    const { inputData, chart } = req.body;
    const prompt = `Based on ${inputData} generate a valid JSON in which each element is an object for Recharts API for chart ${chart} without new line characters '\n'. Strictly using this FORMAT and naming:
[{ "name": "a", "value": 12 }]. Make sure field name always stays named name. Instead of naming value field value in JSON, name it based on user metric and make it the same across every item.\n Make sure the format use double quotes and property names are string literals. Provide JSON data only. `;

    const response = await openaiComplete(prompt)
    console.log(response)
    res.status(200).send(response.trim());
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
}