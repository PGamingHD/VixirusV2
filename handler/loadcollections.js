const getPool = require("./database");

module.exports = async (client) => {
    const pool = await getPool().getConnection();
    const [guildData, guildsRow] = await pool.query(`SELECT * FROM guild_data`);
    guildData.forEach(async (guild) => {
        await client.cachedGuildLanguages.set(`${guild.data_ServerId}`, guild.data_language);

        await client.cachedServerPrefixes.set(`${guild.data_ServerId}`, guild.data_prefix);

        await client.cachedWelcomeMessages.set(`${guild.data_ServerId}`, guild.data_welcome);

        if (guild.data_welcomechannel === "") {
            await client.cachedWelcomeChannels.set(`${guild.data_ServerId}`, null);
        } else {
            await client.cachedWelcomeChannels.set(`${guild.data_ServerId}`, guild.data_welcomechannel);
        }

        await client.cachedLeaveMessages.set(`${guild.data_ServerId}`, guild.data_bye);

        if (guild.data_byechannel === "") {
            await client.cachedLeaveChannels.set(`${guild.data_ServerId}`, null);
        } else {
            await client.cachedLeaveChannels.set(`${guild.data_ServerId}`, guild.data_byechannel);
        }

        await client.cachedPrivateMessages.set(`${guild.data_ServerId}`, guild.data_private);

        await client.cachedAutoRoles.set(`${guild.data_ServerId}`, guild.data_autoroles);

        await client.cachedModRoles.set(`${guild.data_ServerId}`, guild.data_modroles);

        await client.cachedWarns.set(`${guild.data_ServerId}`, guild.data_warns);

        await client.cachedMuteds.set(`${guild.data_ServerId}`, guild.data_mutedrole);

        await client.cachedModLogs.set(`${guild.data_ServerId}`, guild.data_modlogs);

        await client.cachedLoggingChannels.set(`${guild.data_ServerId}`, guild.data_logchannel);
    });

    const [guildModules, modulesGuild] = await pool.query(`SELECT * FROM guild_modules;`);
    guildModules.forEach(async (guild) => {
        if (guild.module_welcome) {
            await client.welcomemodule.set(`${guild.module_ServerId}`, "Welcome Enabled!");
        }

        if (guild.module_join) {
            await client.joinmodule.set(`${guild.module_ServerId}`, "Join Enabled!");
        }

        if (guild.module_leave) {
            await client.leavemodule.set(`${guild.module_ServerId}`, "Leave Enabled!");
        }

        if (guild.module_private) {
            await client.privatemodule.set(`${guild.module_ServerId}`, "Private Enabled!");
        }

        if (guild.module_language) {
            await client.languagemodule.set(`${guild.module_ServerId}`, "Language Enabled!");
        }

        if (guild.module_prefix) {
            await client.prefixmodule.set(`${guild.module_ServerId}`, "Prefix Enabled!");
        }

        if (guild.module_role) {
            await client.rolemodule.set(`${guild.module_ServerId}`, "Autoroles Enabled!");
        }

        if (guild.module_fun) {
            await client.funmodule.set(`${guild.module_ServerId}`, "Fun Enabled!");
        }

        if (guild.module_mod) {
            await client.modmodule.set(`${guild.module_ServerId}`, "Mod Enabled!");
        }

        if (guild.module_logging) {
            await client.loggingmodule.set(`${guild.module_ServerId}`, "Logging Enabled!");
        }
    });

    const [guildCommands, commandsGuild] = await pool.query(`SELECT * FROM guild_commands;`);
    guildCommands.forEach(async (guild) => {
        if (guild.command_slowmode) {
            await client.slowmodeCmd.set(`${guild.command_ServerId}`, "SlowmodeCMD Enabled!");
        }

        if (guild.command_ban) {
            await client.banCmd.set(`${guild.command_ServerId}`, "BanCMD Enabled!");
        }

        if (guild.command_warn) {
            await client.warnCmd.set(`${guild.command_ServerId}`, "WarnCMD Enabled!");
        }

        if (guild.command_kick) {
            await client.kickCmd.set(`${guild.command_ServerId}`, "KickCMD Enabled!");
        }

        if (guild.command_lockdown) {
            await client.lockdownCmd.set(`${guild.command_ServerId}`, "KickCMD Enabled!");
        }

        if (guild.command_mute) {
            await client.muteCmd.set(`${guild.command_ServerId}`, "MuteCMD Enabled!");
        }

        if (guild.command_timeout) {
            await client.timeoutCmd.set(`${guild.command_ServerId}`, "TimeoutCMD Enabled!");
        }

        if (guild.command_nickname) {
            await client.nickCmd.set(`${guild.command_ServerId}`, "NicknameCMD Enabled!");
        }

        if (guild.command_purge) {
            await client.purgeCmd.set(`${guild.command_ServerId}`, "PurgeCMD Enabled!");
        }
    });

    const [guildLogs, logsGuild] = await pool.query(`SELECT * FROM guild_logs;`);
    guildLogs.forEach(async (guild) => {
        if (guild.log_roleupdate) {
            await client.roleUpdate.set(`${guild.log_ServerId}`, "RoleUpdate Enabled!");
        }

        if (guild.log_roledelete) {
            await client.roleDelete.set(`${guild.log_ServerId}`, "RoleDelete Enabled!");
        }

        if (guild.log_rolecreate) {
            await client.roleCreate.set(`${guild.log_ServerId}`, "RoleCreate Enabled!");
        }

        if (guild.log_messageupdate) {
            await client.messageUpdate.set(`${guild.log_ServerId}`, "MessageUpdate Enabled!");
        }

        if (guild.log_messagedelete) {
            await client.messageDelete.set(`${guild.log_ServerId}`, "MessageDelete Enabled!");
        }

        if (guild.log_guildupdate) {
            await client.guildUpdate.set(`${guild.log_ServerId}`, "GuildUpdate Enabled!");
        }

        if (guild.log_guildbanremove) {
            await client.guildBanRemove.set(`${guild.log_ServerId}`, "GuildBanRemove Enabled!");
        }

        if (guild.log_guildbanadd) {
            await client.guildBanAdd.set(`${guild.log_ServerId}`, "GuildBanAdd Enabled!");
        }

        if (guild.log_emojiupdate) {
            await client.emojiUpdate.set(`${guild.log_ServerId}`, "EmojiUpdate Enabled!");
        }

        if (guild.log_emojidelete) {
            await client.emojiDelete.set(`${guild.log_ServerId}`, "EmojiDelete Enabled!");
        }

        if (guild.log_emojicreate) {
            await client.emojiCreate.set(`${guild.log_ServerId}`, "EmojiCreate Enabled!");
        }

        if (guild.log_channelupdate) {
            await client.channelUpdate.set(`${guild.log_ServerId}`, "ChannelUpdate Enabled!");
        }

        if (guild.log_channeldelete) {
            await client.channelDelete.set(`${guild.log_ServerId}`, "ChannelDelete Enabled!");
        }

        if (guild.log_channelcreate) {
            await client.channelCreate.set(`${guild.log_ServerId}`, "ChannelCreate Enabled!");
        }

        if (guild.log_guildmemberremove) {
            await client.guildMemberRemove.set(`${guild.log_ServerId}`, "GuildMemberRemove Enabled!");
        }

        if (guild.log_guildmemberadd) {
            await client.guildMemberAdd.set(`${guild.log_ServerId}`, "GuildMemberAdd Enabled!");
        }

        if (guild.log_roleupdates) {
            await client.roleUpdates.set(`${guild.log_ServerId}`, "RoleUpdatez Enabled!");
        }

        if (guild.log_nicknamechanges) {
            await client.nicknameUpdates.set(`${guild.log_ServerId}`, "NicknameChanges Enabled!");
        }

        if (guild.log_avatarchanges) {
            await client.avatarUpdates.set(`${guild.log_ServerId}`, "AvatarUpdates Enabled!");
        }

        if (guild.log_timeoutchanges) {
            await client.timeoutUpdates.set(`${guild.log_ServerId}`, "TimeoutUpdates Enabled!");
        }
    });

    const [punishedData, punishedRows] = await pool.query(`SELECT * FROM user_punishments`);
    punishedData.forEach(async (user) => {
        await client.globalPunishments.set(`${user.punished_userId}`, user.punished_data);
    });
    
    await pool.release();
}