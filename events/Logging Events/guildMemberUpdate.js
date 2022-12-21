const client = require("../../index.js");
const ee = require("../../botconfig/embed.json");
const {
    LoggerLog
} = require("../../handler/functions");
const {
    EmbedBuilder
} = require("discord.js");
const prettyMilliseconds = require("pretty-ms");

client.on("guildMemberUpdate", async (oldMember, newMember) => {
    if (await client.roleUpdates.has(`${newMember.guild.id}`) && await client.loggingmodule.has(`${newMember.guild.id}`)) {
        const removedRoles = oldMember.roles.cache.filter(role => !newMember.roles.cache.has(role.id));
        if (removedRoles.size > 0) {
            await LoggerLog(newMember.guild, {
                embeds: [
                    new EmbedBuilder()
                    .setColor(ee.maintenanceColor)
                    .setTitle(`:warning: Role Removed :warning:`)
                    .addFields([{
                        name: 'Role',
                        value: `<@&${removedRoles.map(r => r.id)}>`
                    }, {
                        name: 'Target',
                        value: `\`\`\`${newMember.user.username}#${newMember.user.discriminator} (${newMember.user.id})\`\`\``
                    }])
                    .setFooter({
                        text: `Target ID: ${newMember.id}`
                    })
                    .setThumbnail(`https://cdn.discordapp.com/attachments/1010999257899204769/1054749803193585714/support.png`)
                    .setTimestamp()
                ]
            });
        }

        const addedRoles = newMember.roles.cache.filter(role => !oldMember.roles.cache.has(role.id));
        if (addedRoles.size > 0) {
            await LoggerLog(newMember.guild, {
                embeds: [
                    new EmbedBuilder()
                    .setColor(ee.maintenanceColor)
                    .setTitle(`:warning: Role Added :warning:`)
                    .addFields([{
                        name: 'Role',
                        value: `<@&${addedRoles.map(r => r.id)}>`
                    }, {
                        name: 'Target',
                        value: `\`\`\`${newMember.user.username}#${newMember.user.discriminator} (${newMember.user.id})\`\`\``
                    }])
                    .setFooter({
                        text: `Target ID: ${newMember.id}`
                    })
                    .setThumbnail(`https://cdn.discordapp.com/attachments/1010999257899204769/1054749803193585714/support.png`)
                    .setTimestamp()
                ]
            });
        }
    }

    if (await client.nicknameUpdates.has(`${newMember.guild.id}`) && await client.loggingmodule.has(`${newMember.guild.id}`)) {
        if (oldMember.nickname !== newMember.nickname) {
            await LoggerLog(newMember.guild, {
                embeds: [
                    new EmbedBuilder()
                    .setColor(ee.maintenanceColor)
                    .setTitle(`:warning: Nickname Changed :warning:`)
                    .addFields([{
                        name: 'Old Nickname',
                        value: `${oldMember.nickname === null ? oldMember.user.username : oldMember.nickname}`
                    }, {
                        name: 'New Nickname',
                        value: `${newMember.nickname === null ? newMember.user.username : newMember.nickname}`
                    }, {
                        name: 'Target',
                        value: `\`\`\`${newMember.user.username}#${newMember.user.discriminator} (${newMember.user.id})\`\`\``
                    }])
                    .setFooter({
                        text: `Target ID: ${newMember.id}`
                    })
                    .setThumbnail(`https://cdn.discordapp.com/attachments/1010999257899204769/1054749803193585714/support.png`)
                    .setTimestamp()
                ]
            });
        }
    }

    if (await client.avatarUpdates.has(`${newMember.guild.id}`) && await client.loggingmodule.has(`${newMember.guild.id}`)) {
        if (oldMember.avatar !== newMember.avatar) {
            await LoggerLog(newMember.guild, {
                embeds: [
                    new EmbedBuilder()
                    .setColor(ee.maintenanceColor)
                    .setTitle(`:warning: Avatar Changed :warning:`)
                    .addFields([{
                        name: 'Old Avatar',
                        value: `[Old Avatar](${oldMember.displayAvatarURL()})`
                    }, {
                        name: 'New Avatar',
                        value: `[New Avatar](${newMember.displayAvatarURL()})`
                    }, {
                        name: 'Target',
                        value: `\`\`\`${newMember.user.username}#${newMember.user.discriminator} (${newMember.user.id})\`\`\``
                    }])
                    .setFooter({
                        text: `Target ID: ${newMember.id}`
                    })
                    .setThumbnail('https://cdn.discordapp.com/attachments/1010999257899204769/1054749803193585714/support.png')
                    .setTimestamp()
                ]
            });
        }
    }

    if (await client.timeoutUpdates.has(`${newMember.guild.id}`) && await client.loggingmodule.has(`${newMember.guild.id}`)) {
        if (newMember.communicationDisabledUntilTimestamp !== null && oldMember.communicationDisabledUntilTimestamp === null) {
            await LoggerLog(newMember.guild, {
                embeds: [
                    new EmbedBuilder()
                    .setColor(ee.errorColor)
                    .setTitle(`:warning: Timeout Added :warning:`)
                    .addFields([{
                        name: 'Timeout Duration',
                        value: `\`\`\`${prettyMilliseconds(newMember.communicationDisabledUntilTimestamp - Date.now())}\`\`\``
                    }, {
                        name: 'Target',
                        value: `${newMember.user}`
                    }])
                    .setFooter({
                        text: `Target ID: ${newMember.id}`
                    })
                    .setThumbnail('https://cdn.discordapp.com/attachments/1010999257899204769/1054749803193585714/support.png')
                    .setTimestamp()
                ]
            });
        }
    
        if (oldMember.communicationDisabledUntilTimestamp !== null && newMember.communicationDisabledUntilTimestamp === null) {
            await LoggerLog(newMember.guild, {
                embeds: [
                    new EmbedBuilder()
                    .setColor(ee.successColor)
                    .setTitle(`:warning: Timeout Removed :warning:`)
                    .addFields([{
                        name: 'Target',
                        value: `${newMember.user}`
                    }])
                    .setFooter({
                        text: `Target ID: ${newMember.id}`
                    })
                    .setThumbnail('https://cdn.discordapp.com/attachments/1010999257899204769/1054749803193585714/support.png')
                    .setTimestamp()
                ]
            });
        }
    }
});