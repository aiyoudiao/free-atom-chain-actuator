import fs from "fs/promises";
import signale from "signale";
import check from "./check/index.js";
import feature from "./feature/index.js";

process.addListener("unhandledRejection", (reason) => {
  signale.error("unhandledRejection: ", reason);
});

export default async () => {
  const initialization = async () => {
    let setting;
    try {
      const json = await fs.readFile("./setting.json", { encoding: "utf8" });
      setting = JSON.parse(json);
    } catch (error) {
      setting = [
        {
          name: "replace-in-files",
          type: "replace-in-files",
          description: "replace-in-files",
          setting: [
            {
              description: "replace-in-files",
              // 定义旧内容和新内容
              oldContents: [],
              newContents: [],
              // 定义要匹配的文件路径和要排除的目录，可以是数组，也可以是对象
              dirPaths: [],
              // 定义文本文件的扩展名和 MIME 类型
              textFileExtensions: [],
              textMimeTypes: [],
            },
          ],
        },
        {
          name: "replace-files",
          type: "replace-files",
          description: "replace-files",
          setting: [
            {
              description: "replace-files",
              // 定义旧文件的目录和旧的文件全名
              oldDirPaths: [],
              oldFullFileNames: [],
              // 定义新文件的目录和新的文件全名
              newDirPaths: [],
              newFullFileNames: [],
            },
          ],
        },
        {
          name: "batch-cmd:parallel",
          type: "batch-cmd:parallel",
          description: "batch-cmd:parallel",
          setting: [
            {
              description: "batch-cmd:parallel",
              // 定义对应的目录和要执行的命令
              dirPaths: [],
              commands: [],
            },
          ],
        },
        {
          name: "batch-cmd:sequential",
          type: "batch-cmd:sequential",
          description: "batch-cmd:sequential",
          setting: [
            {
              description: "batch-cmd:sequential",
              // 定义对应的目录和要执行的命令
              dirPaths: [],
              commands: [],
            },
          ],
        },
      ];
      await fs.writeFile("./setting.json", JSON.stringify(setting, null, 2), {
        encoding: "utf8",
      });
      signale.error(
        "Initialization: For unknown reasons, please consult the author on issues"
      );
    }
    return setting;
  };

  const atomChain = await initialization();
  try {
    const { pass = false } = check(atomChain);
    signale.log();
    if (!pass) {
      signale.error(
        `Check that the configuration in the setting.json file is correct.`
      );
      process.exit(1);
    } else {
      await feature(atomChain);
    }
  } catch (error) {
    signale.error(
      `Error: For unknown reasons, please consult the author on issues. ${reason}\n`
    );
  }
  signale.log();
  process.exit(0);
};
