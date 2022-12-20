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
    name: 'mute',
    description: 'Mute someone for saying something naughty.',
    module: 'mod',
    options: [{
        name: 'member',
        description: 'The member you wish to mute.',
        type: ApplicationCommandOptionType.User,
        required: true
    }, {
        name: 'minutes',
        description: 'The amount of minutes you wish to mute the user for.',
        type: ApplicationCommandOptionType.Integer,
        required: true
    }, {
        name: 'reason',
        description: 'The reason you wish to mute the member for.',
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
        let muteMinutes = interaction.options.getInteger('minutes');
        const highestRoleTarget = memberToWarn.roles.highest.rawPosition;
        const highestRoleMod = interaction.member.roles.highest.rawPosition;
        const highestRoleBot = interaction.guild.members.me.roles.highest.rawPosition;
        const mutedRole = await client.cachedMuteds.get(`${interaction.guild.id}`);
        const everyoneRole = interaction.guild.roles.everyone;

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

        if (muteMinutes <= 0) {
            muteMinutes = 1;
        }
        if (muteMinutes > 10080) {
            muteMinutes = 10080;
        }

        let roleExists = null;
        if (mutedRole === "0") {
            roleExists = await interaction.guild.roles.cache.filter(role => role.name.toLowerCase() === 'muted').first();

            if (!roleExists) {
                roleExists = await interaction.guild.roles.create({
                    name: "Muted",
                    color: ee.errorColor,
                    position: highestRoleBot - 1,
                });

                await interaction.guild.channels.cache.filter(channel => channel.type === ChannelType.GuildText && channel.permissionsFor(everyoneRole).has(PermissionFlagsBits.SendMessages) && channel.permissionsFor(everyoneRole).has(PermissionFlagsBits.ViewChannel)).map(async (channel) => {
                    await channel.permissionOverwrites.set([{
                        id: roleExists.id,
                        deny: [PermissionFlagsBits.SendMessages]
                    }]);
                });
            }

            await con.query(`UPDATE guild_data SET data_mutedrole = '${roleExists.id}' WHERE data_ServerId = ${interaction.guild.id}`);
            await client.cachedMuteds.set(`${interaction.guild.id}`, roleExists.id);
        } else {
            try {
                roleExists = await interaction.guild.roles.fetch(mutedRole);
            } catch {
                roleExists = await interaction.guild.roles.create({
                    name: "Muted",
                    color: ee.errorColor,
                    position: highestRoleBot - 1
                });

                await interaction.guild.channels.cache.filter(channel => channel.type === ChannelType.GuildText && channel.permissionsFor(everyoneRole).has(PermissionFlagsBits.SendMessages) && channel.permissionsFor(everyoneRole).has(PermissionFlagsBits.ViewChannel)).map(async (channel) => {
                    await channel.permissionOverwrites.set([{
                        id: roleExists.id,
                        deny: [PermissionFlagsBits.SendMessages]
                    }]);
                });

                await con.query(`UPDATE guild_data SET data_mutedrole = '${roleExists.id}' WHERE data_ServerId = ${interaction.guild.id}`);
                await client.cachedMuteds.set(`${interaction.guild.id}`, roleExists.id);
            }
        }

        try {
            await modLog(interaction.guild, {
                embeds: [
                    new EmbedBuilder()
                    .setColor(ee.errorColor)
                    .setTitle(`:warning: Member Muted :warning:`)
                    .addFields([{
                        name: 'Duration',
                        value: `\`\`\`${muteMinutes} minute(s)\`\`\``,
                        inline: true
                    }, {
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

        try {
            await memberToWarn.roles.add(roleExists);

            await memberToWarn.user.send({
                embeds: [
                    new EmbedBuilder()
                    .setColor(ee.color)
                    .setTitle(`:x: You have been muted in ${interaction.guild.name} :x:`)
                    .addFields([{
                        name: 'Moderator',
                        value: `\`\`\`${interaction.user.username}#${interaction.user.discriminator}\`\`\``,
                        inline: true
                    }, {
                        name: 'Duration',
                        value: `\`\`\`${muteMinutes} minute(s)\`\`\``,
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

        await interaction.reply({
            embeds: [
                new EmbedBuilder()
                .setColor(ee.color)
                .setTitle(`:white_check_mark: Member was Muted :white_check_mark:`)
                .addFields([{
                    name: 'Moderator',
                    value: `\`\`\`${interaction.user.username}#${interaction.user.discriminator}\`\`\``,
                    inline: true
                }, {
                    name: 'Target',
                    value: `\`\`\`${memberToWarn.user.username}#${memberToWarn.user.discriminator}\`\`\``,
                    inline: true
                }, {
                    name: 'Duration',
                    value: `\`\`\`${muteMinutes} minute(s)\`\`\``,
                    inline: true
                }, {
                    name: 'Reason',
                    value: `\`\`\`${reasonForWarn}\`\`\``
                }])
                .setTimestamp()
                .setThumbnail(`https://cdn.discordapp.com/attachments/1010999257899204769/1053662138251624488/hammer.png`)
            ]
        });

        setTimeout(async () => {
            try {
                if (memberToWarn.roles.cache.has(roleExists.id)) {
                    await memberToWarn.roles.remove(roleExists);

                    return await memberToWarn.user.send({
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
                                value: `\`\`\`Automatic Unmute\`\`\``
                            }])
                            .setTimestamp()
                            .setThumbnail(`https://cdn.discordapp.com/attachments/1010999257899204769/1053662138251624488/hammer.png`)
                        ]
                    });
                } else {
                    return;
                }
            } catch {}
        }, 1000 * 60 * muteMinutes);
    }
}