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
    name: 'purge',
    description: 'Purge a specific amount of messages from the channel.',
    module: 'mod',
    options: [{
        name: 'amount',
        description: 'The amount of messages you wish to purge.',
        type: ApplicationCommandOptionType.Integer,
        required: true
    }, {
        name: 'channel',
        description: 'The channel you wish to purge messages from.',
        type: ApplicationCommandOptionType.User,
    }],
    /** 
     * @param {Client} client
     * @param {Message} message
     * @param {String[]} args
     */
    run: async (client, interaction, con, args) => {
        let purgeChannel = interaction.options.getChannel('channel');
        let purgeAmount = interaction.options.getInteger('amount');

        if (!interaction.channel.permissionsFor(interaction.guild.members.me).has(PermissionFlagsBits.ManageMessages)) {
            return interaction.reply({
                embeds: [
                    new EmbedBuilder()
                    .setColor(ee.errorColor)
                    .setTitle(`:x: Error :x:`)
                    .setDescription(`***It seems like I do not currently have the \`Manage Messages\` permission.***`)
                ],
                ephemeral: true
            });
        };

        if (!purgeChannel) purgeChannel = interaction.channel;

        if (purgeAmount <= 0) {
            purgeAmount = 1;
        }

        if (purgeAmount > 100) {
            purgeAmount = 100;
        }

        const purged = await purgeChannel.bulkDelete(purgeAmount, true);

        try {
            await modLog(interaction.guild, {
                embeds: [
                    new EmbedBuilder()
                    .setColor(ee.maintenanceColor)
                    .setTitle(`:warning: Messages Purged :warning:`)
                    .addFields([{
                        name: 'Amount Purged',
                        value: `\`\`\`${purged.size} message(s)\`\`\``,
                        inline: true
                    }, {
                        name: 'Channel',
                        value: `${purgeChannel}`,
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

        await interaction.reply({
            content: ':white_check_mark:',
            ephemeral: true
        });

        const msg = await purgeChannel.send({
            embeds: [
                new EmbedBuilder()
                .setColor(ee.color)
                .setTitle(`:white_check_mark: Channel was Purged :white_check_mark:`)
                .addFields([{
                    name: 'Moderator',
                    value: `\`\`\`${interaction.user.username}#${interaction.user.discriminator}\`\`\``,
                    inline: true
                }, {
                    name: 'Purged',
                    value: `\`\`\`${purged.size} message(s)\`\`\``,
                    inline: true
                }])
                .setTimestamp()
                .setThumbnail(`https://cdn.discordapp.com/attachments/1010999257899204769/1053662138251624488/hammer.png`)
            ]
        });

        setTimeout(async () => {
            return await msg.delete();
        }, 1000 * 15);
    }
}