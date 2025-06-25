// 发送 Lark 消息
export async function sendLarkMessage(message: string) {
  const webhookUrl = process.env.LARK_BOT_WEBHOOK_URL;
  if (webhookUrl) {
    try {
      await $fetch(webhookUrl, {
        method: "POST",
        body: {
          msg_type: "text",
          content: {
            text: message,
          },
        },
      });
    } catch (err) {
      console.error("Failed to send Lark webhook:", err);
    }
  }
}
