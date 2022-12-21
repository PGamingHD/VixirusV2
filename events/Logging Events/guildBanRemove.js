const client = require("../../index.js");
const ee = require("../../botconfig/embed.json");
const {
    LoggerLog
} = require("../../handler/functions");
const { EmbedBuilder } = require("discord.js");

client.on("guildBanRemove", async (ban) => {
    if (await client.guildBanRemove.has(`${ban.guild.id}`) && await client.loggingmodule.has(`${ban.guild.id}`)) {
        await LoggerLog(ban.guild, {
            embeds: [
                new EmbedBuilder()
                .setColor(ee.successColor)
                .setTitle(`:warning: Member Unbanned :warning:`)
                .addFields([{
                    name: 'Member',
                    value: `${ban.user}`
                }])
                .setFooter({text: `User ID: ${ban.user.id}`})
                .setThumbnail(`https://cdn.discordapp.com/attachments/1010999257899204769/1054749803193585714/support.png`)
                .setTimestamp()
            ]
        });
    }
});