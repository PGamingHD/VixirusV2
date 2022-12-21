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
    name: 'warns',
    description: 'View the warnings of a member.',
    module: 'mod',
    options: [{
        name: 'member',
        description: 'The member you wish to view the warnins of.',
        type: ApplicationCommandOptionType.User
    }],
    /** 
     * @param {Client} client
     * @param {Message} message
     * @param {String[]} args
     */
    run: async (client, interaction, con, args) => {
        let memberToView = interaction.options.getMember('member');

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

        if (!memberToView) memberToView = interaction.member;

        const totalWarnings = await client.cachedWarns.get(`${interaction.guild.id}`);

        let warningString = "";
        const warningArray = [];
        await totalWarnings.forEach(warning => {
            if (warning.target === memberToView.id) {
                warningArray.push(warning)
                warningString = warningString + `---[${warning.CaseID}]---\nModerator: ${warning.mod}\nReason: ${warning.reason}\nDate: ${warning.date}\n\n`
            };
        });

        try {
            return interaction.reply({
                embeds: [
                    new EmbedBuilder()
                    .setColor(ee.color)
                    .setTitle(`:white_check_mark: Displaying Warnings :white_check_mark:`)
                    .setAuthor({
                        name: `Warnings for ${memberToView.user.username}#${memberToView.user.discriminator}`,
                        iconURL: memberToView.displayAvatarURL()
                    })
                    .setDescription(`\`\`\`${warningArray.length === 0 ? "No warnings" : `${warningString}`}\`\`\``)
                    .setThumbnail(`https://cdn.discordapp.com/attachments/1010999257899204769/1053662138251624488/hammer.png`)
                ]
            });
        } catch (e) {
            console.log(e)
        }
    }
}