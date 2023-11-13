import { exec } from "child_process";
import chalk from "chalk";
import ora from "ora";
import signale from "signale";
import path from "path";

// 获取当前工作目录
const cwd = process.cwd();

// 定义一个旋转的加载器
const spinner = ora();

// 定义一个函数来执行命令，并返回一个 Promise
function execCommand(dirPath, command) {
  return new Promise((resolve, reject) => {
    spinner.start(
      `Executing ${chalk.green(command)} in ${chalk.yellow(dirPath)}\n`
    );
    exec(
      command,
      { cwd: path.isAbsolute(dirPath) ? dirPath : path.join(cwd, dirPath) },
      (error, stdout, stderr) => {
        if (error) {
          resolve({
            pass: false,
            message: `Failed to execute ${chalk.green(
              command
            )} in ${chalk.yellow(dirPath)}: \n${error}`,
          });
        } else {
          resolve({
            pass: true,
            message: `Success to execute ${chalk.green(
              command
            )} in ${chalk.yellow(dirPath)}${stdout ? ":\n" : ""}${
              stdout.replace("\n", "") || '""'
            }`,
          });
        }
      }
    );
  });
}

// 并行执行所有的命令
async function execCommandsParallel(setting) {
  const { dirPaths, commands, description } = setting;
  spinner.start(
    `Starting ${chalk.green(
      "parallel"
    )} execution of commands with ${description}\n\n`
  );
  try {
    const cmdFuncs = dirPaths.reduce((prev, cur) => {
      const cmdFunc = commands.map((command) => execCommand(cur, command));
      return [...prev, ...cmdFunc];
    }, []);
    const results = await Promise.all(cmdFuncs);
    spinner.succeed(
      `Finished ${chalk.green("parallel")} execution of commands`
    );
    results.forEach(({ pass, message }) => {
      pass ? signale.success(message) : signale.error(message);
    });
  } catch (error) {
    spinner.fail(`Failed ${chalk.green("parallel")} execution of commands`);
    signale.error(error);
  }
}

// 串行执行所有的命令
async function execCommandsSequential(setting) {
  const { dirPaths, commands, description } = setting;
  spinner.start(
    `Starting ${chalk.green(
      "sequential"
    )} execution of commands with ${description}\n\n`
  );
  try {
    for (const dirPath of dirPaths) {
      for (const command of commands) {
        const { pass, message } = await execCommand(dirPath, command);
        pass ? signale.success(message) : signale.error(message);
      }
    }
    spinner.succeed(
      `Finished ${chalk.green("sequential")} execution of commands`
    );
  } catch (error) {
    spinner.fail(`Failed ${chalk.green("sequential")} execution of commands`);
    signale.error(error);
  }
}

export { execCommandsParallel, execCommandsSequential };
