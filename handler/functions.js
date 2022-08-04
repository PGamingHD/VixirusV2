const {
    MessageEmbed,
    Collection,
    EmbedBuilder,
    WebhookClient
} = require("discord.js");
const client = require("../index");
const Discord = require("discord.js")
const config = require("../botconfig/config.json");
const ee = require("../botconfig/embed.json");
const {
    v4: uuidv4
} = require("uuid");
const adminLogs = new WebhookClient({
    url: config.ADMIN_LOGS
});

//MODULE EXPORTS
module.exports.stringTemplateParser = stringTemplateParser;
module.exports.languageControl = languageControl;
module.exports.escapeRegex = escapeRegex;
module.exports.calculatePercentage = calculatePercentage;
module.exports.hintgame = hintgame;
//FUNCTIONS

async function languageControl(guild, translateLine) {
    const [guildLanguageRows, guildLanguageFields] = await client.connection.query(`SELECT language_current FROM language_data WHERE language_serverid = ${guild.id}`);
    let guildLanguage = 'en-US';
    if (guildLanguageRows.length !== 0) {
       guildLanguage = guildLanguageRows[0].language_current
    }

    const dataFile = require(`../language/${guildLanguage}.json`)
    let translatedLine = dataFile[`${translateLine}`];

    if (translatedLine === undefined) {
        translatedLine = 'Invalid translation name'
    }

    return translatedLine
}

    //console.log(stringTemplateParser('my name is {{name}} and age is {{age}}', {name: 'Tom', age:100}));
function stringTemplateParser(expression, valueObj) {
    const templateMatcher = /{{\s?([^{}\s]*)\s?}}/g;
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