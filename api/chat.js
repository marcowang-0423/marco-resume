const Anthropic = require("@anthropic-ai/sdk").default;
const { readFileSync } = require("fs");
const { join } = require("path");

module.exports = async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { message } = req.body;

  if (!message) {
    return res.status(400).json({ error: "Message is required" });
  }

  if (!process.env.ANTHROPIC_API_KEY) {
    return res
      .status(500)
      .json({ error: "ANTHROPIC_API_KEY environment variable is not set" });
  }

  try {
    const resumeDataPath = join(process.cwd(), "assets", "resume-data.json");
    const resumeDataRaw = readFileSync(resumeDataPath, "utf-8");
    const resumeData = JSON.parse(resumeDataRaw);

    const client = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY,
    });

    const systemPrompt = `你是王思喬的個人簡歷助手。使用者會提出關於王思喬經歷、技能、教育背景、研究領域等的問題。

根據以下簡歷資訊回答問題。回答要：
1. 準確、簡潔
2. 使用繁體中文
3. 如果問題不在簡歷中，禮貌地說明你沒有相關資訊

簡歷資訊：
${JSON.stringify(resumeData, null, 2)}`;

    const response = await client.messages.create({
      model: "claude-3-5-sonnet-20241022",
      max_tokens: 1024,
      system: systemPrompt,
      messages: [
        {
          role: "user",
          content: message,
        },
      ],
    });

    const reply = response.content[0].type === "text" ? response.content[0].text : "";

    return res.status(200).json({ reply });
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({ error: "Failed to process request" });
  }
}
