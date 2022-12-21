const client = require("../../index.js");
const ee = require("../../botconfig/embed.json");
const {
    LoggerLog
} = require("../../handler/functions");
const { EmbedBuilder } = require("discord.js");

client.on("emojiCreate", async (emoji) => {
    if (await client.emojiCreate.has(`${emoji.guild.id}`) && await client.loggingmodule.has(`${emoji.guild.id}`)) {
        await LoggerLog(emoji.guild, {
            embeds: [
                new EmbedBuilder()
                .setColor(ee.successColor)
                .setTitle(`:warning: Emoji Created :warning:`)
                .addFields([{
                    name: 'Emoji Name',
                    value: `${emoji.name}`
                }, {
                    name: 'Emoji',
                    value: `<:${emoji.name}:${emoji.id}>`
                }])
                .setFooter({text: `Emoji ID: ${emoji.id}`})
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