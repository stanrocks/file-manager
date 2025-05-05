import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';

import {
  handleOperationFailure,
  logCustomError,
  handleInputError,
} from '../err/error.js';
import { ERROR_MSG_INIT_WORK_DIR } from '../err/constants.js';
import { TITLE_DIR, TITLE_FILE } from './constants.js';

export const setInitialWorkingDirectory = () => {
  const homeDirectoryPath = os.homedir();

  try {
    process.chdir(homeDirectoryPath);
  } catch (error) {
    logCustomError(error, ERROR_MSG_INIT_WORK_DIR);
  }
};

export const navToParentDir = (...args) => {
  if (args.length > 0) {
    handleInputError();
    return;
  }

  const cwd = process.cwd();
  const root = path.parse(cwd).root;

  if (path.resolve(cwd) === path.resolve(root)) {
    return;
  }

  try {
    process.chdir(path.dirname(cwd));
  } catch {
    handleOperationFailure();
  }
};

export const changeDir = (...args) => {
  if (!args || args.length !== 1) {
    handleInputError();
    return;
  }

  const targetPath = path.resolve(args[0]);

  try {
    process.chdir(targetPath);
  } catch {
    handleOperationFailure();
  }
};

export const listFiles = async (...args) => {
  if (args.length > 0) {
    handleInputError();
    return;
  }

  try {
    const entries = await fs.readdir(process.cwd(), { withFileTypes: true });

    entries.sort((a, b) => {
      if (a.isDirectory() && !b.isDirectory()) {
        return -1;
      } else if (!a.isDirectory() && b.isDirectory()) {
        return 1;
      } else {
        return a.name.localeCompare(b.name);
      }
    });

    const fileInfo = entries.map((dirent) => {
      return {
        Name: dirent.name,
        Type: dirent.isDirectory() ? TITLE_DIR : TITLE_FILE,
      };
    });

    console.table(fileInfo);
  } catch {
    handleOperationFailure();
  }
};
