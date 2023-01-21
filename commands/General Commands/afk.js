const {
    Message,
    Client,
    EmbedBuilder
} = require("discord.js");
const emoji = require("../../botconfig/emojis.json")
const ee = require("../../botconfig/embed.json");
const config = require("../../botconfig/config.json");
const prettyMilliseconds = require("pretty-ms");
const {
    languageControl,
    stringTemplateParser
} = require("../../handler/functions")

module.exports = {
    name: "afk",
    aliases: ['setafk', 'awayfromkeyboard'],
    userPerms: [],
    clientPerms: [],
    /**
     *
     * @param {Client} client
     * @param {Message} message
     * @param {String[]} args
     */
    run: async (client, message, args, con) => {
        if (!args[0]) {
            return message.reply({
                ceontnt: ':x: Please insert a reason for wanting to be marked as AFK :x:'
            })
        }

        const reason = args.join(` `);
        await client.usersAFK.set(`${message.author.id}`, reason);

        return message.reply({
            content: ':white_check_mark: You are now marked as AFK, simply talk to stop it'
        });
    },
};

/*

Code used in this script has been written by original PizzaParadise developer - PGamingHD#0666
Require assistance with scripts? Join the discord and get help right away! - https://discord.gg/pxySje4GPC
Other than that, please do note that it is required if you are using this to mention the original developer
Original Developer - PGamingHD#0666

*/