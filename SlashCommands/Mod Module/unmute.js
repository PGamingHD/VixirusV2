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
    name: 'unmute',
    description: 'Unmute someone that is muted.',
    module: 'mod',
    options: [{
        name: 'member',
        description: 'The member you wish to unmute.',
        type: ApplicationCommandOptionType.User,
        required: true
    }, {
        name: 'reason',
        description: 'The reason you wish to unmute the member for.',
        type: ApplicationCommandOptionType.String,
        required: true
    }],
    /** 
     * @param {Client} client
     * @param {Message} message
     * @param {String[]} args
     */
    run: async (client, interaction, con, args) => {
        const memberToWarn = interaction.options.getMember('member');
        const reasonForWarn = interaction.options.getString('reason');
        const highestRoleTarget = memberToWarn.roles.highest.rawPosition;
        const highestRoleMod = interaction.member.roles.highest.rawPosition;
        const highestRoleBot = interaction.guild.members.me.roles.highest.rawPosition;
        const mutedRole = await client.cachedMuteds.get(`${interaction.guild.id}`);

        if (!interaction.guild.members.me.permissions.has(PermissionFlagsBits.ManageRoles)) {
            return interaction.reply({
                embeds: [
                    new EmbedBuilder()
                    .setColor(ee.errorColor)
                    .setTitle(`:x: Error :x:`)
                    .setDescription(`***It seems like I do not currently have the \`Manage Roles\` permission.***`)
                ],
                ephemeral: true
            });
        };

        if (interaction.user.id === memberToWarn.id) {
            return interaction.reply({
                embeds: [
                    new EmbedBuilder()
                    .setColor(ee.errorColor)
                    .setTitle(`:x: Error :x:`)
                    .setDescription(`***You may not warn yourself.***`)
                ],
                ephemeral: true
            });
        }

        if (memberToWarn.id === client.user.id) {
            return interaction.reply({
                embeds: [
                    new EmbedBuilder()
                    .setColor(ee.errorColor)
                    .setTitle(`:x: Error :x:`)
                    .setDescription(`***You may not warn me.***`)
                ],
                ephemeral: true
            })
        }

        if (memberToWarn.user.bot) {
            return interaction.reply({
                embeds: [
                    new EmbedBuilder()
                    .setColor(ee.errorColor)
                    .setTitle(`:x: Error :x:`)
                    .setDescription(`***You may not mute a robot.***`)
                ],
                ephemeral: true
            })
        }

        if (interaction.guild.ownerId === memberToWarn.id) {
            return interaction.reply({
                embeds: [
                    new EmbedBuilder()
                    .setColor(ee.errorColor)
                    .setTitle(`:x: Error :x:`)
                    .setDescription(`***You may not mute the Guild Owner.***`)
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
                    .setDescription(`***It seems as if my role is not high enough to mute that user.***`)
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
                    .setDescription(`***You may not mute someone at the same or higher rank than you.***`)
                ],
                ephemeral: true
            })
        }

        if (mutedRole === "0") {
            return interaction.reply({
                embeds: [
                    new EmbedBuilder()
                    .setColor(ee.errorColor)
                    .setTitle(`:x: Error :x:`)
                    .setDescription(`***Woops, seems like the muted role is not cached for this server. Please mute someone to cache it!***`)
                ],
                ephemeral: true
            })
        }

        let roleExists = null;
        try {
            roleExists = await interaction.guild.roles.fetch(mutedRole);
        } catch {}

        if (roleExists === null) {
            return interaction.reply({
                embeds: [
                    new EmbedBuilder()
                    .setColor(ee.errorColor)
                    .setTitle(`:x: Error :x:`)
                    .setDescription(`***Woops, seems like the muted role could not be cached. Please try again in a couple of minutes!***`)
                ],
                ephemeral: true
            })
        }

        if (!memberToWarn.roles.cache.has(roleExists.id)) {
            return interaction.reply({
                embeds: [
                    new EmbedBuilder()
                    .setColor(ee.errorColor)
                    .setTitle(`:x: Error :x:`)
                    .setDescription(`***Woops, that user does not seem to currently be muted.***`)
                ],
                ephemeral: true
            })
        }

        try {
            await memberToWarn.roles.remove(roleExists);

            await memberToWarn.user.send({
                embeds: [
                    new EmbedBuilder()
                    .setColor(ee.color)
                    .setTitle(`:white_check_mark: You have been unmuted in ${interaction.guild.name} :white_check_mark:`)
                    .addFields([{
                        name: 'Moderator',
                        value: `\`\`\`${interaction.user.username}#${interaction.user.discriminator}\`\`\``,
                        inline: true
                    }, {
                        name: 'Reason',
                        value: `\`\`\`${reasonForWarn}\`\`\``
                    }])
                    .setTimestamp()
                    .setThumbnail(`https://cdn.discordapp.com/attachments/1010999257899204769/1053662138251624488/hammer.png`)
                ]
            });
        } catch {}

        try {
            await modLog(interaction.guild, {
                embeds: [
                    new EmbedBuilder()
                    .setColor(ee.successColor)
                    .setTitle(`:warning: Member Unmuted :warning:`)
                    .addFields([{
                        name: 'Reason',
                        value: `\`\`\`${reasonForWarn}\`\`\``,
                        inline: true
                    }, {
                        name: 'Target',
                        value: `\`\`\`${memberToWarn.user.username}#${memberToWarn.user.discriminator} (${memberToWarn.user.id})\`\`\``
                    }, {
                        name: 'Moderator',
                        value: `\`\`\`${interaction.user.username}#${interaction.user.discriminator} (${interaction.user.id})\`\`\``,
                    }])
                    .setThumbnail(`https://cdn.discordapp.com/attachments/1010999257899204769/1054749803193585714/support.png`)
                    .setTimestamp()
                ]
            });
        } catch {}

        return interaction.reply({
            embeds: [
                new EmbedBuilder()
                .setColor(ee.color)
                .setTitle(`:white_check_mark: Member was Unmuted :white_check_mark:`)
                .addFields([{
                    name: 'Moderator',
                    value: `\`\`\`${interaction.user.username}#${interaction.user.discriminator}\`\`\``,
                    inline: true
                }, {
                    name: 'Target',
                    value: `\`\`\`${memberToWarn.user.username}#${memberToWarn.user.discriminator}\`\`\``,
                    inline: true
                }, {
                    name: 'Reason',
                    value: `\`\`\`${reasonForWarn}\`\`\``
                }])
                .setTimestamp()
                .setThumbnail(`https://cdn.discordapp.com/attachments/1010999257899204769/1053662138251624488/hammer.png`)
            ]
        });
    }
}