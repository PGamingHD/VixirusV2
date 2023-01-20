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
        name: 'invite',
        description: 'Interested in inviting me, or maybe joining our support server',
        userPerms: [],
        clientPerms: [],
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
                    .setTitle('Want to join our Support Server or Invite me?')
                    .setDescription(`**Invite Me [Recommended]**\n[Invite Link](${config.Discord_Links.invite_link_recommended})\n**Invite Me [Admin]**\n[Invite Link](${config.Discord_Links.invite_link_admin})\n\n**Support Server**\n[Support](${config.Discord_Links.Support_Server})`)
                ]
            })
        }
    }