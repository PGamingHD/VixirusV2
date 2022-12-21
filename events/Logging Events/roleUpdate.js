const client = require("../../index.js");
const ee = require("../../botconfig/embed.json");
const {
    LoggerLog
} = require("../../handler/functions");
const { EmbedBuilder } = require("discord.js");

client.on("roleUpdate", async (oldRole, newRole) => {
    if (await client.roleUpdate.has(`${newRole.guild.id}`) && await client.loggingmodule.has(`${newRole.guild.id}`)) {
        if (oldRole.name !== newRole.name && oldRole.color !== newRole.color && oldRole.mentionable !== newRole.mentionable && oldRole.hoist !== newRole.hoist) {
            await LoggerLog(newRole.guild, {
                embeds: [
                    new EmbedBuilder()
                    .setColor(ee.maintenanceColor)
                    .setTitle(`:warning: Role Updated :warning:`)
                    .addFields([{
                        name: 'Old Name',
                        value: `${oldRole.name}`
                    }, {
                        name: 'New Name',
                        value: `${newRole.name}`
                    }, {
                        name: 'Old Color',
                        value: `#${Math.abs(oldRole.color).toString(16)}`
                    }, {
                        name: 'New Color',
                        value: `#${Math.abs(newRole.color).toString(16)}`
                    }, {
                        name: 'Old Mentionable',
                        value: `${oldRole.mentionable === false ? ":x:" : ":white_check_mark:"}`
                    }, {
                        name: 'New Mentionable',
                        value: `${newRole.mentionable === false ? ":x:" : ":white_check_mark:"}`
                    }, {
                        name: 'Old Hoisted',
                        value: `${oldRole.hoist === false ? ":x:" : ":white_check_mark:"}`
                    }, {
                        name: 'New Hoisted',
                        value: `${newRole.hoist === false ? ":x:" : ":white_check_mark:"}`
                    }])
                    .setFooter({text: `Role ID: ${newRole.id}`})
                    .setThumbnail(`https://cdn.discordapp.com/attachments/1010999257899204769/1054749803193585714/support.png`)
                    .setTimestamp()
                ]
            });
        } else if (oldRole.name !== newRole.name && oldRole.color !== newRole.color && oldRole.hoist !== newRole.hoist) {
            await LoggerLog(newRole.guild, {
                embeds: [
                    new EmbedBuilder()
                    .setColor(ee.maintenanceColor)
                    .setTitle(`:warning: Role Updated :warning:`)
                    .addFields([{
                        name: 'Old Name',
                        value: `${oldRole.name}`
                    }, {
                        name: 'New Name',
                        value: `${newRole.name}`
                    }, {
                        name: 'Old Color',
                        value: `#${Math.abs(oldRole.color).toString(16)}`
                    }, {
                        name: 'New Color',
                        value: `#${Math.abs(newRole.color).toString(16)}`
                    }, {
                        name: 'Old Hoisted',
                        value: `${oldRole.hoist === false ? ":x:" : ":white_check_mark:"}`
                    }, {
                        name: 'New Hoisted',
                        value: `${newRole.hoist === false ? ":x:" : ":white_check_mark:"}`
                    }])
                    .setFooter({text: `Role ID: ${newRole.id}`})
                    .setThumbnail(`https://cdn.discordapp.com/attachments/1010999257899204769/1054749803193585714/support.png`)
                    .setTimestamp()
                ]
            });
        } else if (oldRole.name !== newRole.name && oldRole.mentionable !== newRole.mentionable && oldRole.hoist !== newRole.hoist) {
            await LoggerLog(newRole.guild, {
                embeds: [
                    new EmbedBuilder()
                    .setColor(ee.maintenanceColor)
                    .setTitle(`:warning: Role Updated :warning:`)
                    .addFields([{
                        name: 'Old Name',
                        value: `${oldRole.name}`
                    }, {
                        name: 'New Name',
                        value: `${newRole.name}`
                    }, {
                        name: 'Old Mentionable',
                        value: `${oldRole.mentionable === false ? ":x:" : ":white_check_mark:"}`
                    }, {
                        name: 'New Mentionable',
                        value: `${newRole.mentionable === false ? ":x:" : ":white_check_mark:"}`
                    }, {
                        name: 'Old Hoisted',
                        value: `${oldRole.hoist === false ? ":x:" : ":white_check_mark:"}`
                    }, {
                        name: 'New Hoisted',
                        value: `${newRole.hoist === false ? ":x:" : ":white_check_mark:"}`
                    }])
                    .setFooter({text: `Role ID: ${newRole.id}`})
                    .setThumbnail(`https://cdn.discordapp.com/attachments/1010999257899204769/1054749803193585714/support.png`)
                    .setTimestamp()
                ]
            });
        } else if (oldRole.color !== newRole.color && oldRole.mentionable !== newRole.mentionable && oldRole.hoist !== newRole.hoist) {
            await LoggerLog(newRole.guild, {
                embeds: [
                    new EmbedBuilder()
                    .setColor(ee.maintenanceColor)
                    .setTitle(`:warning: Role Updated :warning:`)
                    .addFields([{
                        name: 'Old Color',
                        value: `#${Math.abs(oldRole.color).toString(16)}`
                    }, {
                        name: 'New Color',
                        value: `#${Math.abs(newRole.color).toString(16)}`
                    }, {
                        name: 'Old Mentionable',
                        value: `${oldRole.mentionable === false ? ":x:" : ":white_check_mark:"}`
                    }, {
                        name: 'New Mentionable',
                        value: `${newRole.mentionable === false ? ":x:" : ":white_check_mark:"}`
                    }, {
                        name: 'Old Hoisted',
                        value: `${oldRole.hoist === false ? ":x:" : ":white_check_mark:"}`
                    }, {
                        name: 'New Hoisted',
                        value: `${newRole.hoist === false ? ":x:" : ":white_check_mark:"}`
                    }])
                    .setFooter({text: `Role ID: ${newRole.id}`})
                    .setThumbnail(`https://cdn.discordapp.com/attachments/1010999257899204769/1054749803193585714/support.png`)
                    .setTimestamp()
                ]
            });
        } else if (oldRole.name !== newRole.name && oldRole.color && newRole.color && oldRole.mentionable !== newRole.mentionable) {
            await LoggerLog(newRole.guild, {
                embeds: [
                    new EmbedBuilder()
                    .setColor(ee.maintenanceColor)
                    .setTitle(`:warning: Role Updated :warning:`)
                    .addFields([{
                        name: 'Old Name',
                        value: `${oldRole.name}`
                    }, {
                        name: 'New Name',
                        value: `${newRole.name}`
                    }, {
                        name: 'Old Color',
                        value: `#${Math.abs(oldRole.color).toString(16)}`
                    }, {
                        name: 'New Color',
                        value: `#${Math.abs(newRole.color).toString(16)}`
                    }, {
                        name: 'Old Mentionable',
                        value: `${oldRole.mentionable === false ? ":x:" : ":white_check_mark:"}`
                    }, {
                        name: 'New Mentionable',
                        value: `${newRole.mentionable === false ? ":x:" : ":white_check_mark:"}`
                    }])
                    .setFooter({text: `Role ID: ${newRole.id}`})
                    .setThumbnail(`https://cdn.discordapp.com/attachments/1010999257899204769/1054749803193585714/support.png`)
                    .setTimestamp()
                ]
            });
        } else if (oldRole.name !== newRole.name && oldRole.color !== newRole.color) {
            await LoggerLog(newRole.guild, {
                embeds: [
                    new EmbedBuilder()
                    .setColor(ee.maintenanceColor)
                    .setTitle(`:warning: Role Updated :warning:`)
                    .addFields([{
                        name: 'Old Name',
                        value: `${oldRole.name}`
                    }, {
                        name: 'New Name',
                        value: `${newRole.name}`
                    }, {
                        name: 'Old Color',
                        value: `#${Math.abs(oldRole.color).toString(16)}`
                    }, {
                        name: 'New Color',
                        value: `#${Math.abs(newRole.color).toString(16)}`
                    }])
                    .setFooter({text: `Role ID: ${newRole.id}`})
                    .setThumbnail(`https://cdn.discordapp.com/attachments/1010999257899204769/1054749803193585714/support.png`)
                    .setTimestamp()
                ]
            });
        } else if (oldRole.color !== newRole.color && oldRole.mentionable !== newRole.mentionable) {
            await LoggerLog(newRole.guild, {
                embeds: [
                    new EmbedBuilder()
                    .setColor(ee.maintenanceColor)
                    .setTitle(`:warning: Role Updated :warning:`)
                    .addFields([{
                        name: 'Old Color',
                        value: `#${Math.abs(oldRole.color).toString(16)}`
                    }, {
                        name: 'New Color',
                        value: `#${Math.abs(newRole.color).toString(16)}`
                    }, {
                        name: 'Old Mentionable',
                        value: `${oldRole.mentionable === false ? ":x:" : ":white_check_mark:"}`
                    }, {
                        name: 'New Mentionable',
                        value: `${newRole.mentionable === false ? ":x:" : ":white_check_mark:"}`
                    }])
                    .setFooter({text: `Role ID: ${newRole.id}`})
                    .setThumbnail(`https://cdn.discordapp.com/attachments/1010999257899204769/1054749803193585714/support.png`)
                    .setTimestamp()
                ]
            });
        } else if (oldRole.name !== newRole.name && oldRole.mentionable !== newRole.mentionable) {
            await LoggerLog(newRole.guild, {
                embeds: [
                    new EmbedBuilder()
                    .setColor(ee.maintenanceColor)
                    .setTitle(`:warning: Role Updated :warning:`)
                    .addFields([{
                        name: 'Old Name',
                        value: `${oldRole.name}`
                    }, {
                        name: 'New Name',
                        value: `${newRole.name}`
                    }, {
                        name: 'Old Mentionable',
                        value: `${oldRole.mentionable === false ? ":x:" : ":white_check_mark:"}`
                    }, {
                        name: 'New Mentionable',
                        value: `${newRole.mentionable === false ? ":x:" : ":white_check_mark:"}`
                    }])
                    .setFooter({text: `Role ID: ${newRole.id}`})
                    .setThumbnail(`https://cdn.discordapp.com/attachments/1010999257899204769/1054749803193585714/support.png`)
                    .setTimestamp()
                ]
            });
        } else if (oldRole.name !== newRole.name && oldRole.hoist !== newRole.hoist) {
            await LoggerLog(newRole.guild, {
                embeds: [
                    new EmbedBuilder()
                    .setColor(ee.maintenanceColor)
                    .setTitle(`:warning: Role Updated :warning:`)
                    .addFields([{
                        name: 'Old Name',
                        value: `${oldRole.name}`
                    }, {
                        name: 'New Name',
                        value: `${newRole.name}`
                    }, {
                        name: 'Old Hoisted',
                        value: `${oldRole.hoist === false ? ":x:" : ":white_check_mark:"}`
                    }, {
                        name: 'New Hoisted',
                        value: `${newRole.hoist === false ? ":x:" : ":white_check_mark:"}`
                    }])
                    .setFooter({text: `Role ID: ${newRole.id}`})
                    .setThumbnail(`https://cdn.discordapp.com/attachments/1010999257899204769/1054749803193585714/support.png`)
                    .setTimestamp()
                ]
            });
        } else if (oldRole.color !== newRole.color && oldRole.hoist !== newRole.hoist) {
            await LoggerLog(newRole.guild, {
                embeds: [
                    new EmbedBuilder()
                    .setColor(ee.maintenanceColor)
                    .setTitle(`:warning: Role Updated :warning:`)
                    .addFields([{
                        name: 'Old Color',
                        value: `#${Math.abs(oldRole.color).toString(16)}`
                    }, {
                        name: 'New Color',
                        value: `#${Math.abs(newRole.color).toString(16)}`
                    }, {
                        name: 'Old Hoisted',
                        value: `${oldRole.hoist === false ? ":x:" : ":white_check_mark:"}`
                    }, {
                        name: 'New Hoisted',
                        value: `${newRole.hoist === false ? ":x:" : ":white_check_mark:"}`
                    }])
                    .setFooter({text: `Role ID: ${newRole.id}`})
                    .setThumbnail(`https://cdn.discordapp.com/attachments/1010999257899204769/1054749803193585714/support.png`)
                    .setTimestamp()
                ]
            });
        } else if (oldRole.hoist !== newRole.hoist && oldRole.mentionable !== newRole.mentionable) {
            await LoggerLog(newRole.guild, {
                embeds: [
                    new EmbedBuilder()
                    .setColor(ee.maintenanceColor)
                    .setTitle(`:warning: Role Updated :warning:`)
                    .addFields([{
                        name: 'Old Mentionable',
                        value: `${oldRole.mentionable === false ? ":x:" : ":white_check_mark:"}`
                    }, {
                        name: 'New Mentionable',
                        value: `${newRole.mentionable === false ? ":x:" : ":white_check_mark:"}`
                    }, {
                        name: 'Old Hoisted',
                        value: `${oldRole.hoist === false ? ":x:" : ":white_check_mark:"}`
                    }, {
                        name: 'New Hoisted',
                        value: `${newRole.hoist === false ? ":x:" : ":white_check_mark:"}`
                    }])
                    .setFooter({text: `Role ID: ${newRole.id}`})
                    .setThumbnail(`https://cdn.discordapp.com/attachments/1010999257899204769/1054749803193585714/support.png`)
                    .setTimestamp()
                ]
            });
        } else if (oldRole.name !== newRole.name) {
            await LoggerLog(newRole.guild, {
                embeds: [
                    new EmbedBuilder()
                    .setColor(ee.maintenanceColor)
                    .setTitle(`:warning: Role Updated :warning:`)
                    .addFields([{
                        name: 'Old Name',
                        value: `${oldRole.name}`
                    }, {
                        name: 'New Name',
                        value: `${newRole.name}`
                    }])
                    .setFooter({text: `Role ID: ${newRole.id}`})
                    .setThumbnail(`https://cdn.discordapp.com/attachments/1010999257899204769/1054749803193585714/support.png`)
                    .setTimestamp()
                ]
            });
        } else if (oldRole.color !== newRole.color) {
            await LoggerLog(newRole.guild, {
                embeds: [
                    new EmbedBuilder()
                    .setColor(ee.maintenanceColor)
                    .setTitle(`:warning: Role Updated :warning:`)
                    .addFields([{
                        name: 'Old Color',
                        value: `#${Math.abs(oldRole.color).toString(16)}`
                    }, {
                        name: 'New Color',
                        value: `#${Math.abs(newRole.color).toString(16)}`
                    }])
                    .setFooter({text: `Role ID: ${newRole.id}`})
                    .setThumbnail(`https://cdn.discordapp.com/attachments/1010999257899204769/1054749803193585714/support.png`)
                    .setTimestamp()
                ]
            });
        } else if (oldRole.mentionable !== newRole.mentionable) {
            await LoggerLog(newRole.guild, {
                embeds: [
                    new EmbedBuilder()
                    .setColor(ee.maintenanceColor)
                    .setTitle(`:warning: Role Updated :warning:`)
                    .addFields([{
                        name: 'Old Mentionable',
                        value: `${oldRole.mentionable === false ? ":x:" : ":white_check_mark:"}`
                    }, {
                        name: 'New Mentionable',
                        value: `${newRole.mentionable === false ? ":x:" : ":white_check_mark:"}`
                    }])
                    .setFooter({text: `Role ID: ${newRole.id}`})
                    .setThumbnail(`https://cdn.discordapp.com/attachments/1010999257899204769/1054749803193585714/support.png`)
                    .setTimestamp()
                ]
            });
        } else if (oldRole.hoist !== newRole.hoist) {
            await LoggerLog(newRole.guild, {
                embeds: [
                    new EmbedBuilder()
                    .setColor(ee.maintenanceColor)
                    .setTitle(`:warning: Role Updated :warning:`)
                    .addFields([{
                        name: 'Old Hoisted',
                        value: `${oldRole.hoist === false ? ":x:" : ":white_check_mark:"}`
                    }, {
                        name: 'New Hoisted',
                        value: `${newRole.hoist === false ? ":x:" : ":white_check_mark:"}`
                    }])
                    .setFooter({text: `Role ID: ${newRole.id}`})
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