const client = require("../../index.js");
const ee = require("../../botconfig/embed.json");
const {
    LoggerLog
} = require("../../handler/functions");
const { EmbedBuilder } = require("discord.js");

client.on("emojiUpdate", async (oldEmoji, newEmoji) => {
    if (await client.emojiUpdate.has(`${newEmoji.guild.id}`) && await client.loggingmodule.has(`${newEmoji.guild.id}`)) {
        await LoggerLog(newEmoji.guild, {
            embeds: [
                new EmbedBuilder()
                .setColor(ee.maintenanceColor)
                .setTitle(`:warning: Emoji Updated :warning:`)
                .addFields([{
                    name: 'Old Emoji Name',
                    value: `${oldEmoji.name}`
                }, {
                    name: 'New Emoji Name',
                    value: `${newEmoji.name}`
                }, {
                    name: 'Emoji',
                    value: `<:${newEmoji.name}:${newEmoji.id}>`
                }])
                .setFooter({text: `Emoji ID: ${newEmoji.id}`})
                .setThumbnail(`https://cdn.discordapp.com/attachments/1010999257899204769/1054749803193585714/support.png`)
                .setTimestamp()
            ]
        });
    }
});


/*

Code used in this script has been written by original PizzaParadise developer - PGamingHD#0666
Require assistance with scripts? Join the discord and get help right away! - https://discord.gg/pxySje4GPC
Other than that, please do note that it is required if you are using this to mention the original developer
Original Developer - PGamingHD#0666

*/