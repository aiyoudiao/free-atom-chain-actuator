import path from "path";
import chalk from "chalk";
import signale from "signale";
import { existsSync } from "fs";

// 获取当前工作目录
const cwd = process.cwd();
export default async (setting) => {
  const {
    oldDirPaths,
    oldFullFileNames,
    newDirPaths,
    newFullFileNames,
    description,
  } = setting;
  signale.info(`Check ${chalk.blue(description)}`);

  // 检查 oldDirPaths, oldFullFileNames, newDirPaths, newFullFileNames
  if (
    !Array.isArray(oldDirPaths) ||
    !Array.isArray(oldFullFileNames) ||
    !Array.isArray(newDirPaths) ||
    !Array.isArray(newFullFileNames) ||
    oldDirPaths.length === 0 ||
    oldFullFileNames.length === 0 ||
    newDirPaths.length === 0 ||
    newFullFileNames.length === 0
  ) {
    signale.error(
      chalk.red(
        "Invalid oldDirPaths, oldFullFileNames, newDirPaths, newFullFileNames"
      )
    );
    return false;
  }

  // 检查 oldDirPaths 和 newDirPaths
  if (
    oldDirPaths.some((dirPath) => !existsSync(path.join(cwd, dirPath))) ||
    newDirPaths.some(
      (dirPath, index) =>
        !existsSync(
          path.join(
            path.isAbsolute(dirPath) ? "" : cwd,
            dirPath,
            newFullFileNames[index]
          )
        )
    )
  ) {
    signale.error(chalk.red("Invalid oldDirPaths or newDirPaths"));
    return false;
  }

  return true;
};
