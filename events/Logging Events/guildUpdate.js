const client = require("../../index.js");
const ee = require("../../botconfig/embed.json");
const {
    LoggerLog
} = require("../../handler/functions");
const { EmbedBuilder } = require("discord.js");

client.on("guildUpdate", async (oldGuild, newGuild) => {
    if (await client.guildUpdate.has(`${newGuild.id}`) && await client.loggingmodule.has(`${newGuild.id}`)) {
        let changedData = "";
        if (oldGuild.afkTimeout !== newGuild.afkTimeout) {
            changedData += `ㅤㅤㅤㅤ**AFK Timeout**\n\`\`\`Old: ${oldGuild.afkTimeout / 60} minute(s)\n-----------------------\nNew: ${newGuild.afkTimeout / 60} minute(s)\`\`\`\n`
        }
        
        if (oldGuild.systemChannel !== newGuild.systemChannel) {
            changedData += `ㅤㅤㅤㅤ**System Channel**\n\`\`\`Old: ${oldGuild.systemChannel === null ? "None" : oldGuild.systemChannel.name}\n-----------------------\nNew: ${newGuild.systemChannel === null ? "None" : newGuild.systemChannel.name}\`\`\`\n`
        }

        if (oldGuild.afkChannel !== newGuild.afkChannel) {
            changedData += `ㅤㅤㅤㅤ**AFK Channel**\n\`\`\`Old: ${oldGuild.afkChannel === null ? "None" : oldGuild.afkChannel.name}\n-----------------------\nNew: ${newGuild.afkChannel === null ? "None" : newGuild.afkChannel.name}\`\`\`\n`
        }

        if (oldGuild.name !== newGuild.name) {
            changedData += `ㅤㅤㅤㅤ**Name**\n\`\`\`Old: ${oldGuild.name}\n-----------------------\nNew: ${newGuild.name}\`\`\`\n`
        }

        await LoggerLog(newGuild, {
            embeds: [
                new EmbedBuilder()
                .setColor(ee.maintenanceColor)
                .setTitle(`:warning: Guild Updated :warning:`)
                .setDescription(`${changedData}`)
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