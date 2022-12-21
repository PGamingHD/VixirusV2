const client = require("../../index.js");
const ee = require("../../botconfig/embed.json");
const {
    LoggerLog
} = require("../../handler/functions");
const { EmbedBuilder } = require("discord.js");

client.on("messageDelete", async (message) => {
    if (await client.messageDelete.has(`${message.guild.id}`) && await client.loggingmodule.has(`${message.guild.id}`)) {
        await LoggerLog(message.guild, {
            embeds: [
                new EmbedBuilder()
                .setColor(ee.errorColor)
                .setTitle(`:warning: Message Deleted :warning:`)
                .addFields([{
                    name: 'Message Content',
                    value: `${message.content}`
                }, {
                    name: 'Message Channel',
                    value: `${message.channel}`
                }, {
                    name: 'Author',
                    value: `${message.author}`
                }])
                .setFooter({text: `User ID: ${message.author.id}`})
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