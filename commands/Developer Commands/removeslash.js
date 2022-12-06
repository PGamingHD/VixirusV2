const {
    Message,
    Client,
    EmbedBuilder
} = require("discord.js");
const emoji = require("../../botconfig/emojis.json")
const ee = require("../../botconfig/embed.json");
const config = require("../../botconfig/config.json")

module.exports = {
    name: "removeslash", //userMoney, userBank, userBitcoin, userID (ALL USERVALUES)
    aliases: ['removeslashcmd', 'removeslashcmds'],
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
        client.application?.commands.set([]);

        return message.reply({
            embeds: [
                new EmbedBuilder()
                .setColor("AA00FF")
                .setDescription(`Global slash commands removed upon request.`),
            ],
        });
    },
};