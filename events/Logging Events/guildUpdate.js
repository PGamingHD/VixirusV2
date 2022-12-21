const client = require("../../index.js");
const ee = require("../../botconfig/embed.json");
const {
    LoggerLog
} = require("../../handler/functions");
const { EmbedBuilder } = require("discord.js");

client.on("guildUpdate", async (oldGuild, newGuild) => {
    if (await client.guildUpdate.has(`${newGuild.id}`) && await client.loggingmodule.has(`${newGuild.id}`)) {
        if (oldGuild.systemChannel !== newGuild.systemChannel && oldGuild.afkChannel !== newGuild.afkChannel && oldGuild.afkTimeout !== newGuild.afkTimeout && oldGuild.name !== newGuild.name) {
            await LoggerLog(newGuild, {
                embeds: [
                    new EmbedBuilder()
                    .setColor(ee.maintenanceColor)
                    .setTitle(`:warning: Guild Updated :warning:`)
                    .addFields([{
                        name: 'Old Name',
                        value: `${oldGuild.name}`
                    }, {
                        name: 'New Name',
                        value: `${newGuild.name}`
                    }, {
                        name: 'Old AFK Channel',
                        value: `${oldGuild.afkChannel === null ? "None" : oldGuild.afkChannel}`
                    }, {
                        name: 'New AFK Channel',
                        value: `${newGuild.afkChannel === null ? "None" : newGuild.afkChannel}`
                    }, {
                        name: 'Old System Channel',
                        value: `${oldGuild.systemChannel === null ? "None" : oldGuild.systemChannel}`
                    }, {
                        name: 'New System Channel',
                        value: `${newGuild.systemChannel === null ? "None" : newGuild.systemChannel}`
                    }, {
                        name: 'Old AFK Timeout',
                        value: `${oldGuild.afkTimeout / 60} minute(s)`
                    }, {
                        name: 'New AFK Timeout',
                        value: `${newGuild.afkTimeout / 60} minute(s)`
                    }])
                    .setThumbnail(`https://cdn.discordapp.com/attachments/1010999257899204769/1054749803193585714/support.png`)
                    .setTimestamp()
                ]
            });
        }
        if (oldGuild.systemChannel !== newGuild.systemChannel && oldGuild.afkChannel !== newGuild.afkChannel && oldGuild.afkTimeout !== newGuild.afkTimeout) {
            await LoggerLog(newGuild, {
                embeds: [
                    new EmbedBuilder()
                    .setColor(ee.maintenanceColor)
                    .setTitle(`:warning: Guild Updated :warning:`)
                    .addFields([{
                        name: 'Old System Channel',
                        value: `${oldGuild.systemChannel === null ? "None" : oldGuild.systemChannel}`
                    }, {
                        name: 'New System Channel',
                        value: `${newGuild.systemChannel === null ? "None" : newGuild.systemChannel}`
                    }, {
                        name: 'Old AFK Channel',
                        value: `${oldGuild.afkChannel === null ? "None" : oldGuild.afkChannel}`
                    }, {
                        name: 'New AFK Channel',
                        value: `${newGuild.afkChannel === null ? "None" : newGuild.afkChannel}`
                    }, {
                        name: 'Old AFK Timeout',
                        value: `${oldGuild.afkTimeout / 60} minute(s)`
                    }, {
                        name: 'New AFK Timeout',
                        value: `${newGuild.afkTimeout / 60} minute(s)`
                    }])
                    .setThumbnail(`https://cdn.discordapp.com/attachments/1010999257899204769/1054749803193585714/support.png`)
                    .setTimestamp()
                ]
            });
        }
        if (oldGuild.name !== newGuild.name && oldGuild.afkChannel !== newGuild.afkChannel && oldGuild.afkTimeout !== newGuild.afkTimeout) {
            await LoggerLog(newGuild, {
                embeds: [
                    new EmbedBuilder()
                    .setColor(ee.maintenanceColor)
                    .setTitle(`:warning: Guild Updated :warning:`)
                    .addFields([{
                        name: 'Old Name',
                        value: `${oldGuild.name}`
                    }, {
                        name: 'New Name',
                        value: `${newGuild.name}`
                    }, {
                        name: 'Old AFK Channel',
                        value: `${oldGuild.afkChannel === null ? "None" : oldGuild.afkChannel}`
                    }, {
                        name: 'New AFK Channel',
                        value: `${newGuild.afkChannel === null ? "None" : newGuild.afkChannel}`
                    }, {
                        name: 'Old AFK Timeout',
                        value: `${oldGuild.afkTimeout / 60} minute(s)`
                    }, {
                        name: 'New AFK Timeout',
                        value: `${newGuild.afkTimeout / 60} minute(s)`
                    }])
                    .setThumbnail(`https://cdn.discordapp.com/attachments/1010999257899204769/1054749803193585714/support.png`)
                    .setTimestamp()
                ]
            });
        }
        if (oldGuild.name !== newGuild.name && oldGuild.afkChannel !== newGuild.afkChannel && oldGuild.systemChannel !== newGuild.systemChannel) {
            await LoggerLog(newGuild, {
                embeds: [
                    new EmbedBuilder()
                    .setColor(ee.maintenanceColor)
                    .setTitle(`:warning: Guild Updated :warning:`)
                    .addFields([{
                        name: 'Old Name',
                        value: `${oldGuild.name}`
                    }, {
                        name: 'New Name',
                        value: `${newGuild.name}`
                    }, {
                        name: 'Old AFK Channel',
                        value: `${oldGuild.afkChannel === null ? "None" : oldGuild.afkChannel}`
                    }, {
                        name: 'New AFK Channel',
                        value: `${newGuild.afkChannel === null ? "None" : newGuild.afkChannel}`
                    }, {
                        name: 'Old System Channel',
                        value: `${oldGuild.systemChannel === null ? "None" : oldGuild.systemChannel}`
                    }, {
                        name: 'New System Channel',
                        value: `${newGuild.systemChannel === null ? "None" : newGuild.systemChannel}`
                    }])
                    .setThumbnail(`https://cdn.discordapp.com/attachments/1010999257899204769/1054749803193585714/support.png`)
                    .setTimestamp()
                ]
            });
        }
        if (oldGuild.name !== newGuild.name && oldGuild.systemChannel !== newGuild.systemChannel) {
            await LoggerLog(newGuild, {
                embeds: [
                    new EmbedBuilder()
                    .setColor(ee.maintenanceColor)
                    .setTitle(`:warning: Guild Updated :warning:`)
                    .addFields([{
                        name: 'Old Name',
                        value: `${oldGuild.name}`
                    }, {
                        name: 'New Name',
                        value: `${newGuild.name}`
                    }, {
                        name: 'Old System Channel',
                        value: `${oldGuild.systemChannel === null ? "None" : oldGuild.systemChannel}`
                    }, {
                        name: 'New System Channel',
                        value: `${newGuild.systemChannel === null ? "None" : newGuild.systemChannel}`
                    }])
                    .setThumbnail(`https://cdn.discordapp.com/attachments/1010999257899204769/1054749803193585714/support.png`)
                    .setTimestamp()
                ]
            });
        }
        if (oldGuild.systemChannel !== newGuild.systemChannel && oldGuild.afkChannel !== newGuild.afkChannel) {
            await LoggerLog(newGuild, {
                embeds: [
                    new EmbedBuilder()
                    .setColor(ee.maintenanceColor)
                    .setTitle(`:warning: Guild Updated :warning:`)
                    .addFields([{
                        name: 'Old System Channel',
                        value: `${oldGuild.systemChannel === null ? "None" : oldGuild.systemChannel}`
                    }, {
                        name: 'New System Channel',
                        value: `${newGuild.systemChannel === null ? "None" : newGuild.systemChannel}`
                    }, {
                        name: 'Old AFK Channel',
                        value: `${oldGuild.afkChannel === null ? "None" : oldGuild.afkChannel}`
                    }, {
                        name: 'New AFK Channel',
                        value: `${newGuild.afkChannel === null ? "None" : newGuild.afkChannel}`
                    }])
                    .setThumbnail(`https://cdn.discordapp.com/attachments/1010999257899204769/1054749803193585714/support.png`)
                    .setTimestamp()
                ]
            });
        }
        if (oldGuild.afkTimeout !== newGuild.afkTimeout && oldGuild.afkChannel !== newGuild.afkChannel) {
            await LoggerLog(newGuild, {
                embeds: [
                    new EmbedBuilder()
                    .setColor(ee.maintenanceColor)
                    .setTitle(`:warning: Guild Updated :warning:`)
                    .addFields([{
                        name: 'Old AFK Timeout',
                        value: `${oldGuild.afkTimeout / 60} minute(s)`
                    }, {
                        name: 'New AFK Timeout',
                        value: `${newGuild.afkTimeout / 60} minute(s)`
                    }, {
                        name: 'Old AFK Channel',
                        value: `${oldGuild.afkChannel === null ? "None" : oldGuild.afkChannel}`
                    }, {
                        name: 'New AFK Channel',
                        value: `${newGuild.afkChannel === null ? "None" : newGuild.afkChannel}`
                    }])
                    .setThumbnail(`https://cdn.discordapp.com/attachments/1010999257899204769/1054749803193585714/support.png`)
                    .setTimestamp()
                ]
            });
        }
        if (oldGuild.name !== newGuild.name && oldGuild.afkTimeout !== newGuild.afkTimeout) {
            await LoggerLog(newGuild, {
                embeds: [
                    new EmbedBuilder()
                    .setColor(ee.maintenanceColor)
                    .setTitle(`:warning: Guild Updated :warning:`)
                    .addFields([{
                        name: 'Old Name',
                        value: `${oldGuild.name}`
                    }, {
                        name: 'New Name',
                        value: `${newGuild.name}`
                    }, {
                        name: 'Old AFK Timeout',
                        value: `${oldGuild.afkTimeout / 60} minute(s)`
                    }, {
                        name: 'New AFK Timeout',
                        value: `${newGuild.afkTimeout / 60} minute(s)`
                    }])
                    .setThumbnail(`https://cdn.discordapp.com/attachments/1010999257899204769/1054749803193585714/support.png`)
                    .setTimestamp()
                ]
            });
        }
        if (oldGuild.systemChannel !== newGuild.systemChannel && oldGuild.afkTimeout !== newGuild.afkTimeout) {
            await LoggerLog(newGuild, {
                embeds: [
                    new EmbedBuilder()
                    .setColor(ee.maintenanceColor)
                    .setTitle(`:warning: Guild Updated :warning:`)
                    .addFields([{
                        name: 'Old System Channel',
                        value: `${oldGuild.systemChannel === null ? "None" : oldGuild.systemChannel}`
                    }, {
                        name: 'New System Channel',
                        value: `${newGuild.systemChannel === null ? "None" : newGuild.systemChannel}`
                    }, {
                        name: 'Old AFK Channel',
                        value: `${oldGuild.afkChannel === null ? "None" : oldGuild.afkChannel}`
                    }, {
                        name: 'New AFK Channel',
                        value: `${newGuild.afkChannel === null ? "None" : newGuild.afkChannel}`
                    }])
                    .setThumbnail(`https://cdn.discordapp.com/attachments/1010999257899204769/1054749803193585714/support.png`)
                    .setTimestamp()
                ]
            });
        }
        if (oldGuild.name !== newGuild.name && oldGuild.afkChannel !== newGuild.afkChannel) {
            await LoggerLog(newGuild, {
                embeds: [
                    new EmbedBuilder()
                    .setColor(ee.maintenanceColor)
                    .setTitle(`:warning: Guild Updated :warning:`)
                    .addFields([{
                        name: 'Old Name',
                        value: `${oldGuild.name}`
                    }, {
                        name: 'New Name',
                        value: `${newGuild.name}`
                    }, {
                        name: 'Old AFK Channel',
                        value: `${oldGuild.afkChannel === null ? "None" : oldGuild.afkChannel}`
                    }, {
                        name: 'New AFK Channel',
                        value: `${newGuild.afkChannel === null ? "None" : newGuild.afkChannel}`
                    }])
                    .setThumbnail(`https://cdn.discordapp.com/attachments/1010999257899204769/1054749803193585714/support.png`)
                    .setTimestamp()
                ]
            });
        }
    
        if (oldGuild.afkTimeout !== newGuild.afkTimeout) {
            await LoggerLog(newGuild, {
                embeds: [
                    new EmbedBuilder()
                    .setColor(ee.maintenanceColor)
                    .setTitle(`:warning: Guild Updated :warning:`)
                    .addFields([{
                        name: 'Old AFK Timeout',
                        value: `${oldGuild.afkTimeout / 60} minute(s)`
                    }, {
                        name: 'New AFK Timeout',
                        value: `${newGuild.afkTimeout / 60} minute(s)`
                    }])
                    .setThumbnail(`https://cdn.discordapp.com/attachments/1010999257899204769/1054749803193585714/support.png`)
                    .setTimestamp()
                ]
            });
        } else if (oldGuild.systemChannel !== newGuild.systemChannel) {
            await LoggerLog(newGuild, {
                embeds: [
                    new EmbedBuilder()
                    .setColor(ee.maintenanceColor)
                    .setTitle(`:warning: Guild Updated :warning:`)
                    .addFields([{
                        name: 'Old System Channel',
                        value: `${oldGuild.systemChannel === null ? "None" : oldGuild.systemChannel}`
                    }, {
                        name: 'New System Channel',
                        value: `${newGuild.systemChannel === null ? "None" : newGuild.systemChannel}`
                    }])
                    .setThumbnail(`https://cdn.discordapp.com/attachments/1010999257899204769/1054749803193585714/support.png`)
                    .setTimestamp()
                ]
            });
        } else if (oldGuild.afkChannel !== newGuild.afkChannel) {
            await LoggerLog(newGuild, {
                embeds: [
                    new EmbedBuilder()
                    .setColor(ee.maintenanceColor)
                    .setTitle(`:warning: Guild Updated :warning:`)
                    .addFields([{
                        name: 'Old AFK Channel',
                        value: `${oldGuild.afkChannel === null ? "None" : oldGuild.afkChannel}`
                    }, {
                        name: 'New AFK Channel',
                        value: `${newGuild.afkChannel === null ? "None" : newGuild.afkChannel}`
                    }])
                    .setThumbnail(`https://cdn.discordapp.com/attachments/1010999257899204769/1054749803193585714/support.png`)
                    .setTimestamp()
                ]
            });
        } else if (oldGuild.name !== newGuild.name) {
            await LoggerLog(newGuild, {
                embeds: [
                    new EmbedBuilder()
                    .setColor(ee.maintenanceColor)
                    .setTitle(`:warning: Guild Updated :warning:`)
                    .addFields([{
                        name: 'Old Name',
                        value: `${oldGuild.name}`
                    }, {
                        name: 'New Name',
                        value: `${newGuild.name}`
                    }])
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