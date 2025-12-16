const fs = require("fs");
const util = require("util");
const chalk = require("chalk");
const path = require("path");

const logsDir = path.join(__dirname, "../Logs");
if (!fs.existsSync(logsDir)) {
    fs.mkdirSync(logsDir, { recursive: true });
}
const debugLog = fs.createWriteStream(path.join(logsDir, "Debug.log"), { flags: "a" });
const log_stdout = process.stdout;
const time = () => {
    return `${chalk.grey(new Date().toLocaleString('en-AU', {
        hour: 'numeric',
        minute: 'numeric',
        second: 'numeric',
        timeZone: "Australia/Brisbane",
        hour12: true
    }))}`;
};

Date.prototype.today = function () {
    return `${(this.getDate() < 10 ? "0" : "") + this.getDate()}/${(this.getMonth() + 1 < 10 ? "0" : "") + (this.getMonth() + 1)}/${this.getFullYear()}`;
};
Date.prototype.timeNow = function () {
    return `${(this.getHours() < 10 ? "0" : "") + this.getHours()}:${(this.getMinutes() < 10 ? "0" : "") + this.getMinutes()}:${(this.getSeconds() < 10 ? "0" : "") + this.getSeconds()}`;
};

module.exports = {
    log(source, content) {
        console.log(`[${time()}] ${chalk.blueBright("INFO")} [${source}]: ${content}`);
    },
    warn(source, content) {
        console.log(`[${time()}] ${chalk.yellowBright("WARN")} [${source}]: ${content}`);
    },
    error(source, content) {
        console.log(`[${time()}] ${chalk.redBright("ERROR")} [${source}]: ${content}`);
    },
    writeDebug(data) {
        if(client.settings.bot.debugMode === true && client.settings.bot.developer.includes(interaction.user.id)) {
            const date = new Date().today() + " @ " + new Date().timeNow();
            debugLog.write(`[${date}] ${util.format(data)}\n`);
            log_stdout.write(`[${date}] ${util.format(data)}\n`);
        }
    },
    debug(source, content) {
        console.debug(`[${time()}] ${chalk.magentaBright("DEBUG")} [${source}]: ${content}`);
    },
    clear() {
        console.clear();
    }
};