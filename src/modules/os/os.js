import os from 'node:os';
import { handleInputError } from '../err/error.js';

export const osInfo = (...args) => {
  if (!args || args.length !== 1) {
    handleInputError();
    return;
  }

  switch (args[0]) {
    case '--EOL':
      console.log(JSON.stringify(os.EOL));
      break;

    case '--cpus':
      const cpus = os.cpus();
      console.log(`Number of CPUs: ${cpus.length}`);
      cpus.forEach((cpu, index) => {
        console.log(`CPU ${index + 1}: ${cpu.model}, ${cpu.speed / 1000} GHz`);
      });
      break;

    case '--homedir':
      console.log(os.homedir());
      break;

    case '--username':
      console.log(os.userInfo().username);
      break;

    case '--architecture':
      console.log(os.arch());
      break;

    default:
      handleInputError();
  }
};
