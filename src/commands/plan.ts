import { cancel, intro, isCancel, outro, text } from "@clack/prompts";
import pc from "picocolors";
import { getFeishuWebhookUrlOrThrow } from "../lib/env";
import { sendEveningPlanCard } from "../lib/feishu";

export type EveningPlan = {
  core: string;
  relax: string;
  bedtime: string;
};

function validateNonEmpty(value: string) {
  if (!value.trim()) return "请输入内容（不能为空）";
}

export async function runPlanCommand(): Promise<void> {
  intro(pc.bold("sunset · 晚间规划"));

  let webhookUrl: string;
  try {
    webhookUrl = await getFeishuWebhookUrlOrThrow();
  } catch (err) {
    cancel(err instanceof Error ? err.message : "配置检查失败");
    process.exitCode = 1;
    return;
  }

  const core = await text({
    message: "🌅 [19:00 - 20:00] 核心任务是?",
    placeholder: "例如: 攻克 Rust 所有权",
    validate: validateNonEmpty,
  });
  if (isCancel(core)) {
    cancel("已取消");
    return;
  }

  const relax = await text({
    message: "🌓 [20:00 - 21:00] 放松/副业是?",
    placeholder: "例如: 写 CLI 文档",
    validate: validateNonEmpty,
  });
  if (isCancel(relax)) {
    cancel("已取消");
    return;
  }

  const bedtime = await text({
    message: "🛌 [21:00 - 22:00] 睡前准备是?",
    placeholder: "例如: 冥想 10 分钟",
    validate: validateNonEmpty,
  });
  if (isCancel(bedtime)) {
    cancel("已取消");
    return;
  }

  const plan: EveningPlan = {
    core: core.trim(),
    relax: relax.trim(),
    bedtime: bedtime.trim(),
  };

  try {
    await sendEveningPlanCard({ webhookUrl, plan });
  } catch (err) {
    cancel(err instanceof Error ? err.message : "发送失败");
    process.exitCode = 1;
    return;
  }

  outro(pc.green("已发送到飞书：🌙 晚间行动指南已启动"));
}

