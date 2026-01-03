import pc from "picocolors";
import type { EveningPlan } from "../commands/plan";

type FeishuInteractiveCard = {
  config?: {
    wide_screen_mode?: boolean;
    enable_forward?: boolean;
  };
  header?: {
    template?: "blue" | "purple" | "indigo" | "turquoise" | "green" | "yellow" | "orange" | "red" | "grey";
    title: { tag: "plain_text"; content: string };
  };
  elements: Array<
    | { tag: "div"; text: { tag: "lark_md"; content: string } }
    | { tag: "hr" }
  >;
};

type FeishuWebhookPayload = {
  msg_type: "interactive";
  card: FeishuInteractiveCard;
};

export async function sendEveningPlanCard(input: {
  webhookUrl: string;
  plan: EveningPlan;
}): Promise<void> {
  // 飞书群机器人 Webhook：msg_type=interactive + card 即可发送“富文本交互卡片”
  const payload: FeishuWebhookPayload = {
    msg_type: "interactive",
    card: buildEveningPlanCard(input.plan),
  };

  const controller = new AbortController();
  const timeoutMs = 12_000;
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const res = await fetch(input.webhookUrl, {
      method: "POST",
      headers: { "content-type": "application/json; charset=utf-8" },
      body: JSON.stringify(payload),
      signal: controller.signal,
    });

    if (!res.ok) {
      const bodyText = await safeReadText(res);
      throw new Error(
        [
          `飞书 Webhook 请求失败：HTTP ${res.status} ${res.statusText}`,
          bodyText ? `响应内容：${bodyText}` : "",
        ]
          .filter(Boolean)
          .join("\n"),
      );
    }

    const json = (await res.json().catch(() => null)) as unknown;
    const code = typeof (json as any)?.code === "number" ? (json as any).code : undefined;
    const msg = typeof (json as any)?.msg === "string" ? (json as any).msg : undefined;
    if (code !== undefined && code !== 0) {
      throw new Error(`飞书返回错误：code=${code}${msg ? ` msg=${msg}` : ""}`);
    }
  } catch (err) {
    if (err instanceof DOMException && err.name === "AbortError") {
      throw new Error(`网络请求超时（>${timeoutMs / 1000}s），请稍后重试`);
    }
    if (err instanceof Error) {
      throw new Error(`${pc.red("发送到飞书失败")}：${err.message}`);
    }
    throw new Error(`${pc.red("发送到飞书失败")}：未知错误`);
  } finally {
    clearTimeout(timeoutId);
  }
}

function buildEveningPlanCard(plan: EveningPlan): FeishuInteractiveCard {
  const body = [
    "**今晚安排**",
    "",
    `- **🌅 [19:00 - 20:00]** ${escapeMd(plan.core)}`,
    `- **🌓 [20:00 - 21:00]** ${escapeMd(plan.relax)}`,
    `- **🛌 [21:00 - 22:00]** ${escapeMd(plan.bedtime)}`,
  ].join("\n");

  return {
    config: { wide_screen_mode: true, enable_forward: true },
    header: {
      template: "purple",
      title: { tag: "plain_text", content: "🌙 晚间行动指南已启动" },
    },
    elements: [
      { tag: "div", text: { tag: "lark_md", content: body } },
      { tag: "hr" },
      {
        tag: "div",
        text: { tag: "lark_md", content: `> ${escapeMd("今晚的自律，是为了明早的自由。")}` },
      },
    ],
  };
}

function escapeMd(text: string): string {
  return text.replaceAll("\\", "\\\\").replaceAll("*", "\\*").replaceAll("_", "\\_").replaceAll("`", "\\`");
}

async function safeReadText(res: Response): Promise<string> {
  try {
    const text = await res.text();
    return text.slice(0, 2000);
  } catch {
    return "";
  }
}
