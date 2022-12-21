const {
    Client,
    CommandInteraction,
    MessageEmbed,
    MessageActionRow,
    MessageButton,
    EmbedBuilder,
    ApplicationCommandOptionType,
    PermissionFlagsBits,
    ChannelType
} = require('discord.js');
const ee = require('../../botconfig/embed.json');
const emoji = require('../../botconfig/embed.json')
const prettyMilliseconds = require('pretty-ms');
const config = require('../../botconfig/config.json');
const {
    genGuid,
    modLog
} = require("../../handler/functions");
const fs = require("fs");

module.exports = {
    name: 'lockdown',
    description: 'Completely lockdown the server, in case of emergency only.',
    module: 'mod',
    options: [{
        name: 'minutes',
        description: 'The minutes you want to lockdown the server for.',
        type: ApplicationCommandOptionType.Integer,
        required: true
    }, {
        name: 'reason',
        description: 'The reason for issuing a server-wide lockdown.',
        type: ApplicationCommandOptionType.String,
        required: true
    }],
    /** 
     * @param {Client} client
     * @param {Message} message
     * @param {String[]} args
     */
    run: async (client, interaction, con, args) => {
        let lockdownMinutes = interaction.options.getInteger('minutes');
        const lockdownReason = interaction.options.getString('reason');
        const everyoneRole = interaction.guild.roles.everyone;

        if (!interaction.channel.permissionsFor(interaction.guild.members.me).has(PermissionFlagsBits.ManageChannels)) {
            return interaction.reply({
                embeds: [
                    new EmbedBuilder()
                    .setColor(ee.errorColor)
                    .setTitle(`:x: Error :x:`)
                    .setDescription(`***It seems like I do not currently have the \`Manage Channels\` permission.***`)
                ],
                ephemeral: true
            });
        };

        if (!await client.lockdownCmd.has(`${interaction.guild.id}`)) {
            return interaction.reply({
                embeds: [
                    new EmbedBuilder()
                    .setColor(ee.errorColor)
                    .setTitle(`:x: Error :x:`)
                    .setDescription(`***Woops, looks like this command is currently disabled.***`)
                ]
            })
        }

        if (lockdownMinutes <= 0) {
            lockdownMinutes = 1;
        }

        if (lockdownMinutes > 1440) {
            lockdownMinutes = 1440;
        }

        await interaction.reply({
            embeds: [
                new EmbedBuilder()
                .setColor(ee.maintenanceColor)
                .setTitle(`:warning: !Lockdown Initiated! :warning:`)
                .addFields([{
                    name: 'Moderator',
                    value: `\`\`\`${interaction.user.username}#${interaction.user.discriminator}\`\`\``,
                    inline: true
                }, {
                    name: 'Duration',
                    value: `\`\`\`${lockdownMinutes} minute(s)\`\`\``,
                    inline: true
                }, {
                    name: 'Reason',
                    value: `\`\`\`${lockdownReason}\`\`\``,
                }])
                .setTimestamp()
                .setThumbnail(`https://cdn.discordapp.com/attachments/1010999257899204769/1053662138251624488/hammer.png`)
            ]
        });

        await interaction.guild.channels.cache.filter(channel => channel.type === ChannelType.GuildText && channel.permissionsFor(everyoneRole).has(PermissionFlagsBits.SendMessages) && channel.permissionsFor(everyoneRole).has(PermissionFlagsBits.ViewChannel)).map(async (channel) => {
            await channel.permissionOverwrites.set([{
                id: interaction.guild.id,
                deny: [PermissionFlagsBits.SendMessages]
            }]);

            setTimeout(async () => {

                await channel.permissionOverwrites.set([{
                    id: interaction.guild.id,
                    allow: [PermissionFlagsBits.SendMessages]
                }]);

            }, 1000 * 60 * lockdownMinutes);
        });

        try {
            await modLog(interaction.guild, {
                embeds: [
                    new EmbedBuilder()
                    .setColor(ee.maintenanceColor)
                    .setTitle(`:warning: Lockdown Initiated :warning:`)
                    .addFields([{
                        name: 'Duration',
                        value: `\`\`\`${lockdownMinutes} minute(s)\`\`\``,
                        inline: true
                    }, {
                        name: 'Reason',
                        value: `\`\`\`${lockdownReason}\`\`\``,
                        inline: true
                    }, {
                        name: 'Moderator',
                        value: `\`\`\`${interaction.user.username}#${interaction.user.discriminator} (${interaction.user.id})\`\`\``,
                    }])
                    .setThumbnail(`https://cdn.discordapp.com/attachments/1010999257899204769/1054749803193585714/support.png`)
                    .setTimestamp()
                ]
            });
        } catch {}

        setTimeout(async () => {
            await interaction.editReply({
                embeds: [
                    new EmbedBuilder()
                    .setColor(ee.color)
                    .setTitle(`:white_check_mark: !Lockdown Lifted! :white_check_mark:`)
                    .addFields([{
                        name: 'Moderator',
                        value: `\`\`\`${interaction.user.username}#${interaction.user.discriminator}\`\`\``,
                        inline: true
                    }, {
                        name: 'Reason',
                        value: `\`\`\`${lockdownReason}\`\`\``,
                    }])
                ]
            })

            setTimeout(async () => {
                await interaction.deleteReply();
            }, 1000 * 30);
        }, 1000 * 60 * lockdownMinutes);
    }
}