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
    name: "invite",
    aliases: ['invitebot', 'inviteme', 'inv'],
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
                .setTitle(await languageControl(message.guild, 'INVITE_SUPPORT_TITLE'))
                .setDescription(await stringTemplateParser(await languageControl(message.guild, 'INVITE_SUPPORT_DESC'), {
                    botInvite: config.Discord_Links.invite_link_recommended,
                    discordInvite: config.Discord_Links.Support_Server
                }))
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