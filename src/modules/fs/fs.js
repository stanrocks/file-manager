import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';

import { handleInputError, handleOperationFailure } from '../err/error.js';

export const readFile = async (...args) => {
  if (!args || args.length !== 1) {
    handleInputError();
    return;
  }

  const filePath = path.resolve(args[0]);

  let fd;

  try {
    fd = await fs.open(filePath);
    const readable = fd.createReadStream();

    readable.pipe(process.stdout);

    await new Promise((resolve, reject) => {
      readable.on('end', () => {
        process.stdout.write(os.EOL);
        resolve();
      });
      readable.on('error', reject);
    });
  } catch {
    handleOperationFailure();
  } finally {
    if (fd) {
      try {
        await fd.close();
      } catch {
        handleOperationFailure();
      }
    }
  }
};

export const createFile = async (...args) => {
  if (!args || args.length !== 1) {
    handleInputError();
    return;
  }

  const dirName = process.cwd();
  const filePath = path.join(dirName, args[0]);
  const content = '';
  const options = { flag: 'wx' };

  try {
    await fs.writeFile(filePath, content, options);
  } catch {
    handleOperationFailure();
  }
};

export const createDir = async (...args) => {
  if (!args || args.length !== 1) {
    handleInputError();
    return;
  }

  const dirName = process.cwd();
  const newDirPath = path.join(dirName, args[0]);

  try {
    await fs.mkdir(newDirPath, { recursive: false });
  } catch {
    handleOperationFailure();
  }
};

export const renameFile = async (...args) => {
  if (!args || args.length !== 2) {
    handleInputError();
    return;
  }

  const oldPath = path.resolve(args[0]);
  const parentDir = path.dirname(oldPath);
  const newPath = path.join(parentDir, args[1]);

  try {
    await fs.rename(oldPath, newPath);
  } catch {
    handleOperationFailure();
  }
};

export const copyFile = async (...args) => {
  if (!args || args.length !== 2) {
    handleInputError();
    return;
  }

  const sourcePath = path.resolve(args[0]);
  const targetDir = path.resolve(args[1]);
  const targetFilePath = path.join(targetDir, path.basename(sourcePath));
  const options = 'wx';

  let fdr;
  let fdw;

  try {
    fdr = await fs.open(sourcePath);
    fdw = await fs.open(targetFilePath, options);

    const readable = fdr.createReadStream();
    const writable = fdw.createWriteStream();

    readable.pipe(writable);

    await new Promise((resolve, reject) => {
      readable.on('error', reject);
      writable.on('error', reject);
      writable.on('finish', resolve);
    });
  } catch (error) {
    handleOperationFailure();
  } finally {
    if (fdr) {
      try {
        await fdr.close();
      } catch {
        handleOperationFailure();
      }
    }

    if (fdw) {
      try {
        await fdw.close();
      } catch {
        handleOperationFailure();
      }
    }
  }
};

export const removeFile = async (...args) => {
  if (!args || args.length !== 1) {
    handleInputError();
    return;
  }

  const filePath = path.resolve(args[0]);

  try {
    await fs.rm(filePath);
  } catch (error) {
    handleOperationFailure();
  }
};

export const moveFile = async (...args) => {
  if (!args || args.length !== 2) {
    handleInputError();
    return;
  }

  const sourcePath = path.resolve(args[0]);
  const targetDir = path.resolve(args[1]);

  try {
    await copyFile(sourcePath, targetDir);
    await removeFile(sourcePath);
  } catch (error) {
    handleOperationFailure();
  }
};
