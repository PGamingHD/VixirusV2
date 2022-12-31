const client = require("../../index.js");
const ee = require("../../botconfig/embed.json");
const {
    LoggerLog
} = require("../../handler/functions");
const { EmbedBuilder, channelLink } = require("discord.js");

client.on("channelUpdate", async (oldchannel, newchannel) => {
    if (await client.channelUpdate.has(`${newchannel.guild.id}`) && await client.loggingmodule.has(`${newchannel.guild.id}`)) {
        let changedData = "";
        if (oldchannel.name !== newchannel.name) {
            changedData += `ㅤㅤㅤㅤㅤㅤ**Name**\n\`\`\`Old: ${oldchannel.name}\n-----------------------\nNew: ${newchannel.name}\`\`\`\n`
        } 

        if (oldchannel.nsfw !== newchannel.nsfw) {
            changedData += `ㅤㅤㅤㅤㅤㅤ**NSFW**\n\`\`\`Old: ${oldchannel.nsfw === true ? `✅` : `❌`}\n-----------------------\nNew: ${newchannel.nsfw === true ? `✅` : `❌`}\`\`\`\n`
        } 
        
        if (oldchannel?.topic !== newchannel?.topic) {
            changedData += `ㅤㅤㅤㅤㅤㅤ**Topic**\n\`\`\`Old: ${oldchannel?.topic === null ? `None` : `${oldchannel.topic}`}\n-----------------------\nNew: ${newchannel?.topic === null ? `None` : `${newchannel.topic}`}\`\`\`\n`
        }

        await LoggerLog(newchannel.guild, {
            embeds: [
                new EmbedBuilder()
                .setColor(ee.maintenanceColor)
                .setTitle(`:warning: Text Channel Updated :warning:`) 
                .setDescription(`${changedData}`)
                .setFooter({text: `Channel ID: ${newchannel.id}`})
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