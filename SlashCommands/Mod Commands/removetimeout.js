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
    name: 'removetimeout',
    description: 'Remove timeout of a member in your Guild.',
    module: 'mod',
    options: [{
        name: 'member',
        description: 'The member you wish to remove the timeout of.',
        type: ApplicationCommandOptionType.User,
        required: true
    }, {
        name: 'reason',
        description: 'The reason for removing the timeout of the member.',
        type: ApplicationCommandOptionType.String,
        required: true
    }],
    /** 
     * @param {Client} client
     * @param {Message} message
     * @param {String[]} args
     */
    run: async (client, interaction, con, args) => {
        const memberToTimeout = interaction.options.getMember('member');
        const timeoutReason = interaction.options.getString('reason');
        const highestRoleTarget = memberToTimeout.roles.highest.rawPosition;
        const highestRoleMod = interaction.member.roles.highest.rawPosition;
        const highestRoleBot = interaction.guild.members.me.roles.highest.rawPosition;

        if (!interaction.guild.members.me.permissions.has(PermissionFlagsBits.ModerateMembers)) {
            return interaction.reply({
                embeds: [
                    new EmbedBuilder()
                    .setColor(ee.errorColor)
                    .setTitle(`:x: Error :x:`)
                    .setDescription(`***It seems like I do not currently have the \`Moderate Members\` permission.***`)
                ],
                ephemeral: true
            });
        };

        if (!await client.timeoutCmd.has(`${interaction.guild.id}`)) {
            return interaction.reply({
                embeds: [
                    new EmbedBuilder()
                    .setColor(ee.errorColor)
                    .setTitle(`:x: Error :x:`)
                    .setDescription(`***Woops, looks like this command is currently disabled.***`)
                ]
            })
        }

        if (interaction.user.id === memberToTimeout.id) {
            return interaction.reply({
                embeds: [
                    new EmbedBuilder()
                    .setColor(ee.errorColor)
                    .setTitle(`:x: Error :x:`)
                    .setDescription(`***You may not remove the timeout of yourself in the server.***`)
                ],
                ephemeral: true
            });
        }


        if (memberToTimeout.id === client.user.id) {
            return interaction.reply({
                embeds: [
                    new EmbedBuilder()
                    .setColor(ee.errorColor)
                    .setTitle(`:x: Error :x:`)
                    .setDescription(`***You may not remove the timeout of me in the server.***`)
                ],
                ephemeral: true
            })
        }

        if (interaction.guild.ownerId === memberToTimeout.id) {
            return interaction.reply({
                embeds: [
                    new EmbedBuilder()
                    .setColor(ee.errorColor)
                    .setTitle(`:x: Error :x:`)
                    .setDescription(`***You may not remove the timeout from the Guild Owner.***`)
                ],
                ephemeral: true
            });
        }

        if (highestRoleTarget >= highestRoleBot) {
            return interaction.reply({
                embeds: [
                    new EmbedBuilder()
                    .setColor(ee.errorColor)
                    .setTitle(`:x: Error :x:`)
                    .setDescription(`***It seems as if my role is not high enough to remove the timeout of that user.***`)
                ],
                ephemeral: true
            })
        }

        if (highestRoleTarget >= highestRoleMod && interaction.guild.ownerId != interaction.user.id) {
            return interaction.reply({
                embeds: [
                    new EmbedBuilder()
                    .setColor(ee.errorColor)
                    .setTitle(`:x: Error :x:`)
                    .setDescription(`***You may not remove the timeout of someone at the same or higher rank than you.***`)
                ],
                ephemeral: true
            })
        }

        await memberToTimeout.timeout(null, `[REMOVETIMEOUT] Reason: ${timeoutReason} | Moderator: ${interaction.user.username}#${interaction.user.discriminator}`);

        try {
            await modLog(interaction.guild, {
                embeds: [
                    new EmbedBuilder()
                    .setColor(ee.successColor)
                    .setTitle(`:warning: Member Timeout Removed :warning:`)
                    .addFields([{
                        name: 'Reason',
                        value: `\`\`\`${timeoutReason}\`\`\``,
                        inline: true
                    }, {
                        name: 'Target',
                        value: `\`\`\`${memberToTimeout.user.username}#${memberToTimeout.user.discriminator} (${memberToTimeout.user.id})\`\`\``
                    }, {
                        name: 'Moderator',
                        value: `\`\`\`${interaction.user.username}#${interaction.user.discriminator} (${interaction.user.id})\`\`\``,
                    }])
                    .setThumbnail(`https://cdn.discordapp.com/attachments/1010999257899204769/1065641669950709770/mod.png`)
                    .setTimestamp()
                ]
            });
        } catch {}

        return interaction.reply({
            embeds: [
                new EmbedBuilder()
                .setColor(ee.color)
                .setTitle(`:white_check_mark: Members timeout was Removed :white_check_mark:`)
                .addFields([{
                    name: 'Moderator',
                    value: `\`\`\`${interaction.user.username}#${interaction.user.discriminator}\`\`\``,
                    inline: true
                }, {
                    name: 'Target',
                    value: `\`\`\`${memberToTimeout.user.username}#${memberToTimeout.user.discriminator}\`\`\``,
                    inline: true
                }, {
                    name: 'Reason',
                    value: `\`\`\`${timeoutReason}\`\`\``
                }])
                .setTimestamp()
                .setThumbnail(`https://cdn.discordapp.com/attachments/1010999257899204769/1053662138251624488/hammer.png`)
            ]
        });
    }
}