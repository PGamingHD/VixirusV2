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
        name: 'ping',
        description: 'Get the current Client & API ping.',
        /** 
         * @param {Client} client 
         * @param {Message} message 
         * @param {String[]} args 
         */
        run: async (client, interaction, con, args) => {
            const timeBefore = new Date().getTime();
            await con.query('SELECT 1');
            const timeAfter = new Date().getTime();
            const evaled = timeAfter - timeBefore;

            return interaction.reply({
                embeds: [
                    new EmbedBuilder()
                    .setColor(ee.color)
                    .setAuthor({
                        name: `Pong`,
                        iconURL: client.user.displayAvatarURL()
                    })
                    .addFields([{
                        name: await languageControl(interaction.guild, 'PING_BOT_LATENCY'),
                        value: `\`\`\`re\n[ ${Math.floor((Date.now() - interaction.createdTimestamp) - 2 * Math.floor(client.ws.ping))}ms ]\`\`\``,
                        inline: true
                    }, {
                        name: await languageControl(interaction.guild, 'PING_API_LATENCY'),
                        value: `\`\`\`re\n[ ${Math.floor(client.ws.ping)}ms ]\`\`\``,
                        inline: true
                    }, {
                        name: await languageControl(interaction.guild, 'PING_DB_LATENCY'),
                        value: `\`\`\`re\n[ ${evaled}ms ]\`\`\``
                    }])
                    .setTimestamp()
                    .setFooter({
                        text: stringTemplateParser(await languageControl(interaction.guild, 'PING_REQUEST_BY'), {interactionUsername: interaction.user.username}),
                        iconURL: interaction.user.displayAvatarURL()
                    })
                ]
            })
        }
    }