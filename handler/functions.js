const {
    MessageEmbed,
    Collection,
    EmbedBuilder,
    WebhookClient,
    AttachmentBuilder
} = require("discord.js");
const client = require("../index");
const Discord = require("discord.js")
const emoji = require("../botconfig/emojis.json");
const config = require("../botconfig/config.json");
const ee = require("../botconfig/embed.json");
const fs = require("fs");
const {
    v4: uuidv4
} = require('uuid');

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
module.exports.guildHasData = guildHasData;
module.exports.globalChat = globalChat;
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
    let ADM = AD.getMonth() + 1;
    let ADD = AD.getDate();
    let ADH = AD.getHours();
    let ADMI = AD.getMinutes();
    let ADS = AD.getSeconds();

    if (ADD < 10) {
        ADD = '0' + AD.getDate();
    }
    if (ADM < 10) {
        ADM = '0' + ADM;
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

async function guildHasData(guild, pool) {
    if (client.cachedWelcomeMessages.has(guild.id)) return true;

    await pool.query(`INSERT INTO guild_data(data_ServerId) VALUES("${guild.id}")`);
    await pool.query(`INSERT INTO guild_commands(command_ServerId) VALUES("${guild.id}")`);
    await pool.query(`INSERT INTO guild_modules(module_ServerId) VALUES("${guild.id}")`);
    await pool.query(`INSERT INTO guild_logs(log_ServerId) VALUES("${guild.id}")`);

    //STARTER VALUES THAT MUST BE RE-SET!
    await client.cachedGuildLanguages.set(`${guild.id}`, "en");
    await client.cachedServerPrefixes.set(`${guild.id}`, "v!");
    await client.cachedWelcomeMessages.set(`${guild.id}`, "Hey {user}, welcome to **{server}**!");
    await client.cachedWelcomeChannels.set(`${guild.id}`, null);
    await client.cachedLeaveMessages.set(`${guild.id}`, "{user} just left the server!");
    await client.cachedLeaveChannels.set(`${guild.id}`, null);
    await client.cachedPrivateMessages.set(`${guild.id}`, "Have a great time in **{server}**!");
    await client.cachedMuteds.set(`${guild.id}`, "0")
    await client.cachedModLogs.set(`${guild.id}`, "0")
    await client.cachedLoggingChannels.set(`${guild.id}`, "0")
    await client.serverGlobal.set(`${guild.id}`, "0")
    
    await client.funmodule.set(`${guild.id}`, "Fun Enabled!");

    await client.slowmodeCmd.set(`${guild.id}`, "SlowmodeCMD Enabled!");
    await client.banCmd.set(`${guild.id}`, "BanCMD Enabled!");
    await client.warnCmd.set(`${guild.id}`, "WarnCMD Enabled!");
    await client.kickCmd.set(`${guild.id}`, "KickCMD Enabled!");
    await client.lockdownCmd.set(`${guild.id}`, "LockdownCMD Enabled!");
    await client.muteCmd.set(`${guild.id}`, "MuteCMD Enabled!");
    await client.timeoutCmd.set(`${guild.id}`, "TimeoutCMD Enabled!");
    await client.nickCmd.set(`${guild.id}`, "NicknameCMD Enabled!");
    await client.purgeCmd.set(`${guild.id}`, "PurgeCMD Enabled!");

    await client.roleUpdate.set(`${guild.id}`, "RoleUpdate Enabled!");
    await client.roleDelete.set(`${guild.id}`, "RoleDelete Enabled!");
    await client.roleCreate.set(`${guild.id}`, "RoleCreate Enabled!");
    await client.messageUpdate.set(`${guild.id}`, "MessageUpdate Enabled!");
    await client.messageDelete.set(`${guild.id}`, "MessageDelete Enabled!");
    await client.guildUpdate.set(`${guild.id}`, "GuildUpdate Enabled!");
    await client.guildBanRemove.set(`${guild.id}`, "GuildBanRemove Enabled!");
    await client.guildBanAdd.set(`${guild.id}`, "GuildBanAdd Enabled!");
    await client.emojiUpdate.set(`${guild.id}`, "EmojiUpdate Enabled!");
    await client.emojiDelete.set(`${guild.id}`, "EmojiDelete Enabled!");
    await client.emojiCreate.set(`${guild.id}`, "EmojiCreate Enabled!");
    await client.channelUpdate.set(`${guild.id}`, "ChannelUpdate Enabled!");
    await client.channelDelete.set(`${guild.id}`, "ChannelDelete Enabled!");
    await client.channelCreate.set(`${guild.id}`, "ChannelCreate Enabled!");
    await client.guildMemberRemove.set(`${guild.id}`, "GuildMemberRemove Enabled!");
    await client.guildMemberAdd.set(`${guild.id}`, "GuildMemberAdd Enabled!");
    await client.roleUpdates.set(`${guild.id}`, "RoleUpdatez Enabled!");
    await client.nicknameUpdates.set(`${guild.id}`, "NicknameUpdates Enabled!");
    await client.avatarUpdates.set(`${guild.id}`, "AvatarUpdates Enabled!");
    await client.timeoutUpdates.set(`${guild.id}`, "TimeoutUpdates Enabled!");

    return false;
}

async function modLog(guild, returnObject) {
    const logChannel = await client.cachedModLogs.get(`${guild.id}`);
    if (logChannel !== "0") {
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

async function globalChat(message) {
    if (!await client.globalmodule.has(`${message.guild.id}`)) return;
    if (await client.globalChats.get('chats').length < 1) return;

    const chats = await client.globalChats.get('chats');
    if (!chats.includes(message.channel.id)) return;
    if (config.Global_Chat.Banned_Users.includes(message.author.id)) return;
    let chatRank = emoji.user;

    if (config.Global_Chat.VIP_Rank.includes(message.author.id)) {
        chatRank = emoji.vip;
    }

    if (config.Global_Chat.Premium_Rank.includes(message.author.id)) {
        chatRank = emoji.premium;
    }

    if (config.Global_Chat.Special_Rank.includes(message.author.id)) {
        chatRank = emoji.special;
    }

    if (config.Global_Chat.Support_Rank.includes(message.author.id)) {
        chatRank = emoji.support;
    }

    if (config.Global_Chat.Mod_Rank.includes(message.author.id)) {
        chatRank = emoji.moderator;
    }

    if (config.Global_Chat.Admin_Rank.includes(message.author.id)) {
        chatRank = emoji.administrator;
    }

    if (config.Global_Chat.Developer_Rank.includes(message.author.id)) {
        chatRank = emoji.developer
    }

    for (let i = 0; i < chats.length; i++) {
        if (chats[i] === message.channel.id) continue;

        try {
            const channelChat = await client.channels.fetch(chats[i]);

            await channelChat.send({
                content: `**[${message.guild.id === "1010999169676222514" ? "Support Server" : message.guild.name}] ${chatRank} ${message.author.tag}:** ${message.content}`
            })
        } catch {}
    }
}