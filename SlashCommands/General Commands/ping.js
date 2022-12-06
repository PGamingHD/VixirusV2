    const {
        Client,
        CommandInteraction,
        MessageEmbed,
        MessageActionRow,
        MessageButton,
        EmbedBuilder,
        PermissionFlagsBits,
    } = require('discord.js');
    const ee = require('../../botconfig/embed.json');
    const emoji = require('../../botconfig/embed.json')
    const prettyMilliseconds = require('pretty-ms');
    const config = require('../../botconfig/config.json');
    const {
        languageControl,
        stringTemplateParser,
        confirmGuildData
    } = require("../../handler/functions");

    module.exports = {
        name: 'ping',
        description: 'Get the current Client & API ping.',
        userPerms: [],
        clientPerms: [],
        cooldown: 10,
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

            const main = await interaction.reply({
                content: 'Pinging...',
                fetchReply: true
            });

            return interaction.editReply({
                embeds: [
                    new EmbedBuilder()
                    .setColor(ee.color)
                    .setAuthor({
                        name: `Pong`,
                        iconURL: client.user.displayAvatarURL()
                    })
                    .addFields([{
                        name: await languageControl(interaction.guild, 'PING_BOT_LATENCY'),
                        value: `\`\`\`re\n[ ${Math.floor(main.createdTimestamp - interaction.createdTimestamp)}ms ]\`\`\``,
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
                        text: stringTemplateParser(await languageControl(interaction.guild, 'PING_REQUEST_BY'), {
                            interactionUsername: interaction.user.username
                        }),
                        iconURL: interaction.user.displayAvatarURL()
                    })
                ],
                content: ''
            })
        }
    }