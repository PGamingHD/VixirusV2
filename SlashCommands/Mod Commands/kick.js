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
    modLog,
    dateNow
} = require("../../handler/functions");
const fs = require("fs");

module.exports = {
    name: 'kick',
    description: 'Kick a member from your Guild.',
    module: 'mod',
    options: [{
        name: 'member',
        description: 'The member you wish to kick.',
        type: ApplicationCommandOptionType.User,
        required: true
    }, {
        name: 'reason',
        description: 'The reason for kicking this member.',
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
        const banReason = interaction.options.getString('reason');
        const highestRoleTarget = memberToBan.roles.highest.rawPosition;
        const highestRoleMod = interaction.member.roles.highest.rawPosition;
        const highestRoleBot = interaction.guild.members.me.roles.highest.rawPosition;
        const caseID = genGuid();

        if (!interaction.guild.members.me.permissions.has(PermissionFlagsBits.KickMembers)) {
            return interaction.reply({
                embeds: [
                    new EmbedBuilder()
                    .setColor(ee.errorColor)
                    .setTitle(`:x: Error :x:`)
                    .setDescription(`***It seems like I do not currently have the \`Kick Members\` permission.***`)
                ],
                ephemeral: true
            });
        };

        if (!await client.kickCmd.has(`${interaction.guild.id}`)) {
            return interaction.reply({
                embeds: [
                    new EmbedBuilder()
                    .setColor(ee.errorColor)
                    .setTitle(`:x: Error :x:`)
                    .setDescription(`***Woops, looks like this command is currently disabled.***`)
                ]
            })
        }

        if (interaction.user.id === memberToBan.id) {
            return interaction.reply({
                embeds: [
                    new EmbedBuilder()
                    .setColor(ee.errorColor)
                    .setTitle(`:x: Error :x:`)
                    .setDescription(`***You may not kick yourself from the server.***`)
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
                    .setDescription(`***You may not kick me from the server.***`)
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
                    .setDescription(`***You may not kick the Guild Owner.***`)
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
                    .setDescription(`***It seems as if my role is not high enough to kick that user.***`)
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
                    .setDescription(`***You may not kick someone at the same or higher rank than you.***`)
                ],
                ephemeral: true
            })
        }

        try {
            if (!memberToBan.user.bot) {
                await memberToBan.user.send({
                    embeds: [
                        new EmbedBuilder()
                        .setColor(ee.color)
                        .setTitle(`:x: You have been kicked from ${interaction.guild.name} :x:`)
                        .addFields([{
                            name: 'Moderator',
                            value: `\`\`\`${interaction.user.username}#${interaction.user.discriminator}\`\`\``,
                            inline: true
                        }, {
                            name: 'Reason',
                            value: `\`\`\`${banReason}\`\`\``
                        }])
                        .setTimestamp()
                        .setThumbnail(`https://cdn.discordapp.com/attachments/1010999257899204769/1053662138251624488/hammer.png`)
                    ]
                })
            }
        } catch {}

        try {
            if (!memberToBan.user.bot) {
                if (client.globalPunishments.has(`${memberToBan.id}`)) {
                    await con.query(`UPDATE user_punishments SET punished_data = JSON_ARRAY_APPEND(punished_data,'$',CAST('{"server": "${interaction.guild.id}", "punishment": "kick", "mod": "${interaction.user.id}", "target": "${memberToBan.id}", "reason": "${banReason}", "date": "${dateNow()}", "CaseID": "${caseID}"}' AS JSON)) WHERE punished_userId = '${memberToBan.id}'`);
                    const [userPunishments, punishmentRows] = await con.query(`SELECT punished_data FROM user_punishments WHERE punished_userId = ${memberToBan.id}`);
                    client.globalPunishments.set(`${memberToBan.id}`, userPunishments[0].punished_data)
                } else {
                    await con.query(`INSERT INTO user_punishments(punished_userId) VALUES (${memberToBan.id})`)
                    await con.query(`UPDATE user_punishments SET punished_data = JSON_ARRAY_APPEND(punished_data,'$',CAST('{"server": "${interaction.guild.id}", "punishment": "kick", "mod": "${interaction.user.id}", "target": "${memberToBan.id}", "reason": "${banReason}", "date": "${dateNow()}", "CaseID": "${caseID}"}' AS JSON)) WHERE punished_userId = '${memberToBan.id}'`);
                    client.globalPunishments.set(`${memberToBan.id}`, [{
                        "server": `${interaction.guild.id}`,
                        "punishment": "kick",
                        "mod": `${interaction.user.id}`,
                        "target": `${memberToBan.id}`,
                        "reason": `${banReason}`,
                        "date": `${dateNow()}`,
                        "CaseID": `${caseID}`
                    }])
                }
            }
        } catch {}

        try {
            await modLog(interaction.guild, {
                embeds: [
                    new EmbedBuilder()
                    .setColor(ee.errorColor)
                    .setTitle(`:warning: Member Kicked :warning:`)
                    .addFields([{
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
                    .setThumbnail(`https://cdn.discordapp.com/attachments/1010999257899204769/1065641669950709770/mod.png`)
                    .setTimestamp()
                ]
            });
        } catch {}

        await memberToBan.kick(`[KICK] Reason: ${banReason} | Moderator: ${interaction.user.username}#${interaction.user.discriminator}`)

        return interaction.reply({
            embeds: [
                new EmbedBuilder()
                .setColor(ee.color)
                .setTitle(`:white_check_mark: Member was Kicked :white_check_mark:`)
                .addFields([{
                    name: 'Moderator',
                    value: `\`\`\`${interaction.user.username}#${interaction.user.discriminator}\`\`\``,
                    inline: true
                }, {
                    name: 'Target',
                    value: `\`\`\`${memberToBan.user.username}#${memberToBan.user.discriminator}\`\`\``,
                    inline: true
                }, {
                    name: 'Reason',
                    value: `\`\`\`${banReason}\`\`\``
                }])
                .setThumbnail(`https://cdn.discordapp.com/attachments/1010999257899204769/1053662138251624488/hammer.png`)
            ]
        });
    }
}