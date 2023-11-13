import fs from "fs/promises";
import { glob } from "glob";
import path from "path";
import mime from "mime";
import chalk from "chalk";
import ora from "ora";
import signale from "signale";

// 获取当前工作目录
const cwd = process.cwd();

export default async (setting) => {
  const {
    dirPaths,
    description,
    textFileExtensions,
    textMimeTypes,
    oldContents,
    newContents,
  } = setting;
  const filePaths = dirPaths.flatMap((dirPath) =>
    glob.sync(path.join(path.isAbsolute(dirPath) ? "" : cwd, dirPath, "**"), {
      ignore: "**/node_modules/**",
    })
  );
  signale.log(description);
  // 定义一个旋转的加载器
  const spinner = ora();

  // 对每个文件进行处理
  for (const filePath of filePaths) {
    spinner.start(`Processing ${chalk.green(filePath)}`);

    // 检测文件扩展名和 MIME 类型
    const ext = path.extname(filePath);
    const mimeType = mime.getType(filePath);

    // 如果文件扩展名是文本文件的扩展名，或者 MIME 类型是文本文件的 MIME 类型，则替换文件内容
    if (textFileExtensions.includes(ext) || textMimeTypes.includes(mimeType)) {
      try {
        let content = await fs.readFile(filePath, {
          encoding: "utf8",
        });
        for (let index = 0; index < oldContents.length; index++) {
          const oldContent = oldContents[index];
          const newContent = newContents[index];
          if ([oldContent, newContent].includes(undefined)) {
            throw "old content or new content is undefined.";
          }
          content = content.replace(new RegExp(oldContent, "g"), newContent);
        }
        await fs.writeFile(filePath, content, { encoding: "utf8" });
        spinner.succeed(`Processed ${chalk.green(filePath)}`);
        signale.success(
          `Replaced [${oldContents}] with [${newContents}] in ${chalk.green(
            filePath
          )}`
        );
      } catch (error) {
        spinner.fail(`Failed to process ${chalk.green(filePath)}`);
        signale.error(
          `Failed to replace [${oldContents}] with [${newContents}] in ${chalk.green(
            filePath
          )}: ${error}`
        );
      }
    } else {
      spinner.info(`Skipped ${chalk.green(filePath)}`);
      signale.info(`Skipped non-text file ${chalk.green(filePath)}`);
    }
  }
};
