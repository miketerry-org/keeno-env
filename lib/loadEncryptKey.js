// loadEncryptKey.js:  load encryption key from file into process.env

// load all necessary modules
const path = require("path");
const fs = require("fs");
const system = require("keeno-system");

// if not in production then attempt to load encryption key from file
if (!system.isProduction) {
  // the "_secret.key" file should be in the application root directory
  const filename = path.join(process.cwd(), "_secret.key");

  // if file exists then read it into process.env
  if (fs.existsSync(filename)) {
    process.env.ENCRYPT_KEY = fs.readFileSync(filename, "utf-8");
  }
}

// fatal error if encryption key is undefined or incrrect length
if (!process.env.ENCRYPT_KEY || process.env.ENCRYPT_KEY.length !== 64) {
  system.fatal("Encryption key used for configuration files is undefined");
}

// return the current value of the encryption key stored in the process environment variables
module.exports = process.env.ENCRYPT_KEY;
