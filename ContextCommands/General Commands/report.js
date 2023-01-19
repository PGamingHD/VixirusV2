const {
    Client,
    ApplicationCommandType,
    EmbedBuilder
} = require('discord.js');
const ee = require('../../botconfig/embed.json');
const emoji = require('../../botconfig/embed.json')
const prettyMilliseconds = require('pretty-ms');
const config = require('../../botconfig/config.json');
const {
    modLog
} = require("../../handler/functions");

module.exports = {
    name: 'Report',
    type: ApplicationCommandType.Message,
    /** 
     * @param {Client} client 
     * @param {Message} message
     */
    run: async (client, interaction, con) => {
        const logChannel = await client.cachedModLogs.get(`${interaction.guild.id}`);
        if (!client.modlogmodule.has(`${interaction.guild.id}`) || logChannel === "0") return interaction.reply({
            content: ':x: Modlogs not setup, reports will not be recieved! (Have a Staff Member enable it first) :x:',
            ephemeral: true
        });

        if (interaction.targetMessage.author.bot) return interaction.reply({
            content: ':x: User is a bot, you may not report this message. :x:',
            ephemeral: true
        });

        if (interaction.targetMessage.embeds.length !== 0) return interaction.reply({
            content: ':x: This command has embeds, due to this you may not report this message. (Possible selfbot?) :x:',
            ephemeral: true
        });

        const staffRolesIDs = await client.cachedModRoles.get(`${interaction.guild.id}`);
        let toPing = '';
        staffRolesIDs.forEach(async (roleid) => {
            toPing += `<@&${roleid}> `
        })

        await modLog(interaction.guild, {
            content: toPing,
            embeds: [
                new EmbedBuilder()
                .setColor(ee.maintenanceColor)
                .setTitle(`:x: Report Recieved :x:`)
                .addFields([{
                    name: 'Reporter',
                    value: `\`\`\`${interaction.user.tag} (${interaction.user.id})\`\`\``,
                    inline: true
                }, {
                    name: 'Warned User',
                    value: `\`\`\`${interaction.targetMessage.author.tag} (${interaction.targetMessage.author.id})\`\`\``,
                    inline: true
                }, {
                    name: 'Reported Message',
                    value: `\`\`\`${interaction.targetMessage.content}\`\`\``
                }])
                .setThumbnail(`https://cdn.discordapp.com/attachments/1010999257899204769/1054749803193585714/support.png`)
                .setTimestamp()
            ]
        })

        return interaction.reply({
            content: `:white_check_mark: User along with the message was successfully reported, the Server Staff will be with you shortly. :white_check_mark:\n\`\`\`${interaction.targetMessage.content}\`\`\``,
            ephemeral: true
        });
    }
}