const {
    MessageEmbed,
    Collection,
    EmbedBuilder,
    WebhookClient,
    AttachmentBuilder
} = require("discord.js");
const client = require("../index");
const Discord = require("discord.js")
const config = require("../botconfig/config.json");
const ee = require("../botconfig/embed.json");
const fs = require("fs");
const {
    v4: uuidv4
} = require('uuid');
const logchannel = require("../dashboard/settings/5logging/logchannel");

//MODULE EXPORTS
module.exports.stringTemplateParser = stringTemplateParser;
module.exports.languageControl = languageControl;
module.exports.escapeRegex = escapeRegex;
module.exports.calculatePercentage = calculatePercentage;
module.exports.hintgame = hintgame;
module.exports.escapeRegex = escapeRegex;
module.exports.writeError = writeError;
module.exports.genGuid = genGuid;
module.exports.dateNow = dateNow;
module.exports.modLog = modLog;
module.exports.LoggerLog = LoggerLog;
//FUNCTIONS

async function languageControl(guild, translateLine) {
    const guildLanguageRows = client.cachedGuildLanguages.get(`${guild.id}`);
    let guildLanguage = 'en';
    if (guildLanguageRows !== undefined) {
        guildLanguage = guildLanguageRows;
    }

    const dataFile = require(`../language/${guildLanguage}.json`)
    let translatedLine = dataFile[`${translateLine}`];

    if (translatedLine === undefined) {
        translatedLine = 'Invalid translation name'
    }

    return translatedLine;
}

function stringTemplateParser(expression, valueObj) {
    const templateMatcher = /{\s?([^{}\s]*)\s?}/g;
    let text = expression.replace(templateMatcher, (substring, value, index) => {
        value = valueObj[value];
        return value;
    });
    return text
}

function escapeRegex(str) {
    try {
        return str.replace(/[.*+?^${}()|[\]\\]/g, `\\$&`);
    } catch (e) {
        console.log(String(e.stack).bgRed)
    }
}

function calculatePercentage(smallNumber, bigNumber) {
    return (smallNumber / bigNumber) * 100;
}

function hintgame(word) {
    var a = word;
    var splitted = a.split('');
    var count = 0; // variable where i keep trace of how many _ i have inserted

    while (count < a.length / 2) {
        var index = Math.floor(Math.random() * a.length); //generate new index
        if (splitted[index] !== '_' && splitted[index] !== ' ') {
            splitted[index] = '_';
            count++;
        }
    }

    return splitted.join("");
}

function escapeRegex(str) {
    try {
        return str.replace(/[.*+?^${}()|[\]\\]/g, `\\$&`);
    } catch (e) {
        console.log(String(e.stack).bgRed)
    }
}

function writeError(error, guild) {
    try {
        const AD = new Date;
        const ADY = AD.getFullYear();
        let ADM = AD.getMonth();
        let ADD = AD.getDate();
        let ADH = AD.getHours();
        let ADMI = AD.getMinutes();
        let ADS = AD.getSeconds();

        if (ADD < 10) {
            ADD = '0' + AD.getDate();
        }
        if (ADM < 10) {
            ADM = '0' + AD.getMonth();
        }
        if (ADH < 10) {
            ADH = '0' + AD.getHours();
        }
        if (ADMI < 10) {
            ADMI = '0' + AD.getMinutes();
        }
        if (ADS < 10) {
            ADS = '0' + AD.getSeconds();
        }

        const msg = `[${ADY}/${ADM}/${ADD} ${ADH}:${ADMI}:${ADS}] - ` + error.message + '\r\n';
        fs.appendFileSync(`./dashboard/errors/${guild.id}.txt`, msg);
    } catch (error) {
        console.log("ERROR WRITING ERROR FILE:", error)
    }
}

function dateNow() {
    const AD = new Date;
    const ADY = AD.getFullYear();
    let ADM = AD.getMonth();
    let ADD = AD.getDate();
    let ADH = AD.getHours();
    let ADMI = AD.getMinutes();
    let ADS = AD.getSeconds();

    if (ADD < 10) {
        ADD = '0' + AD.getDate();
    }
    if (ADM < 10) {
        ADM = '0' + AD.getMonth();
    }
    if (ADH < 10) {
        ADH = '0' + AD.getHours();
    }
    if (ADMI < 10) {
        ADMI = '0' + AD.getMinutes();
    }
    if (ADS < 10) {
        ADS = '0' + AD.getSeconds();
    }

    return `${ADY}-${ADM}-${ADD} ${ADH}:${ADMI}:${ADS}`;
}

function genGuid() {
    return uuidv4();
}

async function modLog(guild, returnObject) {
    const logChannel = await client.cachedModLogs.get(`${guild.id}`);
    if (client.modlogmodule.has(`${guild.id}`) && logChannel !== "0") {
        try {
            const actualChannel = await guild.channels.fetch(logChannel);
            return await actualChannel.send(returnObject);
        } catch {}
    } else {
        return;
    }
}

async function LoggerLog(guild, returnObject) {
    const logChannel = await client.cachedLoggingChannels.get(`${guild.id}`);
    if (client.loggingmodule.has(`${guild.id}`) && logChannel !== "0") {
        try {
            const loggerChannel = await guild.channels.fetch(logChannel);
            return await loggerChannel.send(returnObject);
        } catch {}
    } else {
        return;
    }
}