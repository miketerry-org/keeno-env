// loadEnvFile.js:

"use strict";

const fs = require("fs");
const path = require("path");
const system = require("keeno-schema"); // assumes system.fatal exists
const TopSecret = require("topsecret");
const isJsonLike = require("./isJsonLike.js");
const { coercePrimitive } = require("keeno-system");
const createReadOnlyObject = require("./createReadOnlyObject");

/**
 * Load and validate environment configuration from a file.
 *
 * @param {string} filename - Path to the env file.
 * @param {Object|null} schema - Optional schema validator with .validate().
 * @param {string|null} encryptKey - Optional decryption key if file is encrypted.
 * @param {Object} [options] - Optional config.
 * @param {boolean} [options.verbose=false] - Print loaded keys.
 * @returns {Object} Read-only configuration object.
 */
function loadEnvFile(filename, schema, encryptKey = null, options = {}) {
  const { verbose = false } = options;
  const resolvedPath = path.resolve(process.cwd(), filename);

  if (!fs.existsSync(resolvedPath)) {
    system.fatal(`Configuration file not found: ${resolvedPath}`);
  }

  let raw;

  if (!encryptKey) {
    raw = fs.readFileSync(resolvedPath, "utf-8");
  } else {
    const ts = new TopSecret();
    ts.key = encryptKey;
    raw = ts.decryptBufferFromFile(resolvedPath);
  }

  const lines = raw.split(/\r?\n/);
  const rawValues = {};

  lines.forEach(line => {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) return;

    const [name, ...rest] = trimmed.split("=");
    if (!name) return;

    const key = name.trim();

    // Strip inline comment and trim again
    let value = rest
      .join("=")
      .replace(/\s+#.*$/, "")
      .trim();

    if (isJsonLike(value)) {
      try {
        value = JSON.parse(value);
      } catch {
        // fallback to plain string
      }
    } else {
      value = coercePrimitive(value);
    }

    rawValues[key] = value;
  });

  let validated = rawValues;

  if (schema) {
    const { validated: result, errors } = schema.validate(rawValues);

    if (errors && errors.length > 0) {
      const message = [
        `Fatal configuration error(s) detected in "${filename}":`,
        ...errors.map(err => `- ${err.field}: ${err.message}`),
      ].join("\n");
      system.fatal(message);
    }

    validated = result;
  }

  if (verbose) {
    console.log(`Loaded configuration from "${filename}":`);
    Object.entries(validated).forEach(([key, value]) => {
      const display = typeof value === "object" ? JSON.stringify(value) : value;
      console.log(`  ${key} = ${display}`);
    });
  }

  return createReadOnlyObject(validated);
}

module.exports = loadEnvFile;
