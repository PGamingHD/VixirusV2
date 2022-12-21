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
        const ch = guild.channels.cache.find(channel => channel.type === ChannelType.GuildText && channel.permissionsFor(guild.members.me).has(PermissionFlagsBits.SendMessages) && channel.permissionsFor(guild.members.me).has(PermissionFlagsBits.EmbedLinks));

        if (!ch) return;

        return await ch.send({
            content: await languageControl(guild, 'WELCOME_MSG')
        });
    } catch (error) {
        console.log(error)
    }

    await pool.release();
});