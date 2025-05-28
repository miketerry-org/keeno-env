// index.js: keeno-env entry point

"use strict";

// load all necessary modules
const loadEncryptKey = require("./lib/loadEncryptKey");
const loadEnvFile = require("./lib/loadEnvFile");

module.exports = { loadEncryptKey, loadEnvFile };
