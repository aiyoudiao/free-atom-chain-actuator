# free-atom-chain-actuator

An interpreter function executor, support a variety of functions, such as batch replacement of files, batch replacement of content, batch execution of commands.  These functions can be reversed, can be increased or decreased, like a chain of atoms.

一个解释功能的执行器，支持多种功能，比如 批量替换文件，批量替换内容，批量执行命令。这些功能是可以调换顺序，可以增加，也可以减少，就像原子组成的链。

## Notes 说明

**node >= 14.17.0**

## Installation 安装

```bash
npm i -g ifaca
```

## Use 使用

```bash
ifaca
```

如果你的运行目录中没有setting.json文件，那么当你运行这行命令时会自动在当前目录下生成一个setting.json文件的配置，配置如下：

``` js
[
  {
    name: "replace-in-files",
    type: "replace-in-files", // 操作的类型，这里是替换文件中的内容
    description: "replace-in-files",
    setting: [
      {
        description: "replace-in-files",
        // 定义旧内容和新内容，旧的内容将会被新内容所替代
        oldContents: ["旧内容"],
        newContents: ["新内容"],
        // 定义要匹配的文件路径和要排除的目录，
        dirPaths: ["dir1", "dir2", "dir3"],
        // 定义文本文件的扩展名和 MIME 类型
        textFileExtensions: [".js", ".html", ".css", ".txt"],
        textMimeTypes: [
          "text/javascript",
          "text/html",
          "text/css",
          "text/plain",
        ],
      },
    ],
  },
  {
    name: "replace-files",
    type: "replace-files", // 操作文件的类型，这里是替换文件
    description: "replace-files",
    setting: [
      {
        description: "replace-files",
        // 定义旧文件的目录和旧的文件全名，这里是多对多，oldDirPaths 旧的目录中的所有旧的文件 oldFullFileNames 将被删除
        oldDirPaths: ["dir1", "dir2", "dir3"],
        oldFullFileNames: [
          "oldFullFileName1.ttf",
          "oldFullFileName2.ttf",
          "oldFullFileName3.ttf",
          "oldFullFileName4.ttf",
          "oldFullFileName5.ttf",
        ],
        // 定义新文件的目录和新的文件全名，这里也是多对多，newDirPaths 新的目录中的所有新的文件 newFullFileNames 将被复制到旧的目录中中去
        newDirPaths: ["dir1", "dir2", "dir3"],
        newFullFileNames: [
          "newFullFileName1.ttf",
          "newFullFileName2.ttf",
          "newFullFileName3.ttf",
          "newFullFileName4.ttf",
          "newFullFileName5.ttf",
          "newFullFileName6.ttf",
          "newFullFileName7.ttf",
          "newFullFileName8.ttf",
          "newFullFileName9.ttf",
          "newFullFileName10.ttf",
        ],
      },
    ],
  },
  {
    name: "batch-cmd:parallel",
    type: "batch-cmd:parallel", // 操作文件的类型，这里是并行的执行命令
    description: "batch-cmd:parallel",
    setting: [
      {
        description: "batch-cmd:parallel",
        // 定义对应的目录和要执行的命令
        dirPaths: ["dirPath1", "dirPath2", "dirPath3"],
        commands: ["command1", "command2", "command3"],
      },
    ],
  },
  {
    name: "batch-cmd:sequential",
    type: "batch-cmd:sequential", // 操作文件的类型，这里是串行的执行命令
    description: "batch-cmd:sequential",
    setting: [
      {
        description: "batch-cmd:sequential",
        // 定义对应的目录和要执行的命令
        dirPaths: ["dirPath1", "dirPath2", "dirPath3"],
        commands: ["command1", "command2", "command3"],
      },
    ],
  },
];
```

If you do not have a setting.json file in your directory, then when you run this command, a setting.json file configuration will be generated automatically in the current directory, as follows:

```
[
  {
    name: "replace-in-files",
    type: "replace-in-files", // The type of operation, in this case replacing the contents of a file
    description: "replace-in-files",
    setting: [
      {
        description: "replace-in-files",
        // define the old content and the new content. The old content will be replaced by the new content
        oldContents: [" old contents "],
        newContents: [" New contents "],
        // define file paths to match and directories to exclude,
        dirPaths: ["dir1", "dir2", "dir3"],
        // Define the text file extension and MIME type
        textFileExtensions: [".js", ".html", ".css", ".txt"],
        textMimeTypes: [
          "text/javascript",
          "text/html",
          "text/css",
          "text/plain",
        ],
      },
    ],
  },
  {
    name: "replace-files",
    type: "replace-files", // Manipulate the file type, in this case replace files
    description: "replace-files",
    setting: [
      {
        description: "replace-files",
        // define the old file directory and file name, here is the many-to-many, oldDirPaths oldFullFileNames directory of all the old files of old will be deleted
        oldDirPaths: ["dir1", "dir2", "dir3"],
        oldFullFileNames: [
          "oldFullFileName1.ttf",
          "oldFullFileName2.ttf",
          "oldFullFileName3.ttf",
          "oldFullFileName4.ttf",
          "oldFullFileName5.ttf",
        ],
        // define the new file directory and the new file full name, here again many-to-many, newDirPaths all new files in the new directory newFullFileNames will be copied to the old directory
        newDirPaths: ["dir1", "dir2", "dir3"],
        newFullFileNames: [
          "newFullFileName1.ttf",
          "newFullFileName2.ttf",
          "newFullFileName3.ttf",
          "newFullFileName4.ttf",
          "newFullFileName5.ttf",
          "newFullFileName6.ttf",
          "newFullFileName7.ttf",
          "newFullFileName8.ttf",
          "newFullFileName9.ttf",
          "newFullFileName10.ttf",
        ],
      },
    ],
  },
  {
    name: "batch-cmd:parallel",
    type: "batch-cmd:parallel", // The type of file to operate on, in this case the command to execute in parallel
    description: "batch-cmd:parallel",
    setting: [
      {
        description: "batch-cmd:parallel",
        // Define the directory and command to execute
        dirPaths: ["dirPath1", "dirPath2", "dirPath3"],
        commands: ["command1", "command2", "command3"],
      },
    ],
  },
  {
    name: "batch-cmd:sequential",
    type: "batch-cmd:sequential", // The type of file to operate on, in this case serial
    description: "batch-cmd:sequential",
    setting: [
      {
        description: "batch-cmd:sequential",
        // Define the directory and command to execute
        dirPaths: ["dirPath1", "dirPath2", "dirPath3"],
        commands: ["command1", "command2", "command3"],
      },
    ],
  },
];
```

请按照要求更改json中的数据，不然程序的内置的检查不会通过，最终程序无法执行，如果你想了解程序运转的机制，安装完程序后，请到clone github代码，然后到demo目录去运行命令。

**注意：一个解释功能的执行器，支持多种功能，比如 批量替换文件，批量替换内容，批量执行命令。这些功能是可以调换顺序，可以增加，也可以减少，就像原子组成的链。**


Please change the json data as required, otherwise the built-in check of the program will not pass, and the final program will not execute. If you want to understand how the program works, after installing the program, please go to clone github code, and then go to the demo directory to run the command.

**NOTE: An interpreter function executor, support a variety of functions, such as batch replacement of files, batch replacement of content, batch execution of commands.  These functions can be reversed, can be increased or decreased, like a chain of atoms.**

