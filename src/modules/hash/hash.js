import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import crypto from 'node:crypto';

import { handleInputError, handleOperationFailure } from '../err/error.js';

export const calcHash = async (...args) => {
  if (!args || args.length !== 1) {
    handleInputError();
    return;
  }

  const hash = crypto.createHash('sha256');

  try {
    const filePath = path.resolve(args[0]);
    const fd = await fs.open(filePath);
    const readable = fd.createReadStream();

    readable.pipe(hash).setEncoding('hex').pipe(process.stdout);

    await new Promise((resolve, reject) => {
      readable.on('end', () => {
        process.stdout.write(os.EOL);
        resolve();
      });
      readable.on('error', reject);
    });
  } catch {
    handleOperationFailure();
  }
};
