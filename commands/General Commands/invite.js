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
                .setTitle('Want to join our Support Server or Invite me?')
                .setDescription(`**Invite Me**\n[Invite link (RECOMMENDED)](${config.Discord_Links.invite_link_recommended})\n**Invite Me**\n[Invite link (ADMIN)](${config.Discord_Links.invite_link_admin})\n\n**Support Server**\n[Support](${config.Discord_Links.Support_Server})`)
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