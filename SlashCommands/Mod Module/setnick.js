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
    name: 'setnick',
    description: 'Give a member a new nickname.',
    module: 'mod',
    options: [{
        name: 'member',
        description: 'The member you want to change the nick of.',
        type: ApplicationCommandOptionType.User,
        required: true
    }, {
        name: 'nick',
        description: 'The nick you want to change to.',
        type: ApplicationCommandOptionType.String,
    }],
    /** 
     * @param {Client} client
     * @param {Message} message
     * @param {String[]} args
     */
    run: async (client, interaction, con, args) => {
        const memberToNick = interaction.options.getMember('member');
        let nick = interaction.options.getString('nick');
        const highestRoleMod = interaction.member.roles.highest.rawPosition;
        const highestRoleTarget = memberToNick.roles.highest.rawPosition;
        const highestRoleBot = interaction.guild.members.me.roles.highest.rawPosition;

        if (!interaction.guild.members.me.permissions.has(PermissionFlagsBits.ManageNicknames)) {
            return interaction.reply({
                embeds: [
                    new EmbedBuilder()
                    .setColor(ee.errorColor)
                    .setTitle(`:x: Error :x:`)
                    .setDescription(`***It seems like I do not currently have the \`Manage Nicknames\` permission.***`)
                ],
                ephemeral: true
            });
        };

        if (interaction.guild.ownerId === memberToNick.id) {
            return interaction.reply({
                embeds: [
                    new EmbedBuilder()
                    .setColor(ee.errorColor)
                    .setTitle(`:x: Error :x:`)
                    .setDescription(`***You may not nick the Guild Owner.***`)
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
                    .setDescription(`***You may not edit the nickname of someone at the same or higher rank than you.***`)
                ],
                ephemeral: true
            })
        }

        if (highestRoleTarget >= highestRoleBot) {
            return interaction.reply({
                embeds: [
                    new EmbedBuilder()
                    .setColor(ee.errorColor)
                    .setTitle(`:x: Error :x:`)
                    .setDescription(`***It seems as if my role is not high enough to nick that user.***`)
                ],
                ephemeral: true
            })
        }

        const oldNick = memberToNick.nickname;

        if (!nick) nick = "";

        await memberToNick.setNickname(nick);

        try {
            await modLog(interaction.guild, {
                embeds: [
                    new EmbedBuilder()
                    .setColor(ee.maintenanceColor)
                    .setTitle(`:warning: Slowmode Changed :warning:`)
                    .addFields([{
                        name: 'Old Nickname',
                        value: `\`\`\`${oldNick === null ? "No previous nickname" : oldNick}\`\`\``,
                        inline: true
                    }, {
                        name: 'New Nickname',
                        value: `\`\`\`${nick === "" ? "Removed nickname" : nick}\`\`\``,
                        inline: true
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
                .setTitle(`:white_check_mark: Nickname Changed :white_check_mark:`)
                .addFields([{
                    name: 'Moderator',
                    value: `\`\`\`${interaction.user.username}#${interaction.user.discriminator}\`\`\``,
                    inline: true
                }, {
                    name: 'Old Nickname',
                    value: `\`\`\`${oldNick === null ? "No previous nickname" : oldNick}\`\`\``,
                    inline: true
                }, {
                    name: 'New Nickname',
                    value: `\`\`\`${nick === "" ? "Removed nickname" : nick}\`\`\``,
                    inline: true
                }])
                .setTimestamp()
                .setThumbnail(`https://cdn.discordapp.com/attachments/1010999257899204769/1053662138251624488/hammer.png`)
            ]
        })
    }
}