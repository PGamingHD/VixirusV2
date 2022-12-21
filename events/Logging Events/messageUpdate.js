const client = require("../../index.js");
const ee = require("../../botconfig/embed.json");
const {
    LoggerLog
} = require("../../handler/functions");
const { EmbedBuilder } = require("discord.js");

client.on("messageUpdate", async (oldMessage, newMessage) => {
    if (await client.messageUpdate.has(`${newMessage.guild.id}`) && await client.loggingmodule.has(`${newMessage.guild.id}`)) {
        await LoggerLog(newMessage.guild, {
            embeds: [
                new EmbedBuilder()
                .setColor(ee.maintenanceColor)
                .setTitle(`:warning: Message Updated :warning:`)
                .addFields([{
                    name: 'Old Message',
                    value: `${oldMessage.content}`
                }, {
                    name: 'New Message',
                    value: `${newMessage.content}`
                }, {
                    name: 'Message Channel',
                    value: `${newMessage.channel}`
                }, {
                    name: 'Author',
                    value: `${newMessage.author}`
                }])
                .setFooter({text: `User ID: ${newMessage.author.id}`})
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