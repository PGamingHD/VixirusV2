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
    genGuid
} = require("../../handler/functions");
const fs = require("fs");

module.exports = {
    name: 'unban',
    description: 'Unban a member from your Guild.',
    module: 'mod',
    options: [{
        name: 'memberid',
        description: 'The member you wish to unban.',
        type: ApplicationCommandOptionType.String,
        required: true
    }, {
        name: 'reason',
        description: 'The reason for unbanning this member.',
        type: ApplicationCommandOptionType.String,
        required: true
    }],
    /** 
     * @param {Client} client
     * @param {Message} message
     * @param {String[]} args
     */
    run: async (client, interaction, con, args) => {
        const memberToBan = interaction.options.getString('memberid');
        const banReason = interaction.options.getString('reason');
        const caseID = genGuid();

        try {
            var fetchBan = await interaction.guild.bans.fetch(memberToBan)
        } catch (e) {
            if (e.message === "Unknown Ban") {
                return interaction.reply({
                    embeds: [
                        new EmbedBuilder()
                        .setColor(ee.errorColor)
                        .setTitle(`:x: Error :x:`)
                        .setDescription(`***It seems like there is no user with that UserID that is banned.***`)
                    ],
                    ephemeral: true
                })
            }
        }

        if (!interaction.guild.members.me.permissions.has(PermissionFlagsBits.BanMembers)) {
            return interaction.reply({
                embeds: [
                    new EmbedBuilder()
                    .setColor(ee.errorColor)
                    .setTitle(`:x: Error :x:`)
                    .setDescription(`***It seems like I do not currently have the \`Ban Members\` permission.***`)
                ],
                ephemeral: true
            });
        };

        if (interaction.user.id === memberToBan) {
            return interaction.reply({
                embeds: [
                    new EmbedBuilder()
                    .setColor(ee.errorColor)
                    .setTitle(`:x: Error :x:`)
                    .setDescription(`***You may not unban yourself from the server.***`)
                ],
                ephemeral: true
            });
        }


        if (memberToBan === client.user.id) {
            return interaction.reply({
                embeds: [
                    new EmbedBuilder()
                    .setColor(ee.errorColor)
                    .setTitle(`:x: Error :x:`)
                    .setDescription(`***You may not unban me from the server.***`)
                ],
                ephemeral: true
            })
        }

        if (interaction.guild.ownerId === memberToBan) {
            return interaction.reply({
                embeds: [
                    new EmbedBuilder()
                    .setColor(ee.errorColor)
                    .setTitle(`:x: Error :x:`)
                    .setDescription(`***You may not unban the Guild Owner.***`)
                ],
                ephemeral: true
            });
        }

        await interaction.guild.members.unban(memberToBan, `[UNBAN] Reason: ${banReason} | Moderator: ${interaction.user.username}#${interaction.user.discriminator}`);

        return interaction.reply({
            embeds: [
                new EmbedBuilder()
                .setColor(ee.color)
                .setTitle(`:white_check_mark: Member was Unbanned :white_check_mark:`)
                .addFields([{
                    name: 'Moderator',
                    value: `\`\`\`${interaction.user.username}#${interaction.user.discriminator}\`\`\``,
                    inline: true
                }, {
                    name: 'Target',
                    value: `\`\`\`${fetchBan.user.username}#${fetchBan.user.discriminator}\`\`\``,
                    inline: true
                }, {
                    name: 'Reason',
                    value: `\`\`\`${banReason}\`\`\``
                }])
                .setFooter({
                    text: `Case ID: ${caseID}`
                })
                .setThumbnail(`https://cdn.discordapp.com/attachments/1010999257899204769/1053662138251624488/hammer.png`)
            ]
        });
    }
}