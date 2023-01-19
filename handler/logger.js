const chalk = require("chalk");
const moment = require("moment");

module.exports = class Logger {
  static log(content, type = "log") {
    const date = `${moment().format("DD-MM-YYYY hh:mm:ss")}`;
    switch (type) {
      case "log": {
        return console.log(
          `[${chalk.gray(date)}]: [${chalk.black.bgBlue(
            type.toUpperCase()
          )}] ${chalk.blue(content)}`
        );
      }
      case "warn": {
        return console.log(
          `[${chalk.gray(date)}]: [${chalk.black.bgYellow(
            type.toUpperCase()
          )}] ${chalk.yellow(content)}`
        );
      }
      case "error": {
        return console.log(
          `[${chalk.gray(date)}]: [${chalk.black.bgRed(
            type.toUpperCase()
          )}] ${chalk.red(content)}`
        );
      }
      case "debug": {
        return console.log(
          `[${chalk.gray(date)}]: [${chalk.black.bgGreen(
            type.toUpperCase()
          )}] ${chalk.green(content)}`
        );
      }
      case "cmd": {
        return console.log(
          `[${chalk.gray(date)}]: [${chalk.black.bgWhite(
            type.toUpperCase()
          )}] ${chalk.white(content)}`
        );
      }
      case "event": {
        return console.log(
          `[${chalk.gray(date)}]: [${chalk.black.bgWhite(
            type.toUpperCase()
          )}] ${chalk.white(content)}`
        );
      }
      case "ready": {
        return console.log(
          `[${chalk.gray(date)}]: [${chalk.black.bgBlueBright(
            type.toUpperCase()
          )}] ${chalk.blueBright(content)}`
        );
      }
      case "ratelimit": {
        return console.log(
          `[${chalk.gray(date)}]: [${chalk.black.yellow(
            type.toUpperCase()
          )}] ${chalk.yellow(content)}`
        );
      }
      case "noperms": {
        return console.log(
          `[${chalk.gray(date)}]: [${chalk.black.bgRed(
            type.toUpperCase()
          )}] ${chalk.red(content)}`
        );
      }
      case "guildjoin": {
        return console.log(
          `[${chalk.gray(date)}]: [${chalk.black.bgGreen(
            type.toUpperCase()
          )}] ${chalk.green(content)}`
        );
      }
      case "guildleave": {
        return console.log(
          `[${chalk.gray(date)}]: [${chalk.black.bgRed(
            type.toUpperCase()
          )}] ${chalk.red(content)}`
        );
      }
      default:
        throw new TypeError(
          "Logger type must be either warn, debug, log, ready, cmd or error."
        );
    }
  }
};
