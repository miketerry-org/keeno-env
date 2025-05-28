// index.js: keeno-env entry point

"use strict";

// load all necessary modules
const loadEncryptKey = require("./lib/loadEncryptKey");
const loadEnvFile = require("./lib/loadEnvFile");
const mergeIntoProcessEnv = require("./lib/mergeIntoProcessEnv");

module.exports = { loadEncryptKey, loadEnvFile, mergeIntoProcessEnv };
