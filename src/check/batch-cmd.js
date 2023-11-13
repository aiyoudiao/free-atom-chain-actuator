import chalk from "chalk";
import signale from "signale";
import path from "path";
import { existsSync } from "fs";

// 获取当前工作目录
const cwd = process.cwd();

// 定义一个函数检查命令设置，返回一个布尔值
function checkCommandSetting(setting) {
  const { dirPaths, commands, description } = setting;
  signale.info(`Check ${chalk.blue(description)}`);
  // 检查 dirPaths 和 commands
  if (
    !Array.isArray(dirPaths) ||
    !Array.isArray(commands) ||
    dirPaths.length === 0 ||
    commands.length === 0
  ) {
    signale.error(chalk.red("Invalid dirPaths or commands"));
    return false;
  }

  // 检查 dirPaths
  if (dirPaths.some((dirPath) => !existsSync(path.join(cwd, dirPath)))) {
    signale.error(chalk.red("Invalid dirPaths"));
    return false;
  }

  return true;
}

function checkParallelCommandSetting(setting) {
  return checkCommandSetting(setting);
}

function checkSequentialCommandSetting(setting) {
  return checkCommandSetting(setting);
}

export { checkParallelCommandSetting, checkSequentialCommandSetting };
