const DBD = require('discord-dashboard');
const getPool = require("../../../handler/database");
const {
    writeError
} = require("../../../handler/functions");
const client = require("../../../index");

module.exports = {
    optionId: 'mod_warn',
    optionName: "Warn Commands",
    optionDescription: "Enable the Warn/Warns/Clearwarns/Removewarning commands to be used by Moderators.",
    optionType: DBD.formTypes.switch(false),
    getActualSet: async ({
        guild,
        user
    }) => {
        try {
            return await client.warnCmd.has(`${guild.id}`);
        } catch (error) {
            return writeError(error, guild);
        }
    },
    setNew: async ({
        guild,
        newData
    }) => {
        const pool = await getPool().getConnection();
        try {
            const [guildData, guildRows] = await pool.query(`SELECT * FROM guild_data WHERE data_ServerId = ${guild.id}`);
            if (guildData.length === 0) return;
            await pool.query(`UPDATE guild_commands SET command_warn = ${newData} WHERE command_ServerId = ${guild.id}`);

            if (newData) {
                client.warnCmd.set(`${guild.id}`, "WarnCMD Enabled!");
            } else {
                client.warnCmd.delete(`${guild.id}`);
            }

            return await pool.release();
        } catch (error) {
            await pool.release();
            return writeError(error, guild);
        }
    }
}