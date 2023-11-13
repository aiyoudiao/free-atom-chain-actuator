import fs from "fs/promises";
import path from "path";
import chalk from "chalk";
import ora from "ora";
import signale from "signale";
import { existsSync } from "fs";

// 获取当前工作目录
const cwd = process.cwd();

export default async (setting) => {
  const oldDirPaths = setting.oldDirPaths.map((dirPath) =>
    path.isAbsolute(dirPath) ? dirPath : path.join(cwd, dirPath)
  );
  const newDirPaths = setting.newDirPaths.map((dirPath) =>
    path.isAbsolute(dirPath) ? dirPath : path.join(cwd, dirPath)
  );

  // 旧的字体文件和新的字体文件
  const oldFullFileNames = setting.oldFullFileNames;
  const newFullFileNames = setting.newFullFileNames;

  // 定义一个旋转的加载器
  const spinner = ora();

  // 对每个项目进行处理
  for (const oldDirPath of oldDirPaths) {
    spinner.start(`Processing ${chalk.green(oldDirPath)}\n`);

    // 删除旧的字体文件
    for (const oldFullFileName of oldFullFileNames) {
      try {
        const todoFile = path.join(oldDirPath, oldFullFileName);
        if (existsSync(todoFile)) {
          await fs.unlink(todoFile);
          signale.success(
            `Deleted ${chalk.red(oldFullFileName)} in ${chalk.green(
              oldDirPath
            )}`
          );
        } else {
          signale.warn(
            `Delete failed: file ${chalk.red(
              oldFullFileName
            )} does not exist in ${chalk.green(oldDirPath)}`
          );
        }
      } catch (error) {
        signale.error(
          `Failed to delete ${chalk.red(oldFullFileName)} in ${chalk.green(
            oldDirPath
          )}`
        );
      }
    }

    for (const newDirPath of newDirPaths) {
      spinner.start(`Processing ${chalk.green(oldDirPath)}\n`);
      // 复制新的字体文件
      for (const newFullFileName of newFullFileNames) {
        try {
          const todoFile = path.join(newDirPath, newFullFileName);
          if (existsSync(todoFile)) {
            await fs.copyFile(
              path.join(newDirPath, newFullFileName),
              path.join(oldDirPath, newFullFileName)
            );
            signale.success(
              `Copied ${chalk.blue(newFullFileName)} to ${chalk.green(
                oldDirPath
              )}`
            );
          } else {
            signale.warn(
              `Copy failed: file ${chalk.blue(
                newFullFileName
              )} does not exist in ${chalk.green(newDirPath)}`
            );
          }
        } catch (error) {
          signale.error(
            `Failed to copy ${chalk.blue(newFullFileName)} to ${chalk.green(
              oldDirPath
            )}`
          );
        }
      }
    }

    spinner.succeed(`Processed ${chalk.green(oldDirPath)}\n`);
  }
};
