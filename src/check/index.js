import chalk from "chalk";
import signale from "signale";

import {
  checkParallelCommandSetting,
  checkSequentialCommandSetting,
} from "./batch-cmd.js";
import checkReplaceFilesSetting from "./replace-files.js";
import checkReplaceInFilesSetting from "./replace-in-files.js";

const syncLoop = (setting, featureCall) => {
  let settings = setting;
  if (!Array.isArray(setting)) {
    settings = [setting];
  }

  return settings.every((setting) => featureCall(setting));
};

const checkSettingStrategies = {
  "replace-files": (setting) => syncLoop(setting, checkReplaceFilesSetting),
  "replace-in-files": (setting) =>
    syncLoop(setting, checkReplaceInFilesSetting),
  "batch-cmd:parallel": (setting) =>
    syncLoop(setting, checkParallelCommandSetting),
  "batch-cmd:sequential": (setting) =>
    syncLoop(setting, checkSequentialCommandSetting),
};

export default (atomChain) => {
  const checkAllPass = atomChain?.every((atom) => {
    const check = checkSettingStrategies[`${atom.type}`];
    let pass = false;
    if (check) {
      try {
        signale.start(
          `Starting ${chalk.green(atom.type)} check with atom ${chalk.blue(
            JSON.stringify(atom.name)
          )}`
        );
        pass = check(atom.setting);
        if (!pass) {
          signale.error(
            `Failed ${chalk.green(atom.type)} check with atom ${chalk.blue(
              JSON.stringify(atom.name)
            )}`
          );
          return pass;
        }

        signale.complete(
          `Finished ${chalk.green(atom.type)} check with atom ${chalk.blue(
            JSON.stringify(atom.name)
          )}`
        );
      } catch (error) {
        signale.error(
          `Failed to execute ${chalk.green(
            atom.type
          )} check with atom ${chalk.blue(JSON.stringify(atom.name))}: ${error}`
        );
      }
    } else {
      signale.warn(`Unknown check type: ${chalk.red(atom.type)}`);
    }

    signale.log();
    return pass;
  });

  return {
    pass: checkAllPass,
  };
};
