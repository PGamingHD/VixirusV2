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
    name: 'punishments',
    description: 'View someones global punishments through this client',
    options: [{
        name: 'member',
        description: 'The member to view global punishments off of',
        type: ApplicationCommandOptionType.User,
        required: true
    }],
    /** 
     * @param {Client} client
     * @param {Message} message
     * @param {String[]} args
     */
    run: async (client, interaction, con, args) => {
        const member = interaction.options.getMember('member');
        const globalPunishments = client.globalPunishments.get(`${member.id}`);

        let warningString = "";
        const warningArray = [];
        await globalPunishments.forEach(warning => {
            if (warning.target === member.id) {
                warningArray.push(warning)
                warningString = warningString + `---[${warning.CaseID}]---\nServer: ${warning.server}\nModerator: ${warning.mod}\nPunishment: ${warning.punishment}\nReason: ${warning.reason}\nDate: ${warning.date}\n\n`
            };
        });

        return interaction.reply({
            embeds: [
                new EmbedBuilder()
                .setColor(ee.color)
                .setTitle(`:white_check_mark: Global Punishments :white_check_mark:`)
                .setAuthor({
                    name: `Global Punishments for ${member.user.username}#${member.user.discriminator}`,
                    iconURL: member.displayAvatarURL()
                })
                .setDescription(`\`\`\`${warningArray.length === 0 ? "No punishments" : `${warningString}`}\`\`\``)
                .setThumbnail(`https://cdn.discordapp.com/attachments/1010999257899204769/1053662138251624488/hammer.png`)
                .setTimestamp()
            ]
        });
    }
}