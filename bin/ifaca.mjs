#!/usr/bin/env node
import signale from "signale";
import chalk from "chalk";
import ifaca from "../lib/main.js";

signale.log(`
${chalk.bgGreen(
  "一个解释功能的执行器，支持多种功能，比如 批量替换文件，批量替换内容，批量执行命令。这些功能是可以调换顺序，可以增加，也可以减少，就像原子组成的链。"
)}
${chalk.bgBlue(
  "An interpreter function executor, support a variety of functions, such as batch replacement of files, batch replacement of content, batch execution of commands.  These functions can be reversed, can be increased or decreased, like a chain of atoms."
)}`);

signale.log(`
${chalk.green(`
如果你的运行目录中没有setting.json文件，那么当你运行这行命令时会自动在当前目录下生成一个setting.json文件的配置。
请按照要求更改json中的数据，不然程序的内置的检查不会通过，最终程序无法执行，如果你想了解程序运转的机制，安装完程序后，请到clone github代码，然后到demo目录去运行命令。`)}
${chalk.blue(`If you do not have a setting.json file in your directory, then when you run this command, a setting.json file configuration will be generated automatically in the current directory.
Please change the json data as required, otherwise the built -in check of the program will not pass, and the final program will not execute.If you want to understand how the program works, after installing the program, please go to clone github code, and then go to the demo directory to run the command.
  `)}
`);

(async () => {
  await ifaca();
})();
