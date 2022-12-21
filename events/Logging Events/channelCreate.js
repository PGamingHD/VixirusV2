const client = require("../../index.js");
const ee = require("../../botconfig/embed.json");
const {
    LoggerLog
} = require("../../handler/functions");
const { EmbedBuilder } = require("discord.js");

client.on("channelCreate", async (channel) => {
    if (await client.channelCreate.has(`${channel.guild.id}`) && await client.loggingmodule.has(`${channel.guild.id}`)) {
        if (channel.type === 0) {
            try {
                var categoryName = await channel.guild.channels.fetch(`${channel.parentId}`);
            } catch {}
    
            await LoggerLog(channel.guild, {
                embeds: [
                    new EmbedBuilder()
                    .setColor(ee.successColor)
                    .setTitle(`:warning: Text Channel Created :warning:`) 
                    .addFields([{
                        name: 'Channel Name',
                        value: `${channel.name}`
                    }, {
                        name: 'Category',
                        value: `${categoryName?.name === undefined ? "No Category" : categoryName.name}`
                    }, {
                        name: 'NSFW',
                        value: `${channel?.nsfw === false ? ":x:" : ":white_check_mark:"}`
                    }])
                    .setFooter({text: `Channel ID: ${channel.id}`})
                    .setThumbnail(`https://cdn.discordapp.com/attachments/1010999257899204769/1054749803193585714/support.png`)
                    .setTimestamp()
                ]
            });
        } else if (channel.type === 4) {
            try {
                var categoryName = await channel.guild.channels.fetch(`${channel.parentId}`);
            } catch {}
    
            await LoggerLog(channel.guild, {
                embeds: [
                    new EmbedBuilder()
                    .setColor(ee.successColor)
                    .setTitle(`:warning: Category Channel Created :warning:`) 
                    .addFields([{
                        name: 'Category Name',
                        value: `${channel.name}`
                    }, {
                        name: 'Category',
                        value: `${categoryName?.name === undefined ? "No Category" : categoryName.name}`
                    }, {
                        name: 'NSFW',
                        value: `${channel?.nsfw === false ? ":x:" : ":white_check_mark:"}`
                    }])
                    .setFooter({text: `Channel ID: ${channel.id}`})
                    .setThumbnail(`https://cdn.discordapp.com/attachments/1010999257899204769/1054749803193585714/support.png`)
                    .setTimestamp()
                ]
            });
        } else if (channel.type === 13) {
            try {
                var categoryName = await channel.guild.channels.fetch(`${channel.parentId}`);
            } catch {}
            const bitrateKBs = channel.bitrate / 1000;
    
            await LoggerLog(channel.guild, {
                embeds: [
                    new EmbedBuilder()
                    .setColor(ee.successColor)
                    .setTitle(`:warning: Stage Channel Created :warning:`) 
                    .addFields([{
                        name: 'Stage Name',
                        value: `${channel.name}`
                    }, {
                        name: 'Category',
                        value: `${categoryName?.name === undefined ? "No Category" : categoryName.name}`
                    }, {
                        name: 'Channel kbps',
                        value: `${bitrateKBs} kbps`
                    }, {
                        name: 'User Limit',
                        value: `${channel.userLimit}`
                    }, {
                        name: 'NSFW',
                        value: `${channel?.nsfw === false ? ":x:" : ":white_check_mark:"}`
                    }])
                    .setFooter({text: `Channel ID: ${channel.id}`})
                    .setThumbnail(`https://cdn.discordapp.com/attachments/1010999257899204769/1054749803193585714/support.png`)
                    .setTimestamp()
                ]
            });
        } else if (channel.type === 2) {
            try {
                var categoryName = await channel.guild.channels.fetch(`${channel.parentId}`);
            } catch {}
            const bitrateKBs = channel.bitrate / 1000;
    
            await LoggerLog(channel.guild, {
                embeds: [
                    new EmbedBuilder()
                    .setColor(ee.successColor)
                    .setTitle(`:warning: Voice Channel Created :warning:`)
                    .addFields([{
                        name: 'VC Name',
                        value: `${channel.name}`
                    }, {
                        name: 'Category',
                        value: `${categoryName?.name === undefined ? "No Category" : categoryName.name}`
                    }, {
                        name: 'Channel kbps',
                        value: `${bitrateKBs} kbps`
                    }, {
                        name: 'User Limit',
                        value: `${channel.userLimit}`
                    }, {
                        name: 'NSFW',
                        value: `${channel?.nsfw === false ? ":x:" : ":white_check_mark:"}`
                    }])
                    .setFooter({text: `Channel ID: ${channel.id}`})
                    .setThumbnail(`https://cdn.discordapp.com/attachments/1010999257899204769/1054749803193585714/support.png`)
                    .setTimestamp()
                ]
            });
        } else if (channel.type === 5) {
            try {
                var categoryName = await channel.guild.channels.fetch(`${channel.parentId}`);
            } catch {}
    
            await LoggerLog(channel.guild, {
                embeds: [
                    new EmbedBuilder()
                    .setColor(ee.successColor)
                    .setTitle(`:warning: Announcements Channel Created :warning:`) 
                    .addFields([{
                        name: 'Channel Name',
                        value: `${channel.name}`
                    }, {
                        name: 'Category',
                        value: `${categoryName?.name === undefined ? "No Category" : categoryName.name}`
                    }, {
                        name: 'NSFW',
                        value: `${channel?.nsfw === false ? ":x:" : ":white_check_mark:"}`
                    }])
                    .setFooter({text: `Channel ID: ${channel.id}`})
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