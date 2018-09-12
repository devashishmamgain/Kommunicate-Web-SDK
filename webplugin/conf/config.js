/**
 * this will pick config file from external specified directory
 * while runnig server using the  following command
 * node app.js --config /users/anand/repo/webplugin/conf/config-default.json
 */
const externalConfig = process.argv.indexOf('--config') !== -1;
const configPath = externalConfig ? process.argv[process.argv.indexOf('--config')+1]: __dirname+'/config.json';
if (!require('fs').existsSync(configPath)) { 
  console.error("\x1b[31m------------ config file not exist -----------------\x1b[0m")
  process.exit(0);
}
const config = require(configPath);
exports.config = config; 
module.exports.getProperties = function() {
  return config;
};