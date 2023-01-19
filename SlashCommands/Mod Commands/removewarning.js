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
    name: 'removewarning',
    description: 'Remove a specific warning from a member.',
    module: 'mod',
    options: [{
        name: 'caseid',
        description: 'The Case ID that you wish to remove.',
        type: ApplicationCommandOptionType.String,
        required: true
    }, {
        name: 'reason',
        description: 'The reason for removing the warning.',
        type: ApplicationCommandOptionType.String,
        required: true
    }],
    /** 
     * @param {Client} client
     * @param {Message} message
     * @param {String[]} args
     */
    run: async (client, interaction, con, args) => {
        const caseId = interaction.options.getString('caseid');
        const clearReason = interaction.options.getString('reason');
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
        
        const totalWarnings = await client.cachedWarns.get(`${interaction.guild.id}`);

        const newCachedWarns = [];
        let counter = 0;
        let target = "";
        await totalWarnings.forEach(warning => {
            if (warning.CaseID !== caseId) {
                newCachedWarns.push(warning);
            } else {
                target = warning.target;
                counter++;
            }
        });

        if (counter === 0) {
            return interaction.reply({
                embeds: [
                    new EmbedBuilder()
                    .setColor(ee.errorColor)
                    .setTitle(`:x: Error :x:`)
                    .setDescription(`***The CaseID could not be found and was therefore not removed.***`)
                ],
                ephemeral: true
            })
        }

        if (interaction.user.id === target) {
            return interaction.reply({
                embeds: [
                    new EmbedBuilder()
                    .setColor(ee.errorColor)
                    .setTitle(`:x: Error :x:`)
                    .setDescription(`***You may not remove one of your own warnings.***`)
                ],
                ephemeral: true
            });
        }

        try {
            const targetUser = await interaction.guild.members.fetch(target);
            const highestRoleTarget = targetUser.roles.highest.rawPosition;

            if (highestRoleTarget >= highestRoleMod && interaction.guild.ownerId != interaction.user.id) {
                return interaction.reply({
                    embeds: [
                        new EmbedBuilder()
                        .setColor(ee.errorColor)
                        .setTitle(`:x: Error :x:`)
                        .setDescription(`***You may not remove warnings from someone at the same or higher rank than you.***`)
                    ],
                    ephemeral: true
                })
            }
        } catch {}

        await con.query(`UPDATE guild_data SET data_warns = '${JSON.stringify(newCachedWarns)}' WHERE data_ServerId = ${interaction.guild.id}`);
        await client.cachedWarns.set(`${interaction.guild.id}`, newCachedWarns);

        try {
            const targetUser = await interaction.guild.members.fetch(target);
            
            await targetUser.user.send({
                embeds: [
                    new EmbedBuilder()
                    .setColor(ee.color)
                    .setTitle(`:white_check_mark: One of your warnings were removed in ${interaction.guild.name} :white_check_mark:`)
                    .addFields([{
                        name: 'Moderator',
                        value: `\`\`\`${interaction.user.username}#${interaction.user.discriminator}\`\`\``,
                        inline: true
                    }, {
                        name: 'CaseID',
                        value: `\`\`\`${caseId}\`\`\``,
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
                    .setTitle(`:warning: Member Warning Removed :warning:`)
                    .addFields([{
                        name: 'Reason',
                        value: `\`\`\`${clearReason}\`\`\``,
                        inline: true
                    }, {
                        name: 'CaseID',
                        value: `\`\`\`${caseId}\`\`\``,
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

        return interaction.reply({
            embeds: [
                new EmbedBuilder()
                .setColor(ee.color)
                .setTitle(`:white_check_mark: Removed Warning :white_check_mark:`)
                .addFields([{
                    name: 'Moderator',
                    value: `\`\`\`${interaction.user.username}#${interaction.user.discriminator}\`\`\``,
                    inline: true
                }, {
                    name: 'CaseID',
                    value: `\`\`\`${caseId}\`\`\``,
                    inline: true
                }, {
                    name: 'Reason',
                    value: `\`\`\`${clearReason}\`\`\``
                }])
            ]
        })
    }
}