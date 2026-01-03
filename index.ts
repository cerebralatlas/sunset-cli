#!/usr/bin/env bun
import pc from "picocolors";
import { runPlanCommand } from "./src/commands/plan";

type CommandHandler = (args: string[]) => Promise<void>;

const handlers: Record<string, CommandHandler> = {
  plan: runPlanCommand,
  help: async () => printHelp(),
};

function printHelp() {
  const lines = [
    `${pc.bold("sunset")} ${pc.dim("<command>")}`,
    "",
    pc.bold("Commands:"),
    `  ${pc.cyan("plan")}    规划今晚 19:00-22:00 并推送到飞书`,
    `  ${pc.cyan("help")}    显示帮助信息`,
    "",
    pc.bold("Examples:"),
    `  ${pc.dim("$")} sunset plan`,
  ];
  process.stdout.write(lines.join("\n") + "\n");
}

async function main() {
  const [, , ...argv] = process.argv;
  const command = argv[0] ?? "help";
  const handler = handlers[command] ?? handlers.help;
  if (!handler) {
    printHelp();
    process.exitCode = 1;
    return;
  }
  await handler(argv.slice(1));
}

await main();
