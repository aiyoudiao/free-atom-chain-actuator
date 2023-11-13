import path from "path";
import chalk from "chalk";
import signale from "signale";
import { existsSync } from "fs";

export default async (setting) => {
  const {
    oldContents,
    newContents,
    dirPaths,
    textFileExtensions,
    textMimeTypes,
    description,
  } = setting;
  signale.info(`Check ${chalk.blue(description)}`);

  // 检查 oldContents 和 newContents
  if (
    !Array.isArray(oldContents) ||
    !Array.isArray(newContents) ||
    oldContents.length !== newContents.length ||
    oldContents.length === 0
  ) {
    signale.error(chalk.red("Invalid oldContents or newContents"));
    return false;
  }

  // 检查 dirPaths
  if (
    !Array.isArray(dirPaths) ||
    dirPaths.some(
      (dirPath) =>
        !existsSync(
          path.isAbsolute(dirPath) ? dirPath : path.join(process.cwd(), dirPath)
        )
    )
  ) {
    signale.error(chalk.red("Invalid dirPaths"));
    return false;
  }

  // 检查 textFileExtensions 和 textMimeTypes
  if (
    !Array.isArray(textFileExtensions) ||
    !Array.isArray(textMimeTypes) ||
    (textFileExtensions.length === 0 && textMimeTypes.length === 0)
  ) {
    signale.error(chalk.red("Invalid textFileExtensions or textMimeTypes"));
    return false;
  }

  return true;
};
