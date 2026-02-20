/* eslint-disable @typescript-eslint/no-require-imports */
require('dotenv').config();

const path = require('path');
const dir = path.join(__dirname);

process.env.NODE_ENV = 'production';
process.chdir(dir);

// Load the standalone server which has bundled node_modules
require('./.next/standalone/server.js');
