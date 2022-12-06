const {
    Message,
    Client,
    EmbedBuilder
} = require("discord.js");
const emoji = require("../../botconfig/emojis.json")
const ee = require("../../botconfig/embed.json");
const config = require("../../botconfig/config.json")

module.exports = {
    name: "shutdown", //userMoney, userBank, userBitcoin, userID (ALL USERVALUES)
    aliases: ['shutd', 'sd'],
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

        await message.reply({
            embeds: [
                new EmbedBuilder()
                .setColor(ee.color)
                .setDescription(`Message recieved, shutting down...`),
            ],
        });
        return process.exit();
    },
};