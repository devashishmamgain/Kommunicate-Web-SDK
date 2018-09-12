/**
 * this will pick config file from external specified directory
 * while runnig server using the  following command
 * node app.js --config /users/anand/repo/webplugin/conf/config-default.json
 */
const externalConfig = process.argv.indexOf('--config') !== -1;
const configPath = externalConfig ? process.argv[process.argv.indexOf('--config')+1]: __dirname+'/config.json';
try {
  require(configPath);
} catch (err) {
  console.log("\x1b[41m------ unable to find config file path:",configPath," -----\x1b[0m");
  process.exit(0);
}
const config = require(configPath);
exports.config = config; 
module.exports.getProperties = function() {
  return config;
};