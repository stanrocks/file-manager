import fs from 'node:fs';
import path from 'node:path';
import { pipeline } from 'node:stream/promises';
import { createBrotliCompress, createBrotliDecompress } from 'node:zlib';
import { handleInputError, handleOperationFailure } from '../err/error.js';

export const compress = async (...args) => {
  if (!args || args.length !== 2) {
    handleInputError();
    return;
  }

  const options = { flags: 'wx' };

  const sourcePath = path.resolve(args[0]);
  const targetPath = path.resolve(args[1]);

  try {
    const readable = fs.createReadStream(sourcePath);
    const writable = fs.createWriteStream(targetPath, options);
    const bCompress = createBrotliCompress();

    await pipeline(readable, bCompress, writable);
  } catch (error) {
    console.log('Compression. Error during pipeline operation', error);
    handleOperationFailure();
  }
};

export const decompress = async (...args) => {
  if (!args || args.length !== 2) {
    handleInputError();
    return;
  }

  const options = { flags: 'wx' };

  const sourcePath = path.resolve(args[0]);
  const targetPath = path.resolve(args[1]);

  try {
    const readable = fs.createReadStream(sourcePath);
    const writable = fs.createWriteStream(targetPath, options);
    const bDecompress = createBrotliDecompress();

    await pipeline(readable, bDecompress, writable);
  } catch {
    handleOperationFailure();
  }
};
