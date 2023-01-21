const {
    Client,
    CommandInteraction,
    MessageEmbed,
    MessageActionRow,
    MessageButton,
    EmbedBuilder,
    ApplicationCommandOptionType
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
    name: 'afk',
    description: 'Set yourself as AFK with a specific reason, users pinging you will be given the reason for AFK.',
    options: [{
        name: 'reason',
        description: 'The reason you wish to go AFK for.',
        type: ApplicationCommandOptionType.String,
        required: true
    }],
    /** 
     * @param {Client} client 
     * @param {Message} message 
     * @param {String[]} args 
     */
    run: async (client, interaction, args) => {
        if (await client.usersAFK.has(`${interaction.user.id}`)) return interaction.reply({
            content: ':x: You are already AFK! :x:',
            ephemeral: true
        });

        const reason = interaction.options.getString('reason');
        await client.usersAFK.set(`${interaction.user.id}`, reason);

        return interaction.reply({
            content: ':white_check_mark: You are now marked as AFK, simply talk to stop it',
            ephemeral: true
        });
    }
}