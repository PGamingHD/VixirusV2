const client = require("../../index.js");
const ee = require("../../botconfig/embed.json");
const {
    LoggerLog
} = require("../../handler/functions");
const { EmbedBuilder } = require("discord.js");

client.on("roleUpdate", async (oldRole, newRole) => {
    if (await client.roleUpdate.has(`${newRole.guild.id}`) && await client.loggingmodule.has(`${newRole.guild.id}`)) {
        let changedData = "";
        if (oldRole.name !== newRole.name) {
            changedData += `ㅤㅤㅤㅤ**Name**\n\`\`\`Old: ${oldRole.name}\n-----------------------\nNew: ${newRole.name}\`\`\`\n`
        }
        
        if (oldRole.color !== newRole.color) {
            changedData += `ㅤㅤㅤㅤ**Color**\n\`\`\`Old: #${oldRole.color === 0 ? "000000" : Math.abs(oldRole.color).toString(16)}\n-----------------------\nNew: #${newRole.color === 0 ? "000000" : Math.abs(newRole.color).toString(16)}\`\`\`\n`
        }
        
        if (oldRole.mentionable !== newRole.mentionable) {
            changedData += `ㅤㅤㅤㅤ**Mentionable**\n\`\`\`Old: ${oldRole.mentionable === false ? `❌` : `✅`}\n-----------------------\nNew: ${newRole.mentionable === false ? `❌` : `✅`}\`\`\`\n`
        }
        
        if (oldRole.hoist !== newRole.hoist) {
            changedData += `ㅤㅤㅤㅤ**Hoisted**\n\`\`\`Old: ${oldRole.hoist === false ? `❌` : `✅`}\n-----------------------\nNew: ${newRole.hoist === false ? `❌` : `✅`}\`\`\`\n`
        }

        await LoggerLog(newRole.guild, {
            embeds: [
                new EmbedBuilder()
                .setColor(ee.maintenanceColor)
                .setTitle(`:warning: Role Updated :warning:`)
                .setDescription(`${changedData}`)
                .setFooter({text: `Role ID: ${newRole.id}`})
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