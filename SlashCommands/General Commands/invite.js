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
    } = require("../../handler/functions");

    module.exports = {
        name: 'invite',
        description: 'Interested in inviting me, or maybe joining our support server?',
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
                    .setTitle(await languageControl(interaction.guild, 'INVITE_SUPPORT_TITLE'))
                    .setDescription(await languageControl(interaction.guild, 'INVITE_SUPPORT_DESC'))
                ]
            })
        }
    }