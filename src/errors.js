"use strict";

const errors = {
  "EGENERIC": "An unspecified error has occured.",
  "ENOTFOUND": "The service does not exist or does not support this language.",
  "ENOACCESS": "You are not authenticated or authorized to read this information.",
  "ENOLANG": "The specified language could not be found in the ISO 639-2 database.",
  "EBADREQUEST": "The provided request body contains one or multiple errors."
};

const buildError = name => {
  let err = new Error(errors[name]);
  err.name = name;
  return err;
};

const buildErrorWithMessage = (name, message) => {
  let err = new Error(errors[name]);
  err.name = name;
  err.message = message;
  return err;
};

module.exports = Object.assign(errors, {buildError, buildErrorWithMessage});
