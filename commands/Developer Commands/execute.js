const {
    Message,
    Client,
    EmbedBuilder
} = require("discord.js");
const emoji = require("../../botconfig/emojis.json");
const ee = require("../../botconfig/embed.json");
const config = require("../../botconfig/config.json");
const {
    exec,
    execSync
} = require('child_process');

module.exports = {
    name: "execute", //userMoney, userBank, userBitcoin, userID (ALL USERVALUES)
    aliases: ['exec'],
    userPerms: [],
    clientPerms: [],
    /**
     *
     * @param {Client} client
     * @param {Message} message
     * @param {String[]} args
     */
    
    run: async (client, message, args) => {
        if (!config.DEVELOPER_IDS.includes(message.author.id)) return;
        if (!args || args.length === 0) {
            return message.reply('Must provide args to execute!');
        }
        const execLine = args.join(' ');
        exec(`${execLine}`, {
            encoding: 'utf-8'
        });
    }
}