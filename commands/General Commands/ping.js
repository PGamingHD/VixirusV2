const {
    Message,
    Client,
    MessageEmbed,
    MessageActionRow,
    MessageButton,
    EmbedBuilder
} = require("discord.js");
const emoji = require("../../botconfig/emojis.json")
const ee = require("../../botconfig/embed.json");
const config = require("../../botconfig/config.json");
const {
    languageControl,
    stringTemplateParser
} = require("../../handler/functions");

module.exports = {
    name: "ping",
    userPerms: [],
    clientPerms: [],
    /**
     *
     * @param {Client} client
     * @param {Message} message
     * @param {String[]} args
     */
    run: async (client, message, args, con) => {
        const timeBefore = new Date().getTime();
        con.query(`SELECT 1`);
        const timeAfter = new Date().getTime();
        const evaled = timeAfter - timeBefore;

        const main = await message.reply({
            content: 'Pinging...',
            fetchReply: true
        });

        return main.edit({
            embeds: [
                new EmbedBuilder()
                .setColor(ee.color)
                .setAuthor({
                    name: `Pong`,
                    iconURL: client.user.displayAvatarURL()
                })
                .addFields([{
                    name: await languageControl(message.guild, 'PING_BOT_LATENCY'),
                    value: `\`\`\`re\n[ ${Math.floor(main.createdTimestamp - message.createdTimestamp)}ms ]\`\`\``,
                    inline: true
                }, {
                    name: await languageControl(message.guild, 'PING_API_LATENCY'),
                    value: `\`\`\`re\n[ ${Math.floor(client.ws.ping)}ms ]\`\`\``,
                    inline: true
                }, {
                    name: await languageControl(message.guild, 'PING_DB_LATENCY'),
                    value: `\`\`\`re\n[ ${evaled}ms ]\`\`\``
                }])
                .setTimestamp()
                .setFooter({
                    text: stringTemplateParser(await languageControl(message.guild, 'PING_REQUEST_BY'), {
                        interactionUsername: message.author.username
                    }),
                    iconURL: message.author.displayAvatarURL()
                })
            ],
            content: ''
        })
    },
};

/*

Code used in this script has been written by original PizzaParadise developer - PGamingHD#0666
Require assistance with scripts? Join the discord and get help right away! - https://discord.gg/pxySje4GPC
Other than that, please do note that it is required if you are using this to mention the original developer
Original Developer - PGamingHD#0666

*/