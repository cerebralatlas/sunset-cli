import { access } from "node:fs/promises";
import { join } from "node:path";
import dotenv from "dotenv";

const ENV_FILE_NAME = ".env";

export async function getFeishuWebhookUrlOrThrow(): Promise<string> {
  // 以当前工作目录作为“项目根目录”读取 .env，方便在项目内直接运行 `sunset plan`
  const envPath = join(process.cwd(), ENV_FILE_NAME);

  try {
    await access(envPath);
  } catch {
    throw new Error(
      [
        "未找到项目根目录的 .env 文件。",
        "",
        "请在项目根目录创建 .env，并写入：",
        "  FEISHU_WEBHOOK_URL=https://open.feishu.cn/open-apis/bot/v2/hook/xxxx",
        "",
        "获取 Webhook：飞书群聊 → 机器人 → 添加机器人 → 自定义机器人 → Webhook 地址。",
      ].join("\n"),
    );
  }

  dotenv.config({ path: envPath });

  const webhookUrl = process.env.FEISHU_WEBHOOK_URL?.trim();
  if (!webhookUrl) {
    throw new Error(
      [
        "未检测到 FEISHU_WEBHOOK_URL 环境变量。",
        "",
        "请在项目根目录的 .env 中写入：",
        "  FEISHU_WEBHOOK_URL=https://open.feishu.cn/open-apis/bot/v2/hook/xxxx",
      ].join("\n"),
    );
  }

  return webhookUrl;
}
