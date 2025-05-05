import fs from 'node:fs/promises';
import path from 'node:path';
import { pipeline } from 'node:stream';
import { createBrotliCompress, createBrotliDecompress } from 'node:zlib';
import { handleInputError, handleOperationFailure } from '../err/error.js';

export const compress = async (...args) => {
  if (!args || args.length !== 2) {
    handleInputError();
    return;
  }

  const options = 'wx';

  const sourcePath = path.resolve(args[0]);
  const targetPath = path.resolve(args[1]);

  try {
    const fdr = await fs.open(sourcePath);
    const fdw = await fs.open(targetPath, options);

    const readable = fdr.createReadStream();
    const writable = fdw.createWriteStream();
    const bCompress = createBrotliCompress();

    pipeline(readable, bCompress, writable, (err) => {
      if (err) {
        handleOperationFailure();
      }
    });
  } catch {
    handleOperationFailure();
  }
};

export const decompress = async (...args) => {
  if (!args || args.length !== 2) {
    handleInputError();
    return;
  }

  const options = 'wx';

  const sourcePath = path.resolve(args[0]);
  const targetPath = path.resolve(args[1]);

  try {
    const fdr = await fs.open(sourcePath);
    const fdw = await fs.open(targetPath, options);

    const readable = fdr.createReadStream();
    const writable = fdw.createWriteStream();
    const bDecompress = createBrotliDecompress();

    pipeline(readable, bDecompress, writable, (err) => {
      if (err) {
        handleOperationFailure();
      }
    });
  } catch {
    handleOperationFailure();
  }
};
