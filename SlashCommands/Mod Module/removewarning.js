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