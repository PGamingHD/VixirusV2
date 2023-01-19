const {
    Client,
    CommandInteraction,
    MessageEmbed,
    MessageActionRow,
    MessageButton,
    EmbedBuilder,
    ApplicationCommandOptionType,
    PermissionFlagsBits
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
    name: 'slowmode',
    description: 'Set channel slowmode in a specific channel.',
    module: 'mod',
    options: [{
        name: 'seconds',
        description: 'The amount of seconds you wish to set slowmode in the channel for.',
        type: ApplicationCommandOptionType.Integer,
        required: true
    }, {
        name: 'channel',
        description: 'The channel you wish to set slowmode in.',
        type: ApplicationCommandOptionType.Channel,
    }],
    /** 
     * @param {Client} client
     * @param {Message} message
     * @param {String[]} args
     */
    run: async (client, interaction, con, args) => {
        let channelToSM = interaction.options.getChannel('channel');
        let smRate = interaction.options.getInteger('seconds');

        if (channelToSM === null) {
            channelToSM = interaction.channel;
        }

        if (!channelToSM.permissionsFor(interaction.guild.members.me).has(PermissionFlagsBits.ManageChannels)) {
            return interaction.reply({
                embeds: [
                    new EmbedBuilder()
                    .setColor(ee.errorColor)
                    .setTitle(`:x: Error :x:`)
                    .setDescription(`***It seems like I do not currently have the \`Manager Channels\` permission.***`)
                ],
                ephemeral: true
            });
        };

        if (!await client.slowmodeCmd.has(`${interaction.guild.id}`)) {
            return interaction.reply({
                embeds: [
                    new EmbedBuilder()
                    .setColor(ee.errorColor)
                    .setTitle(`:x: Error :x:`)
                    .setDescription(`***Woops, looks like this command is currently disabled.***`)
                ]
            })
        }

        if (smRate < 0) {
            smRate = 0;
        }

        if (smRate > 21600) {
            smRate = 21600;
        }

        await channelToSM.setRateLimitPerUser(smRate, `[SLOWMODE] Moderator: ${interaction.user.username}#${interaction.user.discriminator}`);

        await interaction.reply({content: ':white_check_mark:', ephemeral: true});

        try {
            await modLog(interaction.guild, {
                embeds: [
                    new EmbedBuilder()
                    .setColor(ee.maintenanceColor)
                    .setTitle(`:warning: Slowmode Changed :warning:`)
                    .addFields([{
                        name: 'Rate',
                        value: `\`\`\`${smRate === 0 ? 'Slowmode Disabled' : `1 msg/${smRate}s`}\`\`\``,
                        inline: true
                    }, {
                        name: 'Channel',
                        value: `${channelToSM}`,
                        inline: true
                    }, {
                        name: 'Moderator',
                        value: `\`\`\`${interaction.user.username}#${interaction.user.discriminator} (${interaction.user.id})\`\`\``,
                    }])
                    .setThumbnail(`https://cdn.discordapp.com/attachments/1010999257899204769/1065641669950709770/mod.png`)
                    .setTimestamp()
                ]
            });
        } catch {}

        return channelToSM.send({
            embeds: [
                new EmbedBuilder()
                .setColor(ee.color)
                .setTitle(`:white_check_mark: Slowmode was Changed :white_check_mark:`)
                .addFields([{
                    name: 'Moderator',
                    value: `\`\`\`${interaction.user.username}#${interaction.user.discriminator}\`\`\``,
                    inline: true
                }, {
                    name: 'Rate',
                    value: `\`\`\`${smRate === 0 ? 'Slowmode Disabled' : `1 msg/${smRate}s`}\`\`\``
                }])
                .setTimestamp()
                .setThumbnail(`https://cdn.discordapp.com/attachments/1010999257899204769/1053662138251624488/hammer.png`)
            ]
        });
    }
}