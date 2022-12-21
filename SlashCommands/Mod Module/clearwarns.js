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
const fs = require("fs");
const {
    modLog
} = require("../../handler/functions");

module.exports = {
    name: 'clearwarns',
    description: 'Clear all warnings of a specific member.',
    module: 'mod',
    options: [{
        name: 'member',
        description: 'The member you wish to clear the warnings of.',
        type: ApplicationCommandOptionType.User,
        required: true
    }, {
        name: 'reason',
        description: 'The reason for clearing all the member warnings.',
        type: ApplicationCommandOptionType.String,
        required: true
    }],
    /** 
     * @param {Client} client
     * @param {Message} message
     * @param {String[]} args
     */
    run: async (client, interaction, con, args) => {
        const memberToClear = interaction.options.getMember('member');
        const clearReason = interaction.options.getString('reason');
        const highestRoleTarget = memberToClear.roles.highest.rawPosition;
        const highestRoleMod = interaction.member.roles.highest.rawPosition;

        if (!interaction.channel.permissionsFor(interaction.guild.members.me).has(PermissionFlagsBits.SendMessages)) {
            return interaction.reply({
                embeds: [
                    new EmbedBuilder()
                    .setColor(ee.errorColor)
                    .setTitle(`:x: Error :x:`)
                    .setDescription(`***It seems like I do not currently have the \`Send Messages\` permission.***`)
                ],
                ephemeral: true
            });
        };

        if (!await client.warnCmd.has(`${interaction.guild.id}`)) {
            return interaction.reply({
                embeds: [
                    new EmbedBuilder()
                    .setColor(ee.errorColor)
                    .setTitle(`:x: Error :x:`)
                    .setDescription(`***Woops, looks like this command is currently disabled.***`)
                ]
            })
        }

        if (interaction.user.id === memberToClear.id) {
            return interaction.reply({
                embeds: [
                    new EmbedBuilder()
                    .setColor(ee.errorColor)
                    .setTitle(`:x: Error :x:`)
                    .setDescription(`***You may not clear your own warnings.***`)
                ],
                ephemeral: true
            });
        }

        if (memberToClear.id === client.user.id) {
            return interaction.reply({
                embeds: [
                    new EmbedBuilder()
                    .setColor(ee.errorColor)
                    .setTitle(`:x: Error :x:`)
                    .setDescription(`***You may not clear my warnings.***`)
                ],
                ephemeral: true
            })
        }

        if (memberToClear.user.bot) {
            return interaction.reply({
                embeds: [
                    new EmbedBuilder()
                    .setColor(ee.errorColor)
                    .setTitle(`:x: Error :x:`)
                    .setDescription(`***You may not clear warnings from a robot.***`)
                ],
                ephemeral: true
            })
        }

        if (interaction.guild.ownerId === memberToClear.id) {
            return interaction.reply({
                embeds: [
                    new EmbedBuilder()
                    .setColor(ee.errorColor)
                    .setTitle(`:x: Error :x:`)
                    .setDescription(`***You may not clear warnings from the Guild Owner.***`)
                ],
                ephemeral: true
            });
        }

        if (highestRoleTarget >= highestRoleMod && interaction.guild.ownerId != interaction.user.id) {
            return interaction.reply({
                embeds: [
                    new EmbedBuilder()
                    .setColor(ee.errorColor)
                    .setTitle(`:x: Error :x:`)
                    .setDescription(`***You may not clear warnings from someone at the same or higher rank than you.***`)
                ],
                ephemeral: true
            })
        }

        const totalWarnings = await client.cachedWarns.get(`${interaction.guild.id}`);

        const newCachedWarns = [];
        let counter = 0;
        await totalWarnings.forEach(warning => {
            if (warning.target !== memberToClear.id) {
                newCachedWarns.push(warning);
            } else {
                counter++;
            }
        });

        if (counter === 0) {
            return interaction.reply({
                embeds: [
                    new EmbedBuilder()
                    .setColor(ee.errorColor)
                    .setTitle(`:x: Error :x:`)
                    .setDescription(`***The specific user does not have any warnings at the moment.***`)
                ],
                ephemeral: true
            })
        }

        await con.query(`UPDATE guild_data SET data_warns = '${JSON.stringify(newCachedWarns)}' WHERE data_ServerId = ${interaction.guild.id}`);
        await client.cachedWarns.set(`${interaction.guild.id}`, newCachedWarns);

        try {
            await memberToClear.user.send({
                embeds: [
                    new EmbedBuilder()
                    .setColor(ee.color)
                    .setTitle(`:white_check_mark: Your warnings were cleared in ${interaction.guild.name} :white_check_mark:`)
                    .addFields([{
                        name: 'Moderator',
                        value: `\`\`\`${interaction.user.username}#${interaction.user.discriminator}\`\`\``,
                        inline: true
                    }, {
                        name: 'Reason',
                        value: `\`\`\`${clearReason}\`\`\``
                    }])
                    .setThumbnail(`https://cdn.discordapp.com/attachments/1010999257899204769/1053662138251624488/hammer.png`)
                ]
            });
        } catch {}

        try {
            await modLog(interaction.guild, {
                embeds: [
                    new EmbedBuilder()
                    .setColor(ee.successColor)
                    .setTitle(`:warning: Member Warnings Cleared :warning:`)
                    .addFields([{
                        name: 'Reason',
                        value: `\`\`\`${clearReason}\`\`\``,
                        inline: true
                    },{
                        name: 'Target',
                        value: `\`\`\`${memberToClear.user.username}#${memberToClear.user.discriminator} (${memberToClear.user.id})\`\`\``
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
                .setTitle(`:white_check_mark: Cleared Warnings :white_check_mark:`)
                .addFields([{
                    name: 'Moderator',
                    value: `\`\`\`${interaction.user.username}#${interaction.user.discriminator}\`\`\``,
                    inline: true
                }, {
                    name: 'Target',
                    value: `\`\`\`${memberToClear.user.username}#${memberToClear.user.discriminator}\`\`\``,
                    inline: true
                }, {
                    name: 'Reason',
                    value: `\`\`\`${clearReason}\`\`\``
                }])
            ]
        })
    }
}