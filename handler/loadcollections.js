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

        if (guild.module_slowmode) {
            await client.slowmodemodule.set(`${guild.module_ServerId}`, "Slowmode Enabled!");
        }

        if (guild.module_fun) {
            await client.funmodule.set(`${guild.module_ServerId}`, "Fun Enabled!");
        }

        if (guild.module_mod) {
            await client.modmodule.set(`${guild.module_ServerId}`, "Mod Enabled!");
        }

        if (guild.module_modlogs) {
            await client.modlogmodule.set(`${guild.module_ServerId}`, "Modlogs Enabled!");
        }
    });
    
    await pool.release();
}