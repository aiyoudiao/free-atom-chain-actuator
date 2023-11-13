import chalk from "chalk";
import signale from "signale";

import replaceFiles from "./replace-files.js";
import replaceInFiles from "./replace-in-files.js";
import { execCommandsParallel, execCommandsSequential } from "./batch-cmd.js";

const loop = async (setting, featureCall) => {
  let settings = setting;
  if (!Array.isArray(setting)) {
    settings = [setting];
  }

  for (const setting of settings) {
    return await featureCall(setting);
  }
};

const featureStrategies = {
  "replace-files": async (setting) => await loop(setting, replaceFiles),
  "replace-in-files": async (setting) => await loop(setting, replaceInFiles),
  "batch-cmd:parallel": async (setting) =>
    await loop(setting, execCommandsParallel),
  "batch-cmd:sequential": async (setting) =>
    await loop(setting, execCommandsSequential),
};

export default async (atomChain) => {
  for (const atom of atomChain) {
    const feature = featureStrategies[`${atom.type}`];
    if (feature) {
      try {
        signale.start(
          `Starting ${chalk.green(atom.type)} feature with atom ${chalk.blue(
            JSON.stringify(atom.name)
          )}\n\n`
        );
        await feature(atom.setting);
        signale.complete(
          `Finished ${chalk.green(atom.type)} feature with atom ${chalk.blue(
            JSON.stringify(atom.name)
          )}\n\n`
        );
      } catch (error) {
        signale.error(
          `Failed to execute ${chalk.green(
            atom.type
          )} feature with atom ${chalk.blue(
            JSON.stringify(atom.name)
          )}: ${error}`
        );
      }
    } else {
      signale.warn(`Unknown feature type: ${chalk.red(atom.type)}`);
    }
  }
};
