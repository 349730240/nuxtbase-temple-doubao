import OpenAI from "openai";
import { serverSupabaseClient } from "#supabase/server";
import { decreaseUserTokens, hasEnoughTokens } from "@/server/utils/ai-tools";

export default defineEventHandler(async (event) => {
  // 获取请求体
  const body = await readBody(event);
  const { text, type } = body;

  // 获取supabase客户端
  const client = await serverSupabaseClient(event);

  // 获取当前用户
  const {
    data: { user },
    error,
  } = await client.auth.getUser();

  // 验证用户是否登录
  if (error || !user) {
    throw createError({
      statusCode: 401,
      message: "Unauthorized: User must be logged in",
    });
  }

  const enoughTokens = await hasEnoughTokens({
    event,
    tokensToUse: 100, // 预估最低使用100个token
    uid: user.id,
  });

  if (!enoughTokens) {
    throw createError({
      statusCode: 40,
      message: "Token不足，请先购买",
    });
  }

  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
    baseURL: process.env.OPENAI_API_BASE_URL,
  });

  // 参数验证
  if (!text || !type) {
    throw createError({
      statusCode: 400,
      message: "Invalid parameters: text and type are required",
    });
  }

  try {
    const completion = await openai.chat.completions.create({
      model: "deepseek-chat",
      messages: [
        {
          role: "system",
          content:
            "你是一个表情符号助手，你的任务是为文本添加合适的表情符号，使文本更生动有趣。",
        },
        {
          role: "user",
          content: `请在以下文本中添加${
            type === "more" ? "较多" : "较少"
          }的表情符号，使其更有趣：${text}`,
        },
      ],
      temperature: 0.7,
    });

    const token = completion.usage?.total_tokens as number;
    await decreaseUserTokens({
      event,
      tokensToUse: token,
      model: "deepseek-chat",
      uid: user.id,
    });

    return completion.choices[0].message.content?.trim() || text;
  } catch (error: any) {
    console.error("OpenAI API Error:", error);
    throw createError({
      statusCode: 500,
      message: error.message || "Error processing your request",
    });
  }
});
