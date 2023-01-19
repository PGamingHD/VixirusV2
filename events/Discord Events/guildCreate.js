const {
    Message,
    MessageEmbed,
    WebhookClient,
    EmbedBuilder,
    ChannelType,
    PermissionFlagsBits
} = require("discord.js");
const emoji = require("../../botconfig/emojis.json")
const ee = require("../../botconfig/embed.json");
const config = require("../../botconfig/config.json");
const client = require("../../index.js");
const {
    languageControl
} = require("../../handler/functions");
const getPool = require("../../handler/database");

client.on("guildCreate", async (guild) => {

    client.logger.log("I just joined a guild called " + guild.name + " (" +  guild.id + ")", "guildjoin");

    const pool = await getPool().getConnection();
    const [isAvailable, guildRows] = await pool.query(`SELECT * FROM guild_modules WHERE module_ServerId = ${guild.id}`);

    if (isAvailable.length === 0) {
        await pool.query(`INSERT INTO guild_data(data_ServerId) VALUES("${guild.id}")`);
        await pool.query(`INSERT INTO guild_commands(command_ServerId) VALUES("${guild.id}")`);
        await pool.query(`INSERT INTO guild_modules(module_ServerId) VALUES("${guild.id}")`);
        await pool.query(`INSERT INTO guild_logs(log_ServerId) VALUES("${guild.id}")`);

        //STARTER VALUES THAT MUST BE RE-SET!
        await client.cachedGuildLanguages.set(`${guild.id}`, "en");
        await client.cachedServerPrefixes.set(`${guild.id}`, "v!");
        await client.cachedWelcomeMessages.set(`${guild.id}`, "Hey {user}, welcome to **{server}**!");
        await client.cachedWelcomeChannels.set(`${guild.id}`, null);
        await client.cachedLeaveMessages.set(`${guild.id}`, "{user} just left the server!");
        await client.cachedLeaveChannels.set(`${guild.id}`, null);
        await client.cachedPrivateMessages.set(`${guild.id}`, "Have a great time in **{server}**!");
        
        await client.funmodule.set(`${guild.id}`, "Fun Enabled!");

        await client.slowmodeCmd.set(`${guild.id}`, "SlowmodeCMD Enabled!");
        await client.banCmd.set(`${guild.id}`, "BanCMD Enabled!");
        await client.warnCmd.set(`${guild.id}`, "WarnCMD Enabled!");
        await client.kickCmd.set(`${guild.id}`, "KickCMD Enabled!");
        await client.lockdownCmd.set(`${guild.id}`, "LockdownCMD Enabled!");
        await client.muteCmd.set(`${guild.id}`, "MuteCMD Enabled!");
        await client.timeoutCmd.set(`${guild.id}`, "TimeoutCMD Enabled!");
        await client.nickCmd.set(`${guild.id}`, "NicknameCMD Enabled!");
        await client.purgeCmd.set(`${guild.id}`, "PurgeCMD Enabled!");

        await client.roleUpdate.set(`${guild.id}`, "RoleUpdate Enabled!");
        await client.roleDelete.set(`${guild.id}`, "RoleDelete Enabled!");
        await client.roleCreate.set(`${guild.id}`, "RoleCreate Enabled!");
        await client.messageUpdate.set(`${guild.id}`, "MessageUpdate Enabled!");
        await client.messageDelete.set(`${guild.id}`, "MessageDelete Enabled!");
        await client.guildUpdate.set(`${guild.id}`, "GuildUpdate Enabled!");
        await client.guildBanRemove.set(`${guild.id}`, "GuildBanRemove Enabled!");
        await client.guildBanAdd.set(`${guild.id}`, "GuildBanAdd Enabled!");
        await client.emojiUpdate.set(`${guild.id}`, "EmojiUpdate Enabled!");
        await client.emojiDelete.set(`${guild.id}`, "EmojiDelete Enabled!");
        await client.emojiCreate.set(`${guild.id}`, "EmojiCreate Enabled!");
        await client.channelUpdate.set(`${guild.id}`, "ChannelUpdate Enabled!");
        await client.channelDelete.set(`${guild.id}`, "ChannelDelete Enabled!");
        await client.channelCreate.set(`${guild.id}`, "ChannelCreate Enabled!");
        await client.guildMemberRemove.set(`${guild.id}`, "GuildMemberRemove Enabled!");
        await client.guildMemberAdd.set(`${guild.id}`, "GuildMemberAdd Enabled!");
        await client.roleUpdates.set(`${guild.id}`, "RoleUpdatez Enabled!");
        await client.nicknameUpdates.set(`${guild.id}`, "NicknameUpdates Enabled!");
        await client.avatarUpdates.set(`${guild.id}`, "AvatarUpdates Enabled!");
        await client.timeoutUpdates.set(`${guild.id}`, "TimeoutUpdates Enabled!");
    }

    try {
        const ch = guild.channels.cache.find(channel => channel.type === ChannelType.GuildText && channel.permissionsFor(guild.members.me).has(PermissionFlagsBits.SendMessages));

        if (!ch) return;

        return await ch.send({
            embeds: [
                new EmbedBuilder()
                .setColor(ee.hidden)
                .setThumbnail('https://cdn.discordapp.com/attachments/1063980215505788958/1063980431931883560/ad2e4d6e7b90ca6005a5038e22b099cc.png')
                .setDescription(`🛡️ ***Server Protected by VixirusV2*** 🛡️\n\n\`• How is your server protected?\`\n*- With our system, if an earlier punished user joins your server you will be alerted with the reason and can from there decide to punish the user in your own server aswell.*\n\n\`• Is this system really reliable?\`\n*- Not only is this system armed with a strong logging system, the system is also a very good defense against known raiders / known rule breakers!*\n\n\`• Is this system configurable?\`\n*- This system has large configurability, configure the system to your own liking through our dashboard [here](https://lualock.com)!*\n\n\`• Are we allowed to suggest new features?\`\n*- Yes, we really appreciate new suggestions so that we can improve the product. Please join our support server and suggest new features all you want! :)*\n\n\`• Where can I get support for this product?\`\n*- The support server can be found [here](${config.Discord_Links.Support_Server}), don't hesitate to join and ask questions.*\n\n🛡️ ***Server Protected by VixirusV2*** 🛡️`)
                .setFooter({text: 'by PG Technologies™'})
                .setTimestamp()
            ]
        });
    } catch {}

    await pool.release();
});