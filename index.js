// index.js: keeno-env entry point

"use strict";

// this module must be loaded first so the process.env.ENCRYPT_KEY can be verified
require("./lib/loadEncryptKey");

// load all necessary modules
const loadEnvFile = require("./lib/loadEnvFile");

module.exports = { loadEnvFile };
