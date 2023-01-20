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
    name: "dashboard",
    aliases: ['db', 'dashb', 'dash'],
    userPerms: [],
    clientPerms: [],
    /**
     *
     * @param {Client} client
     * @param {Message} message
     * @param {String[]} args
     */
    run: async (client, message, args, con) => {
        return message.reply({
            embeds: [
                new EmbedBuilder()
                .setColor(ee.color)
                .setTitle('Dashboard Link')
                .setDescription(`*Configure your bot trough the [dashboard](${config.Discord_Dashboard.Dashboard_domain})!*`)
            ]
        })
    },
};

/*

Code used in this script has been written by original PizzaParadise developer - PGamingHD#0666
Require assistance with scripts? Join the discord and get help right away! - https://discord.gg/pxySje4GPC
Other than that, please do note that it is required if you are using this to mention the original developer
Original Developer - PGamingHD#0666

*/