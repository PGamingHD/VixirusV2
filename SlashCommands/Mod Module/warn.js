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
    dateNow,
    modLog
} = require("../../handler/functions");
const fs = require("fs");

module.exports = {
    name: 'warn',
    description: 'Warn someone for breaking the server rules.',
    module: 'mod',
    options: [{
        name: 'member',
        description: 'The member you wish to warn.',
        type: ApplicationCommandOptionType.User,
        required: true
    }, {
        name: 'reason',
        description: 'The reason you wish to warn the member for.',
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
        const caseID = genGuid();

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
                    .setDescription(`***You may not warn a robot.***`)
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
                    .setDescription(`***You may not warn the Guild Owner.***`)
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
                    .setDescription(`***You may not warn someone at the same or higher rank than you.***`)
                ],
                ephemeral: true
            })
        }

        await con.query(`UPDATE guild_data SET data_warns = JSON_ARRAY_APPEND(data_warns,'$',CAST('{"mod": "${interaction.user.username}#${interaction.user.discriminator}", "target": "${memberToWarn.id}", "reason": "${reasonForWarn}", "date": "${dateNow()}", "CaseID": "${caseID}"}' AS JSON)) WHERE data_ServerId = '${interaction.guild.id}'`);
        const [guildData, dataGuild] = await con.query(`SELECT * FROM guild_data WHERE data_ServerId = ${interaction.guild.id}`);
        await client.cachedWarns.set(`${interaction.guild.id}`, guildData[0].data_warns);

        try {
            await memberToWarn.user.send({
                embeds: [
                    new EmbedBuilder()
                    .setColor(ee.color)
                    .setTitle(`:x: You have been warned in ${interaction.guild.name} :x:`)
                    .addFields([{
                        name: 'Moderator',
                        value: `\`\`\`${interaction.user.username}#${interaction.user.discriminator}\`\`\``,
                        inline: true
                    }, {
                        name: 'Case ID',
                        value: `\`\`\`${caseID}\`\`\``,
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
                    .setColor(ee.errorColor)
                    .setTitle(`:warning: Member Warned :warning:`)
                    .addFields([{
                        name: 'Reason',
                        value: `\`\`\`${reasonForWarn}\`\`\``,
                        inline: true
                    }, {
                        name: 'Case ID',
                        value: `\`\`\`${caseID}\`\`\``,
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
                .setTitle(`:white_check_mark: Member was Warned :white_check_mark:`)
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
                .setFooter({
                    text: `Case ID: ${caseID}`
                })
                .setThumbnail(`https://cdn.discordapp.com/attachments/1010999257899204769/1053662138251624488/hammer.png`)
            ]
        });
    }
}