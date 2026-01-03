# sunset-cli

一个极简个人生产力 CLI：在下班前用终端规划今晚时间，并通过飞书 Webhook 推送一张“晚间行动指南”卡片到手机。

## 功能

- 命令：`sunset plan`
- 交互：`@clack/prompts` 三个文本输入（不使用列表选择）
- 推送：飞书群机器人 Webhook，发送富文本交互卡片（Interactive Card）

## 环境要求

- Bun（建议 v1.3+）

## 安装依赖

```bash
bun install
```

## 配置（飞书 Webhook）

1. 复制示例文件并填写你的 Webhook：

```bash
cp .env.example .env
```

2. 编辑 `.env`：

```env
FEISHU_WEBHOOK_URL=https://open.feishu.cn/open-apis/bot/v2/hook/xxxx
```

获取 Webhook：飞书群聊 → 机器人 → 添加机器人 → 自定义机器人 → Webhook 地址。

## 使用

类型检查（可选但推荐）：

```bash
bun run typecheck
```

运行交互式规划并推送飞书卡片：

```bash
bun run index.ts plan
```

## 可选：作为 `sunset` 命令使用

项目已配置 `bin` 为 `sunset`。你可以在本地将它链接为命令：

```bash
bun link
sunset plan
```

## 故障排查

- 没有收到消息：确认 Webhook 对应的群里机器人仍在、且 Webhook 地址正确
- 发送失败：终端会输出 HTTP 状态码或飞书返回的 `code/msg`，按提示处理即可
