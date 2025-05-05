import * as readline from 'node:readline/promises';
import { stdin as input, stdout as output } from 'node:process';
import os from 'node:os';

import { sayHi, sayBye } from '../user/user.js';
import { MSG_CWD, MSG_DEFAULT_USER_PROMPT, EXIT_COMMAND } from './constants.js';
import { handleInputError, handleOperationFailure } from '../err/error.js';
import {
  setInitialWorkingDirectory,
  navToParentDir,
  changeDir,
  listFiles,
} from '../nwd/navWorkDir.js';
import {
  readFile,
  createFile,
  createDir,
  renameFile,
  copyFile,
  moveFile,
  removeFile,
} from '../fs/fs.js';
import { osInfo } from '../os/os.js';
import { calcHash } from '../hash/hash.js';
import { compress, decompress } from '../zip/zip.js';

const rl = readline.createInterface({ input, output });

const exitFileManager = () => {
  sayBye();
  rl.close();
  process.exit(0);
};

const commands = {
  [EXIT_COMMAND]: () => exitFileManager(),
  up: navToParentDir,
  cd: changeDir,
  ls: listFiles,
  cat: readFile,
  add: createFile,
  mkdir: createDir,
  rn: renameFile,
  cp: copyFile,
  mv: moveFile,
  rm: removeFile,
  os: osInfo,
  hash: calcHash,
  compress,
  decompress,
};

const handleCommand = async () => {
  while (true) {
    try {
      const currentWorkingDirectory = process.cwd();
      const prompt = `${MSG_CWD}${currentWorkingDirectory}${os.EOL}${MSG_DEFAULT_USER_PROMPT}${os.EOL}`;
      const commandInput = await rl.question(prompt);
      const [command, ...args] = commandInput.trim().split(/\s+/);

      if (commands.hasOwnProperty(command)) {
        await commands[command](...(args || []));

        if (command === EXIT_COMMAND) {
          break;
        }
      } else {
        handleInputError();
      }
    } catch (error) {
      handleOperationFailure();
    }
  }
};

export const app = async () => {
  sayHi();
  setInitialWorkingDirectory();

  await handleCommand();
};

rl.on('SIGINT', () => {
  exitFileManager();
});
