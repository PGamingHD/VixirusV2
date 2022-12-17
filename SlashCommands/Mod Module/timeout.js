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
    name: 'timeout',
    description: 'Timeout a member of your Guild.',
    module: 'mod',
    options: [{
        name: 'member',
        description: 'The member you wish to timeout.',
        type: ApplicationCommandOptionType.User,
        required: true
    }, {
        name: 'minutes',
        description: 'The amount of minutes to timeout someone for.',
        type: ApplicationCommandOptionType.Integer,
        required: true
    }, {
        name: 'reason',
        description: 'The reason for timing this member out.',
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
        let timeoutMinutes = interaction.options.getInteger('minutes');
        const highestRoleTarget = memberToTimeout.roles.highest.rawPosition;
        const highestRoleMod = interaction.member.roles.highest.rawPosition;
        const highestRoleBot = interaction.guild.members.me.roles.highest.rawPosition;
        const caseID = genGuid();

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

        if (interaction.user.id === memberToTimeout.id) {
            return interaction.reply({
                embeds: [
                    new EmbedBuilder()
                    .setColor(ee.errorColor)
                    .setTitle(`:x: Error :x:`)
                    .setDescription(`***You may not timeout yourself in the server.***`)
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
                    .setDescription(`***You may not timeout me in the server.***`)
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
                    .setDescription(`***You may not timeout the Guild Owner.***`)
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
                    .setDescription(`***It seems as if my role is not high enough to timeout that user.***`)
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
                    .setDescription(`***You may not timeout someone at the same or higher rank than you.***`)
                ],
                ephemeral: true
            })
        }

        if (timeoutMinutes < 0) {
            timeoutMinutes = 1;
        }

        if (timeoutMinutes > 40319) {
            timeoutMinutes = 40319;
        }

        await memberToTimeout.timeout(timeoutMinutes * 60 * 1000, `[TIMEOUT] Reason: ${timeoutReason} | Moderator: ${interaction.user.username}#${interaction.user.discriminator}`);

        return interaction.reply({
            embeds: [
                new EmbedBuilder()
                .setColor(ee.color)
                .setTitle(`:white_check_mark: Member was Timed out :white_check_mark:`)
                .addFields([{
                    name: 'Moderator',
                    value: `\`\`\`${interaction.user.username}#${interaction.user.discriminator}\`\`\``,
                    inline: true
                }, {
                    name: 'Target',
                    value: `\`\`\`${memberToTimeout.user.username}#${memberToTimeout.user.discriminator}\`\`\``,
                    inline: true
                }, {
                    name: 'Duration',
                    value: `\`\`\`${timeoutMinutes} minute(s)\`\`\``,
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