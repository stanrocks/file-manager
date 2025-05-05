import {
  ERROR_MSG_INVALID_INPUT,
  ERROR_MSG_OPERATION_FAILED,
} from './constants.js';

export const handleInputError = () => {
  console.error(ERROR_MSG_INVALID_INPUT);
};

export const handleOperationFailure = () => {
  console.error(ERROR_MSG_OPERATION_FAILED);
};

export const logCustomError = (error, customMessage) => {
  console.error(customMessage);
  console.error(error.message);
};
