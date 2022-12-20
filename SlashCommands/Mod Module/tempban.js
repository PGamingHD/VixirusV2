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
    name: 'tempban',
    description: 'Tempban a member of your Guild.',
    module: 'mod',
    options: [{
        name: 'member',
        description: 'The member you wish to tempban.',
        type: ApplicationCommandOptionType.User,
        required: true
    }, {
        name: 'minutes',
        description: 'The amount of minutes you wish to tempban the user for.',
        type: ApplicationCommandOptionType.Integer,
        required: true
    }, {
        name: 'reason',
        description: 'The reason you wish to tempban the member for.',
        type: ApplicationCommandOptionType.String,
        required: true
    }],
    /** 
     * @param {Client} client
     * @param {Message} message
     * @param {String[]} args
     */
    run: async (client, interaction, con, args) => {
        const memberToBan = interaction.options.getMember('member');
        let banMinutes = interaction.options.getInteger('minutes');
        const banReason = interaction.options.getString('reason');
        const highestRoleTarget = memberToBan.roles.highest.rawPosition;
        const highestRoleMod = interaction.member.roles.highest.rawPosition;
        const highestRoleBot = interaction.guild.members.me.roles.highest.rawPosition;

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

        if (interaction.user.id === memberToBan.id) {
            return interaction.reply({
                embeds: [
                    new EmbedBuilder()
                    .setColor(ee.errorColor)
                    .setTitle(`:x: Error :x:`)
                    .setDescription(`***You may not tempban yourself from the server.***`)
                ],
                ephemeral: true
            });
        }


        if (memberToBan.id === client.user.id) {
            return interaction.reply({
                embeds: [
                    new EmbedBuilder()
                    .setColor(ee.errorColor)
                    .setTitle(`:x: Error :x:`)
                    .setDescription(`***You may not tempban me from the server.***`)
                ],
                ephemeral: true
            })
        }

        if (interaction.guild.ownerId === memberToBan.id) {
            return interaction.reply({
                embeds: [
                    new EmbedBuilder()
                    .setColor(ee.errorColor)
                    .setTitle(`:x: Error :x:`)
                    .setDescription(`***You may not tempban the Guild Owner.***`)
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
                    .setDescription(`***It seems as if my role is not high enough to tempban that user.***`)
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
                    .setDescription(`***You may not tempban someone at the same or higher rank than you.***`)
                ],
                ephemeral: true
            })
        }

        try {
            await memberToBan.user.send({
                embeds: [
                    new EmbedBuilder()
                    .setColor(ee.color)
                    .setTitle(`:x: You have been tempbanned in ${interaction.guild.name} :x:`)
                    .addFields([{
                        name: 'Moderator',
                        value: `\`\`\`${interaction.user.username}#${interaction.user.discriminator}\`\`\``,
                        inline: true
                    }, {
                        name: 'Duration',
                        value: `\`\`\`${banMinutes} minute(s)\`\`\``,
                        inline: true
                    }, {
                        name: 'Reason',
                        value: `\`\`\`${reasonForWarn}\`\`\``
                    }])
                    .setTimestamp()
                    .setThumbnail(`https://cdn.discordapp.com/attachments/1010999257899204769/1053662138251624488/hammer.png`)
                ]
            })
        } catch {}

        await memberToBan.ban({
            days: 7,
            reason: `[TEMPBAN] Reason: ${banReason} | Moderator: ${interaction.user.username}#${interaction.user.discriminator} | Duration: ${banMinutes} minute(s)`
        });

        try {
            await modLog(interaction.guild, {
                embeds: [
                    new EmbedBuilder()
                    .setColor(ee.errorColor)
                    .setTitle(`:warning: Member Tempbanned :warning:`)
                    .addFields([{
                        name: 'Duration',
                        value: `\`\`\`${banMinutes} minute(s)\`\`\``,
                        inline: true
                    }, {
                        name: 'Reason',
                        value: `\`\`\`${banReason}\`\`\``,
                        inline: true
                    }, {
                        name: 'Target',
                        value: `\`\`\`${memberToBan.user.username}#${memberToBan.user.discriminator} (${memberToBan.user.id})\`\`\``
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
            embeds: [
                new EmbedBuilder()
                .setColor(ee.color)
                .setTitle(`:white_check_mark: Member was Tempbanned :white_check_mark:`)
                .addFields([{
                    name: 'Moderator',
                    value: `\`\`\`${interaction.user.username}#${interaction.user.discriminator}\`\`\``,
                    inline: true
                }, {
                    name: 'Target',
                    value: `\`\`\`${memberToBan.user.username}#${memberToBan.user.discriminator}\`\`\``,
                    inline: true
                }, {
                    name: 'Duration',
                    value: `\`\`\`${banMinutes} minute(s)\`\`\``,
                    inline: true
                }, {
                    name: 'Reason',
                    value: `\`\`\`${banReason}\`\`\``
                }])
                .setTimestamp()
                .setThumbnail(`https://cdn.discordapp.com/attachments/1010999257899204769/1053662138251624488/hammer.png`)
            ]
        });

        setTimeout(async () => {
            await interaction.guild.members.unban(memberToBan, `[TEMPUNBAN] Reason: ${banReason} | Moderator: ${interaction.user.username}#${interaction.user.discriminator} | Duration: ${banMinutes} minute(s)`);
        }, 1000 * 60 * banMinutes);
    }
}