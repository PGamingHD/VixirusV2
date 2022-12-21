const client = require("../../index.js");
const ee = require("../../botconfig/embed.json");
const {
    LoggerLog
} = require("../../handler/functions");
const { EmbedBuilder, channelLink } = require("discord.js");

client.on("channelUpdate", async (oldchannel, newchannel) => {
    if (await client.channelUpdate.has(`${newchannel.guild.id}`) && await client.loggingmodule.has(`${newchannel.guild.id}`)) {
        if (oldchannel.name !== newchannel.name && oldchannel.nsfw !== newchannel.nsfw && oldchannel?.topic !== newchannel?.topic) {
            await LoggerLog(newchannel.guild, {
                embeds: [
                    new EmbedBuilder()
                    .setColor(ee.maintenanceColor)
                    .setTitle(`:warning: Text Channel Updated :warning:`) 
                    .addFields([{
                        name: 'Name Before',
                        value: `${oldchannel.name}`,
                    }, {
                        name: 'Name After',
                        value: `${newchannel.name}`,
                    }, {
                        name: 'NSFW Before',
                        value: `${oldchannel.nsfw === false ? ":x:" : ":white_check_mark:"}`,
                    }, {
                        name: 'NSFW After',
                        value: `${newchannel.nsfw === false ? ":x:" : ":white_check_mark:"}`,
                    }, {
                        name: 'Topic Before',
                        value: `\`\`\`${oldchannel?.topic === null ? "No Topic" : oldchannel?.topic}\`\`\``
                    }, {
                        name: 'Topic After',
                        value: `\`\`\`${newchannel?.topic === null ? "No Topic" : newchannel?.topic}\`\`\``
                    }])
                    .setFooter({text: `Channel ID: ${newchannel.id}`})
                    .setThumbnail(`https://cdn.discordapp.com/attachments/1010999257899204769/1054749803193585714/support.png`)
                    .setTimestamp()
                ]
            });
        } else if (oldchannel?.topic !== newchannel?.topic && oldchannel.nsfw !== newchannel.nsfw) {
            await LoggerLog(newchannel.guild, {
                embeds: [
                    new EmbedBuilder()
                    .setColor(ee.maintenanceColor)
                    .setTitle(`:warning: Text Channel Updated :warning:`) 
                    .addFields([{
                        name: 'Topic Before',
                        value: `\`\`\`${oldchannel?.topic === null ? "No Topic" : oldchannel?.topic}\`\`\``
                    }, {
                        name: 'Topic After',
                        value: `\`\`\`${newchannel?.topic === null ? "No Topic" : newchannel?.topic}\`\`\``
                    }, {
                        name: 'NSFW Before',
                        value: `${oldchannel.nsfw === false ? ":x:" : ":white_check_mark:"}`,
                    }, {
                        name: 'NSFW After',
                        value: `${newchannel.nsfw === false ? ":x:" : ":white_check_mark:"}`,
                    }])
                    .setFooter({text: `Channel ID: ${newchannel.id}`})
                    .setThumbnail(`https://cdn.discordapp.com/attachments/1010999257899204769/1054749803193585714/support.png`)
                    .setTimestamp()
                ]
            });
        } else if (oldchannel.name !== newchannel.name && oldchannel?.topic !== newchannel?.topic) {
            await LoggerLog(newchannel.guild, {
                embeds: [
                    new EmbedBuilder()
                    .setColor(ee.maintenanceColor)
                    .setTitle(`:warning: Text Channel Updated :warning:`)
                    .addFields([{
                        name: 'Name Before',
                        value: `${oldchannel.name}`,
                    }, {
                        name: 'Name After',
                        value: `${newchannel.name}`,
                    }, {
                        name: 'Topic Before',
                        value: `\`\`\`${oldchannel?.topic === null ? "No Topic" : oldchannel?.topic}\`\`\``
                    }, {
                        name: 'Topic After',
                        value: `\`\`\`${newchannel?.topic === null ? "No Topic" : newchannel?.topic}\`\`\``
                    }])
                    .setFooter({text: `Channel ID: ${newchannel.id}`})
                    .setThumbnail(`https://cdn.discordapp.com/attachments/1010999257899204769/1054749803193585714/support.png`)
                    .setTimestamp()
                ]
            });
        } else if (oldchannel.name !== newchannel.name && oldchannel.nsfw !== newchannel.nsfw) {
            await LoggerLog(newchannel.guild, {
                embeds: [
                    new EmbedBuilder()
                    .setColor(ee.maintenanceColor)
                    .setTitle(`:warning: Text Channel Updated :warning:`) 
                    .addFields([{
                        name: 'Name Before',
                        value: `${oldchannel.name}`,
                    }, {
                        name: 'Name After',
                        value: `${newchannel.name}`,
                    }, {
                        name: 'NSFW Before',
                        value: `${oldchannel.nsfw === false ? ":x:" : ":white_check_mark:"}`,
                    }, {
                        name: 'NSFW After',
                        value: `${newchannel.nsfw === false ? ":x:" : ":white_check_mark:"}`,
                    }])
                    .setFooter({text: `Channel ID: ${newchannel.id}`})
                    .setThumbnail(`https://cdn.discordapp.com/attachments/1010999257899204769/1054749803193585714/support.png`)
                    .setTimestamp()
                ]
            });
        } else if (oldchannel.name !== newchannel.name) {
            await LoggerLog(newchannel.guild, {
                embeds: [
                    new EmbedBuilder()
                    .setColor(ee.maintenanceColor)
                    .setTitle(`:warning: Text Channel Updated :warning:`) 
                    .addFields([{
                        name: 'Name Before',
                        value: `${oldchannel.name}`,
                    }, {
                        name: 'Name After',
                        value: `${newchannel.name}`,
                    }])
                    .setFooter({text: `Channel ID: ${newchannel.id}`})
                    .setThumbnail(`https://cdn.discordapp.com/attachments/1010999257899204769/1054749803193585714/support.png`)
                    .setTimestamp()
                ]
            });
        } else if (oldchannel.nsfw !== newchannel.nsfw) {
            await LoggerLog(newchannel.guild, {
                embeds: [
                    new EmbedBuilder()
                    .setColor(ee.maintenanceColor)
                    .setTitle(`:warning: Text Channel Updated :warning:`) 
                    .addFields([{
                        name: 'NSFW Before',
                        value: `${oldchannel.nsfw === false ? ":x:" : ":white_check_mark:"}`,
                    }, {
                        name: 'NSFW After',
                        value: `${newchannel.nsfw === false ? ":x:" : ":white_check_mark:"}`,
                    }])
                    .setFooter({text: `Channel ID: ${newchannel.id}`})
                    .setThumbnail(`https://cdn.discordapp.com/attachments/1010999257899204769/1054749803193585714/support.png`)
                    .setTimestamp()
                ]
            });
        } else if (oldchannel?.topic !== newchannel?.topic) {
            await LoggerLog(newchannel.guild, {
                embeds: [
                    new EmbedBuilder()
                    .setColor(ee.maintenanceColor)
                    .setTitle(`:warning: Text Channel Updated :warning:`) 
                    .addFields([{
                        name: 'Topic Before',
                        value: `\`\`\`${oldchannel?.topic === null ? "No Topic" : oldchannel?.topic}\`\`\``
                    }, {
                        name: 'Topic After',
                        value: `\`\`\`${newchannel?.topic === null ? "No Topic" : newchannel?.topic}\`\`\``
                    }])
                    .setFooter({text: `Channel ID: ${newchannel.id}`})
                    .setThumbnail(`https://cdn.discordapp.com/attachments/1010999257899204769/1054749803193585714/support.png`)
                    .setTimestamp()
                ]
            });
        }
    }
});


/*

Code used in this script has been written by original PizzaParadise developer - PGamingHD#0666
Require assistance with scripts? Join the discord and get help right away! - https://discord.gg/pxySje4GPC
Other than that, please do note that it is required if you are using this to mention the original developer
Original Developer - PGamingHD#0666

*/