const {
    Client,
    CommandInteraction,
    MessageEmbed,
    MessageActionRow,
    MessageButton,
    EmbedBuilder
} = require('discord.js');
const ee = require('../../botconfig/embed.json');
const emoji = require('../../botconfig/embed.json')
const prettyMilliseconds = require('pretty-ms');
const config = require('../../botconfig/config.json');
const {
    languageControl,
    stringTemplateParser
} = require("../../handler/functions");

module.exports = {
    name: 'dashboard',
    description: 'Interested in controlling me from my dashboard? Use this command to get the dashboard link',
    /** 
     * @param {Client} client 
     * @param {Message} message 
     * @param {String[]} args 
     */
    run: async (client, interaction, args) => {
        return interaction.reply({
            embeds: [
                new EmbedBuilder()
                .setColor(ee.color)
                .setTitle('Dashboard Link')
                .setDescription('**!COMING SOON!**')
            ]
        })
    }
}