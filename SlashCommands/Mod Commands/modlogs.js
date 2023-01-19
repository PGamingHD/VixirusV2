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

module.exports = {
    name: 'modlogs',
    description: 'The modlogs channel is the channel where all moderator commands will be logged.',
    options: [{
        name: 'set',
        description: 'Set a new channel for the modlogs module.',
        type: ApplicationCommandOptionType.Subcommand,
        options: [{
            name: 'channel',
            description: 'The channel that you wish to set the modlogs to.',
            type: ApplicationCommandOptionType.Channel,
            required: true
        }]
    }, {
        name: 'enable',
        description: 'Enable the modlogs module.',
        type: ApplicationCommandOptionType.Subcommand
    }, {
        name: 'disable',
        description: 'Disable the modlogs module.',
        type: ApplicationCommandOptionType.Subcommand,
    }],
    /** 
     * @param {Client} client
     * @param {Message} message
     * @param {String[]} args
     */
    run: async (client, interaction, con, args) => {
        if (interaction.user.id !== interaction.guild.ownerId && !interaction.member.permissions.has(PermissionFlagsBits.Administrator)) {
            return interaction.reply({
                embeds: [
                    new EmbedBuilder()
                    .setColor(ee.errorColor)
                    .setTitle(`:x: Missing Permissions :x:`)
                    .setDescription(`***It seems like you do not have the required permissions to execute this command.***`)
                ],
                ephemeral: true
            })
        }

        if (interaction.options.getSubcommand() === "set") {
            const channel = interaction.options.getChannel('channel');

            await client.cachedModLogs.set(`${interaction.guild.id}`, channel.id);
            await con.query(`UPDATE guild_data SET data_modlogs = '${channel.id}' WHERE data_ServerId = ${interaction.guild.id}`);
    
            await interaction.reply({
                embeds: [
                    new EmbedBuilder()
                    .setColor(ee.color)
                    .setTitle(`:warning: Modlogs Channel Changed :warning:`)
                    .addFields([{
                        name: 'Channel',
                        value: `${channel}`,
                    }])
                    .setTimestamp()
                    .setThumbnail(`https://cdn.discordapp.com/attachments/1010999257899204769/1053662138251624488/hammer.png`)
                ],
                ephemeral: true
            });
        }
        if (interaction.options.getSubcommand() === "enable") {
            if (await client.modlogmodule.has(`${interaction.guild.id}`)) {
                return await interaction.reply({
                    embeds: [
                        new EmbedBuilder()
                        .setColor(ee.errorColor)
                        .setTitle(`:x: Error :x:`)
                        .setDescription(`***Woops, looks like the module is already enabled.***`)
                        .setTimestamp()
                    ],
                    ephemeral: true
                });
            }

            await client.modlogmodule.set(`${interaction.guild.id}`, "Modlogs Enabled!");
            await con.query(`UPDATE guild_modules SET module_modlogs = true WHERE module_ServerId = ${interaction.guild.id}`);
    
            return await interaction.reply({
                embeds: [
                    new EmbedBuilder()
                    .setColor(ee.color)
                    .setTitle(`:warning: Modlogs Enabled :warning:`)
                    .setFooter({text: 'NOTE: Please set a modlogs channel if not already done!'})
                    .setTimestamp()
                ],
                ephemeral: true
            });
        }
        if (interaction.options.getSubcommand() === "disable") {
            if (!await client.modlogmodule.has(`${interaction.guild.id}`)) {
                return await interaction.reply({
                    embeds: [
                        new EmbedBuilder()
                        .setColor(ee.errorColor)
                        .setTitle(`:x: Error :x:`)
                        .setDescription(`***Woops, looks like the module is not enabled.***`)
                        .setTimestamp()
                    ],
                    ephemeral: true
                });
            }

            await client.modlogmodule.delete(`${interaction.guild.id}`);
            await con.query(`UPDATE guild_modules SET module_modlogs = false WHERE module_ServerId = ${interaction.guild.id}`);
    
            return await interaction.reply({
                embeds: [
                    new EmbedBuilder()
                    .setColor(ee.color)
                    .setTitle(`:warning: Modlogs Disabled :warning:`)
                    .setTimestamp()
                ],
                ephemeral: true
            });
        }
    }
}