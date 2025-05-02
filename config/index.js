const fs = require("fs");
const path = require("path");

const setConfig = ({ env }) => {
  console.log(`++ Environment:`, env);

  const configPath = path.join(__dirname, `config.json`);
  const configFile = fs.readFileSync(configPath, "utf-8");
  const config = JSON.parse(configFile);
  const defaultConfig = config["default"];
  const envConfig = config[env];

  process.env = { ...process.env, ...defaultConfig, ...envConfig };
};

module.exports = {
  setConfig,
};
