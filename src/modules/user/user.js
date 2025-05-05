import {
  ANON_USERNAME,
  MSG_BYE_1,
  MSG_BYE_2,
  MSG_WELCOME_1,
  MSG_WELCOME_2,
  USERNAME_ARG_PREFIX,
} from './constants.js';

const getUsername = () => {
  const argsArr = process.argv.slice(2);
  const usernameItem = argsArr.find((item) =>
    item.startsWith(USERNAME_ARG_PREFIX)
  );

  if (usernameItem) {
    const usernameValue = usernameItem.substring(USERNAME_ARG_PREFIX.length);
    return usernameValue || ANON_USERNAME;
  }

  return ANON_USERNAME;
};

const username = getUsername();

export const sayHi = () => {
  console.log(MSG_WELCOME_1 + username + MSG_WELCOME_2);
};

export const sayBye = () => {
  console.log(MSG_BYE_1 + username + MSG_BYE_2);
};
