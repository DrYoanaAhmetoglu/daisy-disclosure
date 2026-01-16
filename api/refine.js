import OpenAI from "openai";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { baseStatement } = req.body;

    if (!baseStatement || typeof baseStatement !== "string") {
      return res.status(400).json({ error: "Missing baseStatement" });
    }

    const client = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY
    });

    const instruction =
      "Rewrite the following AI disclosure statement to improve clarity and academic tone. " +
      "Reduce redundancy and unnecessary vagueness, while preserving qualifiers that indicate the limited or partial nature of AI use. " +
      "Do not add, remove, or infer any new information. Do not increase the perceived extent of AI use. " +
      "Preserve the factual content exactly.";

    const response = await client.chat.completions.create({
      model: "gpt-4.1-mini",
      temperature: 0.2,
      messages: [
        { role: "system", content: instruction },
        { role: "user", content: baseStatement }
      ]
    });

    const refined =
      response.choices?.[0]?.message?.content?.trim();

    return res.status(200).json({ refinedStatement: refined });
  } catch (err) {
    return res.status(500).json({ error: "Generation failed" });
  }
}
